export const paymentRequestsStyles = `
  .vendor-requests-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    animation: fadeInUp 0.6s ease-out;
  }

  .requests-title {
    text-align: center;
    font-size: 2.25rem;
    margin-bottom: 2rem;
    font-weight: 700;
    color: #1e293b;
    position: relative;
    animation: fadeInUp 0.5s ease-out;
  }

  .no-requests {
    text-align: center;
    font-style: italic;
    color: #64748b;
    font-size: 1.1rem;
    padding: 3rem;
    background: rgba(100, 116, 139, 0.05);
    border-radius: 16px;
    border: 1px dashed rgba(100, 116, 139, 0.2);
    animation: fadeInBox 0.6s ease-out;
  }

  .request-section {
    margin-bottom: 3rem;
    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    padding-bottom: 2rem;
    position: relative;
    animation: fadeIn 0.5s ease-in-out;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    position: relative;
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
    animation: fadeInLeft 0.5s ease-out;
  }

  .request-card {
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInLeft 0.6s ease-out;
  }

  .request-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s ease;
  }

  .request-card:hover {
    transform: translateX(8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .request-card:hover::before {
    transform: scaleY(1);
  }

  /* Status-specific card styling */
  .request-card.status-pending {
    border-color: rgba(245, 158, 11, 0.3);
    background: linear-gradient(145deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(254, 243, 199, 0.3) 100%);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.15);
  }

  .request-card.status-pending::before {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }

  .request-card.status-accepted {
    border-color: rgba(16, 185, 129, 0.3);
    background: linear-gradient(145deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(209, 250, 229, 0.3) 100%);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
  }

  .request-card.status-accepted::before {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  .request-card.status-declined {
    border-color: rgba(239, 68, 68, 0.3);
    background: linear-gradient(145deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(254, 226, 226, 0.3) 100%);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
  }

  .request-card.status-declined::before {
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }

  .request-info p {
    margin: 0.5rem 0;
    font-size: 1rem;
    line-height: 1.6;
    color: #475569;
  }

  .request-info p strong {
    color: #1e293b;
    font-weight: 700;
  }

  .status-label {
    font-weight: 700;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    display: inline-block;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    backdrop-filter: blur(8px);
    border: 1px solid;
    transition: all 0.3s ease;
  }

  .status-label:hover {
    transform: scale(1.05);
  }

  .status-pending,
  .status-label.status-pending {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
    color: #92400e;
    border-color: rgba(245, 158, 11, 0.3);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
  }

  .status-accepted,
  .status-label.status-accepted {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
    color: #065f46;
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
  }

  .status-declined,
  .status-label.status-declined {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
    color: #991b1b;
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
  }

  .payment-section {
    margin-top: 1.5rem;
    border-top: 1px solid rgba(226, 232, 240, 0.6);
    padding: 1.5rem;
    font-size: 1rem;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%);
    border-radius: 16px;
  }

  .deadline-urgent {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 8px;
    border-radius: 4px;
    border-left: 4px solid #dc2626;
  }

  .payment-input-group {
    margin-top: 1rem;
    display: flex;
    flex-wrap: nowrap;
    gap: 1rem;
  }

  .payment-input-amount,
  .payment-input-password {
    width: 96%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid rgba(203, 213, 225, 0.8);
    border-radius: 24px;
    background: rgba(248, 250, 252, 0.9);
    backdrop-filter: blur(10px);
    font-family: inherit;
    color: #1e293b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex: 1 1 150px;
    box-shadow:
      inset 0 0 0 0 rgba(59, 130, 246, 0.05),
      0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .payment-input-amount,
  .payment-input-password {
    flex: 1 1 150px;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
  }

  .payment-input-amount:focus,
  .payment-input-password:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 0 0 4px rgba(59, 130, 246, 0.1),
      0 6px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .paid-clear {
    color: #065f46;
    font-weight: 700;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    animation: fadeInBox 0.6s ease-out;
  }

  .transactions-list {
    margin-top: 1.5rem;
  }

  .transactions-list h5 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 700;
    color: #1e293b;
  }

  .transactions-list ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .transactions-list li {
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #475569;
    line-height: 1.6;
    position: relative;
    animation: slideInTransaction 0.4s ease-in;
  }

  .transactions-list li::before {
    content: '→';
    position: absolute;
    left: -1.5rem;
    color: #3b82f6;
    font-weight: 700;
  }

  .payment-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }

  .payment-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
  }

  .payment-button:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* Primary button */
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }

  .btn-primary:hover:not(.btn-disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
  }

  .btn-primary:hover:not(.btn-disabled)::before {
    left: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    .vendor-requests-container {
      padding: 1rem;
    }
    
    .request-card {
      padding: 1.5rem;
    }

    .requests-title {
      font-size: 2rem;
    }

    .section-title {
      font-size: 1.25rem;
    }

    .payment-input-group {
      flex-direction: column;
    }

    .payment-input-amount,
    .payment-input-password,
    .payment-button {
      width: 100%;
    }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInBox {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fadeInLeft {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInTransaction {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Append this to your existing paymentRequestsStyles.ts file

export const additionalPaymentRequestsStyles = `
  .product-rating-section {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%);
    border-radius: 16px;
    border: 1px solid rgba(209, 213, 219, 0.6);
    backdrop-filter: blur(10px);
    animation: fadeInUp 0.6s ease-out;
  }

  .product-rating-section h5 {
    margin: 0 0 1.25rem 0;
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.5rem;
  }

  .product-rating-section h5::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 2rem;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
  }

  .existing-rating {
    color: #475569;
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .existing-rating p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  .existing-rating p strong {
    color: #1e293b;
    font-weight: 600;
  }

  .rating-form {
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .rating-form p {
    margin: 0 0 0.75rem 0;
    color: #374151;
    font-weight: 600;
    font-size: 1rem;
  }

  .star-rating {
    margin: 0.75rem 0;
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .star {
    font-size: 28px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .star:not(.readonly) {
    cursor: pointer;
  }

  .star:not(.readonly):hover {
    transform: scale(1.15);
    filter: brightness(1.1);
  }

  .star.filled {
    color: #fbbf24;
    text-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
  }

  .star:not(.filled) {
    color: #d1d5db;
  }

  .star.readonly {
    cursor: default;
  }

  .rating-review {
    width: 96%;
    margin-top: 1rem;
    padding: 0.75rem;
    border: 1px solid rgba(209, 213, 219, 0.8);
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.5;
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
    transition: all 0.3s ease;
    resize: vertical;
    min-height: 80px;
  }

  .rating-review:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  .rating-review::placeholder {
    color: #9ca3af;
  }

  .rating-submit-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    position: relative;
    overflow: hidden;
  }

  .rating-submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.4s ease;
  }

  .rating-submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  .rating-submit-button:hover:not(:disabled)::before {
    left: 100%;
  }

  .rating-submit-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  }

  .rating-submit-button:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .rating-submit-button:disabled::before {
    display: none;
  }

  .requests-loading {
    text-align: center;
    padding: 4rem 2rem;
    font-size: 1.125rem;
    color: #64748b;
    background: rgba(248, 250, 252, 0.8);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Mobile responsiveness for rating section */
  @media (max-width: 768px) {
    .product-rating-section {
      padding: 1rem;
    }
    
    .star {
      font-size: 24px;
    }
    
    .rating-review {
      min-height: 60px;
    }
    
    .rating-submit-button {
      width: 100%;
    }
  }
`;