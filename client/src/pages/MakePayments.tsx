import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const MakePayments: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error' | 'processing'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 99.99,
    currency: 'USD',
    description: 'Premium Subscription',
    customerEmail: 'customer@example.com'
  });

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    }
  });

  useEffect(() => {
    const savedMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026
      },
      {
        id: '2',
        type: 'card',
        last4: '0005',
        brand: 'Mastercard',
        expiryMonth: 8,
        expiryYear: 2025
      }
    ];
    setPaymentMethods(savedMethods);
  }, []);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = (cardNumber: string): boolean => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.length < 13 || num.length > 19) return false;
    
    let sum = 0;
    let alternate = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const simulatePaymentProcessing = async (paymentMethodId?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve(success);
      }, 2000);
    });
  };

  const processPayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      let success = false;

      if (selectedMethod && selectedMethod !== 'new') {
        success = await simulatePaymentProcessing(selectedMethod);
      } else {
        if (!validateCard(formData.cardNumber)) {
          throw new Error('Invalid card number');
        }
        
        if (!formData.expiryDate || !formData.cvv || !formData.cardholderName) {
          throw new Error('Please fill in all required fields');
        }

        success = await simulatePaymentProcessing();
      }

      if (success) {
        setPaymentStatus('success');
      } else {
        throw new Error('Payment was declined. Please try a different payment method.');
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setShowAddCard(false);
    setSelectedMethod('');
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
    outline: 'none'
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
  fontWeight: 600, // ✅ number, not string
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)',
  textTransform: 'uppercase', // ✅ valid enum
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

  const paymentMethodStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#ffffff'
  };

  const paymentMethodSelectedStyle = {
    ...paymentMethodStyle,
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.1)'
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
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', marginBottom: '32px', lineHeight: '1.6' }}>
            Your payment of ${paymentData.amount} has been processed successfully.
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
            Make Payment
          </h2>
        </div>

        {/* Payment Summary */}
        <div style={summaryStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>Amount:</span>
            <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
              ${paymentData.amount} {paymentData.currency}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>Description:</span>
            <span style={{ color: '#ffffff', fontSize: '16px' }}>{paymentData.description}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Payment Method
          </h3>
          
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={selectedMethod === method.id ? paymentMethodSelectedStyle : paymentMethodStyle}
              onClick={() => setSelectedMethod(method.id)}
            onMouseEnter={(e) => {
            if (selectedMethod !== method.id) {
                const target = e.currentTarget as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.08)';
                target.style.transform = 'translateY(-1px)';
            }
              }}
onMouseLeave={(e) => {
  if (selectedMethod !== method.id) {
    const target = e.currentTarget as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.05)';
    target.style.transform = 'translateY(0)';
  }
}}

            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  style={{ marginRight: '16px', accentColor: '#ffffff' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                    {method.brand} ending in {method.last4}
                  </div>
                  {method.expiryMonth && method.expiryYear && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div
            style={selectedMethod === 'new' || showAddCard ? paymentMethodSelectedStyle : paymentMethodStyle}
            onClick={() => {
              setSelectedMethod('new');
              setShowAddCard(true);
            }}
onMouseEnter={(e) => {
  if (selectedMethod !== 'new') {
    const target = e.currentTarget as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.08)';
    target.style.transform = 'translateY(-1px)';
  }
}}
onMouseLeave={(e) => {
  if (selectedMethod !== 'new') {
    const target = e.currentTarget as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.05)';
    target.style.transform = 'translateY(0)';
  }
}}

          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                checked={selectedMethod === 'new'}
                onChange={() => {
                  setSelectedMethod('new');
                  setShowAddCard(true);
                }}
                style={{ marginRight: '16px', accentColor: '#ffffff' }}
              />
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Add new card</span>
            </div>
          </div>
        </div>

        {/* New Card Form */}
        {showAddCard && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <style>
              {`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.billingAddress.street}
                  onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                  placeholder="123 Main St"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.city}
                    onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                    placeholder="New York"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.state}
                    onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                    placeholder="NY"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.billingAddress.postalCode}
                  onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
                  placeholder="10001"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>
          </div>
        )}

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
            Your payment information is encrypted and secure
          </span>
        </div>

        {/* Payment Button */}
<button
  onClick={processPayment}
  disabled={processing || !selectedMethod}
  style={processing || !selectedMethod ? buttonDisabledStyle : buttonStyle}
  onMouseEnter={(e) => {
    if (!processing && selectedMethod) {
      Object.assign((e.currentTarget as HTMLButtonElement).style, buttonHoverStyle);
    }
  }}
  onMouseLeave={(e) => {
    if (!processing && selectedMethod) {
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
            `Pay $${paymentData.amount}`
          )}
        </button>

        <p style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '20px',
          lineHeight: '1.5'
        }}>
          By clicking "Pay", you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default MakePayments;