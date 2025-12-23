import { useState } from 'react';
import { CartItem } from '../contexts/CartContext';

interface InvoiceItem {
  _productName: string;
  quantity: number;
  _productUnitPrice: number;
  _productCostPrice: number;
  _productUnitCfx: number;
  _productUnitTotal: number;
  _productInstanceId: string;
  _productUnitName: string;
  _productId: string;
  _productUnitId: string;
  _productUnitQty: number;
  _productUnitSymbol: string;
  unitPrice: number;
  buyingPrice: number;
  itemName: string;
  itemId: string;
}

interface CreateInvoiceParams {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentReference: string;
  paymentMethod?: string;
  reservationDate?: string;
  reservationTime?: string;
  partySize?: number;
}

interface CreateInvoiceResponse {
  success: boolean;
  invoiceId?: string;
  invoiceReference?: string;
  error?: string;
}

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (params: CreateInvoiceParams): Promise<CreateInvoiceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const {
        items,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        paymentReference,
        paymentMethod = 'card',
        reservationDate,
        reservationTime,
        partySize,
      } = params;

      // Get API credentials from environment variables
      const authToken = process.env.NEXT_PUBLIC_SHOPKEEPER_AUTH_TOKEN;
      const branchId = process.env.NEXT_PUBLIC_SHOPKEEPER_BRANCH_ID;
      const businessId = process.env.NEXT_PUBLIC_SHOPKEEPER_BUSINESS_ID;
      const memberId = process.env.NEXT_PUBLIC_SHOPKEEPER_MEMBER_ID;

      if (!authToken || !branchId || !businessId || !memberId) {
        const missing = [];
        if (!authToken) missing.push('NEXT_PUBLIC_SHOPKEEPER_AUTH_TOKEN');
        if (!branchId) missing.push('NEXT_PUBLIC_SHOPKEEPER_BRANCH_ID');
        if (!businessId) missing.push('NEXT_PUBLIC_SHOPKEEPER_BUSINESS_ID');
        if (!memberId) missing.push('NEXT_PUBLIC_SHOPKEEPER_MEMBER_ID');
        
        throw new Error(
          `Shopkeeper API credentials are not configured. Missing: ${missing.join(', ')}. ` +
          `Please add these to your .env.local file. See README.md for setup instructions.`
        );
      }

      // Map cart items to invoice items format
      const invoiceItems: InvoiceItem[] = items.map((item, index) => {
        const itemId = `item-${item.id}-${Date.now()}-${index}`;
        return {
          _productName: item.name,
          quantity: item.quantity,
          _productUnitPrice: item.price,
          _productCostPrice: 0,
          _productUnitCfx: 1,
          _productUnitTotal: item.price * item.quantity,
          _productInstanceId: '',
          _productUnitName: '',
          _productId: itemId,
          _productUnitId: '',
          _productUnitQty: item.quantity,
          _productUnitSymbol: '',
          unitPrice: item.price,
          buyingPrice: 0,
          itemName: item.name,
          itemId: itemId,
        };
      });

      // Add Customer Information item
      // Using minimal price of 1 kobo since API doesn't accept 0 price
      if (customerName || customerPhone) {
        const customerItemId = `customer-${Date.now()}`;
        const customerDetails: string[] = [];
        if (customerName) {
          customerDetails.push(customerName);
        }
        if (customerPhone) {
          customerDetails.push(customerPhone);
        }
        
        const customerItemName = `Customer${customerDetails.length > 0 ? `: ${customerDetails.join(' - ')}` : ''}`;
        const minimalPrice = 1; // 1 kobo (minimum valid price)
        
        invoiceItems.push({
          _productName: customerItemName,
          quantity: 1,
          _productUnitPrice: minimalPrice,
          _productCostPrice: 0,
          _productUnitCfx: 1,
          _productUnitTotal: minimalPrice,
          _productInstanceId: '',
          _productUnitName: '',
          _productId: customerItemId,
          _productUnitId: '',
          _productUnitQty: 1,
          _productUnitSymbol: '',
          unitPrice: minimalPrice,
          buyingPrice: 0,
          itemName: customerItemName,
          itemId: customerItemId,
        });
      }

      // Add Booking/Reservation item with party size and reservation time
      // Using minimal price of 1 kobo since API doesn't accept 0 price
      if (partySize || reservationTime) {
        const bookingItemId = `booking-${Date.now()}`;
        const bookingDetails: string[] = [];
        if (partySize) {
          bookingDetails.push(`${partySize} guests`);
        }
        if (reservationTime) {
          // Format time for display (e.g., "19:00" -> "7:00 PM")
          const [hours, minutes] = reservationTime.split(':');
          const hour24 = parseInt(hours);
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const ampm = hour24 >= 12 ? 'PM' : 'AM';
          bookingDetails.push(`${hour12}:${minutes} ${ampm}`);
        }
        
        const bookingItemName = `Reservation Booking${bookingDetails.length > 0 ? `: ${bookingDetails.join(' - ')}` : ''}`;
        const minimalPrice = 1; // 1 kobo (minimum valid price)
        
        invoiceItems.push({
          _productName: bookingItemName,
          quantity: 1,
          _productUnitPrice: minimalPrice,
          _productCostPrice: 0,
          _productUnitCfx: 1,
          _productUnitTotal: minimalPrice,
          _productInstanceId: '',
          _productUnitName: '',
          _productId: bookingItemId,
          _productUnitId: '',
          _productUnitQty: 1,
          _productUnitSymbol: '',
          unitPrice: minimalPrice,
          buyingPrice: 0,
          itemName: bookingItemName,
          itemId: bookingItemId,
        });
      }

      // Calculate totals (excluding party size which is 0)
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const invoiceReference = `REF-${Date.now()}`;
      const invoiceDate = new Date().toISOString();
      
      // Calculate dueDate from reservation date/time
      let dueDate: string;
      if (reservationDate && reservationTime) {
        // Parse reservation date and time
        const [year, month, day] = reservationDate.split('-').map(Number);
        const [hours, minutes] = reservationTime.split(':').map(Number);
        
        // Create date object with reservation date and time
        const reservationDateTime = new Date(year, month - 1, day, hours, minutes);
        dueDate = reservationDateTime.toISOString();
      } else {
        // Fallback to 7 days from now if no reservation date/time
        dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const paymentDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

      // Prepare invoice payload
      const invoiceData = {
        branchId,
        businessId,
        invoiceDate,
        items: invoiceItems,
        purchaseOnCredit: false,
        status: 'pending',
        type: 'sale',
        associateId: '',
        deliveryCompleted: false,
        description: `Order from ${customerName}${partySize ? ` - Party Size: ${partySize} guests` : ''}${reservationDate && reservationTime ? ` - Reservation: ${reservationDate} at ${reservationTime}` : ''}`,
        dueDate,
        discountType: 'none',
        discountValue: 0,
        taxType: 'tax',
        taxRate: 0,
        deliveryStatus: 'pending',
        invoiceReference,
        paymentTerms: 'month-end',
        paymentMethod,
        deliveryMethod: 'in-person',
        includesServices: false,
        memberId,
        meta: {
          createdBy: 'Nature\'s Crunch & Burst - Online Order',
          customerName: customerName || 'Walk-in Customer',
          memberName: 'Nature\'s Crunch & Burst',
          memberRole: 'owner',
          customerEmail,
          customerPhone,
          deliveryAddress,
          paymentReference,
        },
        notes: `Order placed online. Payment reference: ${paymentReference}.${partySize ? ` Party Size: ${partySize} guests.` : ''}${reservationDate ? ` Reservation Date: ${reservationDate}.` : ''}${reservationTime ? ` Reservation Time: ${reservationTime}.` : ''}`,
        termsAndConditions: '',
        initialPaymentAmount: subtotal,
        requiresDelivery: true,
        paymentDueDate,
        confirmStockAvailability: false,
        useWholesalePrice: false,
        invoiceDeliveryMethod: 'in-person',
        paymentParts: [],
      };

      // Make API request
      const response = await fetch('https://api.bigmerchant.co/v1/shopkeeper/invoices', {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
          'x-branch-id': branchId,
          'x-member-id': memberId,
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create invoice: ${response.statusText}`
        );
      }

      const result = await response.json();

      setLoading(false);
      return {
        success: true,
        invoiceId: result.id || result._id,
        invoiceReference: result.invoiceReference || invoiceReference,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    createInvoice,
    loading,
    error,
  };
}

