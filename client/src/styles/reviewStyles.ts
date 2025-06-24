export const reviewStyles = `
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