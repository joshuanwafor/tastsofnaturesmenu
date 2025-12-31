'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { useRouter } from 'next/navigation';
import { useCreateInvoice } from '../hooks/useCreateInvoice';

const MINIMUM_SPEND = 150000; // ₦150,000

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

// Generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 19; // 7 PM
  const endHour = 3; // 3 AM next day
  
  for (let hour = startHour; hour < 24; hour++) {
    slots.push(`${hour}:00`, `${hour}:30`);
  }
  for (let hour = 0; hour <= endHour; hour++) {
    slots.push(`${hour}:00`, `${hour}:30`);
  }
  return slots;
};

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const { createInvoice, loading: invoiceLoading } = useCreateInvoice();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const timeSlots = generateTimeSlots();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    partySize: 1,
    date: '',
    time: '',
  });

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
      const checkPaystack = setInterval(() => {
        if (window.PaystackPop) {
          setPaystackReady(true);
          clearInterval(checkPaystack);
        }
      }, 100);

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

    if (getTotal() < MINIMUM_SPEND) {
      alert(`Baseline spend of ${formatPrice(MINIMUM_SPEND)} required for checkout. Please add more items to your cart.`);
      return;
    }

    if (!paystackReady || !window.PaystackPop) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_...';

      if (!publicKey || publicKey === 'pk_test_...') {
        alert('Paystack public key is not configured. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment variables.');
        setLoading(false);
        return;
      }
      const handler = window.PaystackPop!.setup({
        key: publicKey,
        email: formData.email,
        amount: getTotal() * 100,
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
              display_name: 'Party Size',
              variable_name: 'party_size',
              value: formData.partySize.toString(),
            },
            {
              display_name: 'Reservation Date',
              variable_name: 'reservation_date',
              value: formData.date,
            },
            {
              display_name: 'Reservation Time',
              variable_name: 'reservation_time',
              value: formData.time,
            },
          ],
        },
        callback: function (response: any) {
          setProcessingPayment(true);
          const customerName = `${formData.firstName} ${formData.lastName}`.trim() || 'Customer';
          
          createInvoice({
            items,
            customerName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: `Reservation: ${formData.partySize} guests on ${formData.date} at ${formData.time}`,
            paymentReference: response.reference,
            paymentMethod: 'card',
            reservationDate: formData.date,
            reservationTime: formData.time,
            partySize: formData.partySize,
            originalTotal: getTotal(), // Payment amount
          }).then((invoiceResult) => {
            if (invoiceResult.success) {
              console.log('Invoice created successfully:', invoiceResult.invoiceReference);
              clearCart();
              setProcessingPayment(false);
              router.push('/success');
            } else {
              console.error('Invoice creation failed:', invoiceResult.error);
              if (invoiceResult.error?.includes('not configured')) {
                console.warn('Invoice creation skipped - credentials not configured. Payment was successful.');
              } else {
                console.warn('Invoice creation had an issue, but payment was successful.');
              }
              clearCart();
              setProcessingPayment(false);
              router.push('/success');
            }
          }).catch((error) => {
            console.error('Error creating invoice:', error);
            if (error.message?.includes('not configured')) {
              console.warn('Invoice creation skipped - credentials not configured. Payment was successful.');
            }
            clearCart();
            setProcessingPayment(false);
            router.push('/success');
          });
        },
        onClose: function () {
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

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Loading overlay for payment processing
  if (processingPayment) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light mb-4">Processing Your Order</h2>
          <p className="text-white/60 font-light text-sm sm:text-base">
            Creating your reservation... Please wait.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-light mb-4">Your cart is empty</h1>
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

  const isMinimumMet = getTotal() >= MINIMUM_SPEND;
  const remaining = MINIMUM_SPEND - getTotal();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-extralight mb-8 sm:mb-12 text-center">Checkout</h1>

        {/* Minimum Spend Warning */}
        {!isMinimumMet && (
          <div className="mb-6 p-4 bg-amber-900/20 border border-amber-800/50 text-amber-200 text-center">
            <p className="text-sm font-light">
              Baseline spend of {formatPrice(MINIMUM_SPEND)} required. Add {formatPrice(remaining)} more to checkout.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
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
            <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-4">
              <span className="text-xl font-light">Total</span>
              <span className="text-2xl font-light">{formatPrice(getTotal())}</span>
            </div>
            {!isMinimumMet && (
              <div className="text-sm text-amber-200/60 font-light text-center">
                {formatPrice(remaining)} remaining to reach minimum
              </div>
            )}
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">
              Reservation Details
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

              {/* Reservation Section */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-white/80 mb-4 font-light">
                  Select your details and we&apos;ll try to get the best seats for you.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2 font-light">
                      Party Size *
                    </label>
                    <select
                      required
                      value={formData.partySize}
                      onChange={(e) =>
                        setFormData({ ...formData, partySize: parseInt(e.target.value) })
                      }
                      className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map((size) => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2 font-light">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value, time: '' })
                      }
                      className="w-full bg-gray-950 border border-white/10 px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-4 font-light">
                      Time *
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {timeSlots.map((slot) => {
                        const isSelected = formData.time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-light border transition-all duration-300 ${
                              isSelected
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white border-white/20 hover:border-white/40'
                            }`}
                          >
                            {formatTimeDisplay(slot)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || invoiceLoading || !isMinimumMet || !formData.time}
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
