// Razorpay Test Mode Integration

// Start the server: npm run dev
// Check health: http://localhost:5000/api/razorpay/health
// Use the React component to make payments

// What This Integration Provides

// Secure Order Creation   : Backend creates orders with proper validation
// Payment Verification    : Cryptographic signature verification
// Order Tracking          : Get order status and details
// Error Handling          : Comprehensive error handling
// TypeScript Support      : Full type safety
// Integration Ready       : Works with your existing server structure

// The payment flow now goes:

// Frontend    →   Backend (/api/razorpay/create-order)
// Backend     →   Razorpay API (creates order)
// Frontend    →   Razorpay UI (user pays)
// Frontend    →   Backend (/api/razorpay/verify-payment)
// Backend verifies payment authenticity

import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, XCircle } from 'lucide-react';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  customerContact: string;
}

const MakePayments: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error' | 'processing'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentId, setPaymentId] = useState('');
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 1,
    currency: 'INR',
    description: 'Vendor Payment',
    customerEmail: 'company-online@gmail.com',
    customerName: 'C O',
    customerContact: '9999999999'
  });

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order from backend
      const orderResponse = await fetch('http://localhost:5000/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          customerContact: paymentData.customerContact
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Razorpay options
      const options = {
        key: orderData.key, // Key comes from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VenPay',
        description: paymentData.description,
        order_id: orderData.orderId, // Order ID from backend
        image: 'https://your-logo-url.com/logo.png',
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setPaymentId(response.razorpay_payment_id);
              setPaymentStatus('success');
            } else {
              setPaymentStatus('error');
              setErrorMessage('Payment verification failed');
            }
          } catch (error) {
            setPaymentStatus('error');
            setErrorMessage('Payment verification failed');
          }
          setProcessing(false);
        },
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerContact
        },
        notes: {
          address: 'Test Address'
        },
        theme: {
          color: '#ffffff'
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('error');
            setErrorMessage('Payment cancelled by user');
            setProcessing(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        setPaymentStatus('error');
        setErrorMessage(`Payment Failed: ${response.error.description}`);
        setProcessing(false);
        console.log('Payment Failed:', response.error);
      });
      
      paymentObject.open();
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment initialization failed');
      setProcessing(false);
      console.error('Payment Error:', error);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setPaymentId('');
  };

  const handleInputChange = (field: keyof PaymentData, value: string | number) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const containerStyle = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    transform: 'translateY(0px)',
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  const inputFocusStyle = {
    ...inputStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '14px',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(255, 255, 255, 0.25)',
    background: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.4)',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  };

  const summaryStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  if (paymentStatus === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          animation: 'fadeInScale 0.6s ease-out'
        }}>
          <style>
            {`
              @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.9) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
            `}
          </style>
          <div style={{ animation: 'pulse 2s infinite' }}>
            <CheckCircle style={{ width: '80px', height: '80px', color: '#4ade80', margin: '0 auto 24px' }} />
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', marginBottom: '16px', lineHeight: '1.6' }}>
            Your payment of ₹{paymentData.amount} has been processed successfully.
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '32px' }}>
            Payment ID: {paymentId}
          </p>
          <button
            onClick={resetPayment}
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign((e.currentTarget as HTMLButtonElement).style, buttonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign((e.currentTarget as HTMLButtonElement).style, buttonStyle)
            }
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <CreditCard style={{ width: '32px', height: '32px', color: '#ffffff', marginRight: '12px' }} />
          <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
            Secure Payment
          </h2>
        </div>

        {/* Payment Configuration */}
        <div style={summaryStyle}>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Payment Details
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                min="1"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Description
              </label>
              <input
                type="text"
                value={paymentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  value={paymentData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={paymentData.customerContact}
                  onChange={(e) => handleInputChange('customerContact', e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Customer Email
              </label>
              <input
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {paymentStatus === 'error' && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <style>
              {`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  75% { transform: translateX(5px); }
                }
              `}
            </style>
            <XCircle style={{ width: '20px', height: '20px', color: '#ef4444', marginRight: '12px' }} />
            <span style={{ color: '#ef4444', fontSize: '14px' }}>{errorMessage}</span>
          </div>
        )}

        {/* Security Notice */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Lock style={{ width: '20px', height: '20px', color: '#22c55e', marginRight: '12px' }} />
          <span style={{ color: '#22c55e', fontSize: '14px' }}>
            Secured by Razorpay with order verification
          </span>     
        </div>

        {/* Payment Button */}
        <button
          onClick={processPayment}
          disabled={processing || paymentData.amount <= 0}
          style={processing || paymentData.amount <= 0 ? buttonDisabledStyle : buttonStyle}
          onMouseEnter={(e) => {
            if (!processing && paymentData.amount > 0) {
              Object.assign((e.currentTarget as HTMLButtonElement).style, buttonHoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!processing && paymentData.amount > 0) {
              Object.assign((e.currentTarget as HTMLButtonElement).style, buttonStyle);
            }
          }}
        >
          {processing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(26, 26, 26, 0.3)',
                borderTop: '2px solid #1a1a1a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '12px'
              }}></div>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              Processing Payment...
            </div>
          ) : (
            `Pay ₹${paymentData.amount} Securely`
          )}
        </button>

        <p style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '20px',
          lineHeight: '1.5'
        }}>
          Your payment will be processed through Razorpay's secure gateway with order verification.
        </p>
      </div>
    </div>
  );
};

export default MakePayments;