import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

// In-memory storage for orders (replace with your database model)
const orders = new Map();

// Interface for order creation request
interface CreateOrderRequest {
  amount: number;
  currency?: string;
  description?: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
}

// Interface for payment verification request
interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Route: Create Order
router.post('/create-order', async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'INR', 
      description = 'Payment', 
      customerName, 
      customerEmail, 
      customerContact 
    }: CreateOrderRequest = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
      return;
    }

    if (!customerName || !customerEmail || !customerContact) {
      res.status(400).json({
        success: false,
        message: 'Customer details are required'
      });
      return;
    }

    // Create order with Razorpay
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        description,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_contact: customerContact
      }
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Store order details (replace with your database save logic)
    const orderData = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: 'created',
      customerDetails: {
        name: customerName,
        email: customerEmail,
        contact: customerContact
      },
      description,
      createdAt: new Date(),
      razorpayOrder
    };

    orders.set(razorpayOrder.id, orderData);

    console.log(`✅ Order created: ${razorpayOrder.id} for amount: ₹${amount}`);

    // Send response to frontend
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
      receipt: razorpayOrder.receipt
    });

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Route: Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    }: VerifyPaymentRequest = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
      return;
    }

    // Get order details (replace with your database query)
    const orderDetails = orders.get(razorpay_order_id);
    if (!orderDetails) {
      res.status(400).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Create signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify signature
    if (generatedSignature === razorpay_signature) {
      // Payment is authentic
      
      // Update order status (replace with your database update logic)
      orderDetails.status = 'paid';
      orderDetails.paymentId = razorpay_payment_id;
      orderDetails.signature = razorpay_signature;
      orderDetails.paidAt = new Date();
      
      orders.set(razorpay_order_id, orderDetails);

      console.log(`✅ Payment verified: ${razorpay_payment_id}`);
      console.log(`✅ Order ${razorpay_order_id} marked as paid`);

      // Here you would typically:
      // 1. Update your database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Create transaction record
      // 5. Notify other services
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'paid'
      });

    } else {
      // Invalid signature
      console.log('❌ Payment verification failed - invalid signature');
      
      // Update order status to failed
      orderDetails.status = 'failed';
      orderDetails.failureReason = 'Invalid signature';
      orders.set(razorpay_order_id, orderDetails);
      
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (error: any) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// Route: Get Order Details
router.get('/order/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order from storage (replace with your database query)
    const orderDetails = orders.get(orderId);
    
    if (!orderDetails) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Send public order details (don't expose sensitive data)
    const publicOrderDetails = {
      orderId: orderDetails.orderId,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      status: orderDetails.status,
      description: orderDetails.description,
      customerDetails: orderDetails.customerDetails,
      createdAt: orderDetails.createdAt,
      paidAt: orderDetails.paidAt || null,
      paymentId: orderDetails.paymentId || null
    };

    res.json({
      success: true,
      order: publicOrderDetails
    });

  } catch (error: any) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

// Route: List All Orders (for testing/admin)
router.get('/orders', (req, res) => {
  try {
    const allOrders = Array.from(orders.values()).map(order => ({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      description: order.description,
      customerDetails: order.customerDetails,
      createdAt: order.createdAt,
      paidAt: order.paidAt || null,
      paymentId: order.paymentId || null
    }));

    res.json({
      success: true,
      orders: allOrders,
      total: allOrders.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Route: Health check for payment service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Razorpay payment service is running',
    timestamp: new Date().toISOString(),
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET
  });
});

export default router;