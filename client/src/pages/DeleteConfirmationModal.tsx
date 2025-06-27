import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
  subtitle?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onCancel,
  isDeleting = false,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this product?",
  subtitle = "This action cannot be undone."
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            margin: '0 1rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            animation: 'scaleIn 0.3s ease-out',
            transform: 'scale(1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Gradient */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 99, 99, 0.1), rgba(255, 165, 0, 0.1), rgba(255, 192, 203, 0.1))',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
          
          {/* Shimmer Effect */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              transform: 'translateX(-100%)',
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />
          
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, padding: '2rem' }}>
            {/* Close Button */}
            <button
              onClick={handleCancel}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'rgba(255, 255, 255, 0.1)';
                target.style.color = '#fff';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'transparent';
                target.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              ✕
            </button>
            
            {/* Warning Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 99, 99, 0.3)',
                    borderRadius: '50%',
                    filter: 'blur(1rem)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <div 
                  style={{
                    position: 'relative',
                    padding: '1rem',
                    background: 'rgba(255, 99, 99, 0.2)',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 99, 99, 0.3)'
                  }}
                >
                  <svg 
                    style={{ width: '2rem', height: '2rem', color: '#ff6363' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h2 
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              {title}
            </h2>
            
            {/* Message */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                {message}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                {subtitle}
              </p>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '1rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isDeleting ? 0.5 : 1
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isDeleting) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.2)';
                    target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isDeleting) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.1)';
                    target.style.transform = 'scale(1)';
                  }
                }}
              >
                No
              </button>
              
              {/* Delete Button */}
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #ff6363, #ff8a80)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '1rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isDeleting ? 0.5 : 1,
                  boxShadow: '0 4px 15px rgba(255, 99, 99, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isDeleting) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #ff5252, #ff7961)';
                    target.style.transform = 'scale(1.05)';
                    target.style.boxShadow = '0 6px 20px rgba(255, 99, 99, 0.4)';
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isDeleting) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #ff6363, #ff8a80)';
                    target.style.transform = 'scale(1)';
                    target.style.boxShadow = '0 4px 15px rgba(255, 99, 99, 0.3)';
                  }
                }}
              >
                {/* Button Shimmer */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.7s ease'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    const target = e.target as HTMLDivElement;
                    target.style.transform = 'translateX(100%)';
                  }}
                />
                
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {isDeleting ? (
                    <>
                      <div 
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid #fff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Deleting...
                    </>
                  ) : (
                    'Yes'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style> */}
    </>
  );
};

export default DeleteConfirmationModal;