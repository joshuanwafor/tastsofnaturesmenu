'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { useRouter } from 'next/navigation';
import { useCreateInvoice } from '../hooks/useCreateInvoice';

interface PaystackPop {
  setup(options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata?: {
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    callback?: (response: { reference: string }) => void;
    onClose?: () => void;
  }): {
    openIframe: () => void;
  };
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const { createInvoice, loading: invoiceLoading } = useCreateInvoice();
  const [loading, setLoading] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }

    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      // Wait a bit for PaystackPop to be available
      const checkPaystack = setInterval(() => {
        if (window.PaystackPop) {
          setPaystackReady(true);
          clearInterval(checkPaystack);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkPaystack);
        if (!window.PaystackPop) {
          console.error('Paystack script failed to load');
        }
      }, 5000);
    };

    script.onerror = () => {
      console.error('Failed to load Paystack script');
    };

    document.body.appendChild(script);

    return () => {
      // Only remove if it exists
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!paystackReady || !window.PaystackPop) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);

    try {
      // In production, you would call your backend API to initialize the payment
      // For now, we'll use a test public key
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_...';

      if (!publicKey || publicKey === 'pk_test_...') {
        alert('Paystack public key is not configured. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment variables.');
        setLoading(false);
        return;
      }

      const handler = window.PaystackPop!.setup({
        key: publicKey,
        email: formData.email,
        amount: getTotal() * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: `ref_${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: 'First Name',
              variable_name: 'first_name',
              value: formData.firstName,
            },
            {
              display_name: 'Last Name',
              variable_name: 'last_name',
              value: formData.lastName,
            },
            {
              display_name: 'Phone',
              variable_name: 'phone',
              value: formData.phone,
            },
            {
              display_name: 'Address',
              variable_name: 'address',
              value: formData.address,
            },
          ],
        },
        callback: function (response: any) {
          // Payment successful - create invoice in shopkeeperpos
          const customerName = `${formData.firstName} ${formData.lastName}`.trim() || 'Customer';
          
          // Handle async invoice creation
          createInvoice({
            items,
            customerName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: formData.address,
            paymentReference: response.reference,
            paymentMethod: 'card',
          }).then((invoiceResult) => {
            if (invoiceResult.success) {
              console.log('Invoice created successfully:', invoiceResult.invoiceReference);
              clearCart();
              router.push('/success');
            } else {
              // Payment succeeded but invoice creation failed
              console.error('Invoice creation failed:', invoiceResult.error);
              
              // If it's a configuration error, log it but don't show alert to user
              // Payment was successful, so we proceed normally
              if (invoiceResult.error?.includes('not configured')) {
                console.warn('Invoice creation skipped - credentials not configured. Payment was successful.');
              } else {
                // For other errors, show a less alarming message
                console.warn('Invoice creation had an issue, but payment was successful.');
              }
              
              clearCart();
              router.push('/success');
            }
          }).catch((error) => {
            // Payment succeeded but invoice creation had an error
            console.error('Error creating invoice:', error);
            
            // Don't block the user flow - payment was successful
            // Just log the error for debugging
            if (error.message?.includes('not configured')) {
              console.warn('Invoice creation skipped - credentials not configured. Payment was successful.');
            }
            
            clearCart();
            router.push('/success');
          });
        },
        onClose: function () {
          // User closed the payment modal
          setLoading(false);
          alert('Payment cancelled');
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="border border-white/20 px-8 py-3 font-light hover:border-white/40 transition-colors"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-extralight mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-white/10 pb-4"
                >
                  <div>
                    <p className="text-white font-light">{item.name}</p>
                    <p className="text-white/60 text-sm font-extralight">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-white font-light">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-xl font-light">Total</span>
              <span className="text-2xl font-light">{formatPrice(getTotal())}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">
              Delivery Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-white/60 mb-2 font-light">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-light">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-light">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2 font-light">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="0803 957 6886"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2 font-light">
                  Delivery Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors h-24 resize-none"
                  placeholder="Suite 8, Rhomat plaza, Rayfield, Jos"
                />
              </div>

              <button
                type="submit"
                disabled={loading || invoiceLoading}
                className="w-full bg-white text-black py-4 font-light hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || invoiceLoading ? 'Processing...' : `Pay ${formatPrice(getTotal())}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

