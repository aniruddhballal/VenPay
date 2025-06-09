import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, X, Check } from 'lucide-react';
import styles from '../styles/DatePickerModal.module.css';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  title: string;
}

function DatePickerModal({ isOpen, onClose, onConfirm, title }: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Set minimum date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = tomorrow.toISOString().split('T')[0];
      setSelectedDate(minDate);
      setError("");
      
      // Prevent body scroll when modal is open
      document.body.classList.add(styles['modal-open']);
      document.documentElement.classList.add(styles['modal-open']);
    } else {
      // Restore body scroll when modal is closed
      document.body.classList.remove(styles['modal-open']);
      document.documentElement.classList.remove(styles['modal-open']);
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.classList.remove(styles['modal-open']);
      document.documentElement.classList.remove(styles['modal-open']);
    };
  }, [isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
   
    const selectedDateObj = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
   
    if (selectedDateObj <= now) {
      setError("Please select a future date");
    } else {
      setError("");
    }
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
   
    const selectedDateObj = new Date(selectedDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
   
    if (selectedDateObj <= now) {
      setError("Please select a future date");
      return;
    }
   
    onConfirm(selectedDate);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal when clicking the overlay (but not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const modalContent = (
    <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <div className={styles['modal-title-container']}>
            <Calendar className={styles['modal-icon']} />
            <h3 className={styles['modal-title']}>{title}</h3>
          </div>
          <button onClick={onClose} className={styles['modal-close-btn']}>
            <X size={20} />
          </button>
        </div>
       
        <div className={styles['modal-content']}>
          <div className={styles['date-input-container']}>
            <label htmlFor="payment-deadline" className={styles['date-label']}>
              Payment Deadline
            </label>
            <input
              id="payment-deadline"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className={`${styles['date-input']} ${error ? styles.error : ''}`}
            />
            {error && <span className={styles['error-message']}>{error}</span>}
          </div>
         
          {selectedDate && !error && (
            <div className={styles['date-preview']}>
              <p className={styles['preview-label']}>Selected deadline:</p>
              <p className={styles['preview-date']}>
                {new Date(selectedDate + 'T23:59:59').toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
       
        <div className={styles['modal-actions']}>
          <button onClick={onClose} className={styles['cancel-btn']}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={styles['btn-confirm']}
            disabled={!selectedDate || !!error}
          >
            <Check size={16} />
            Set Deadline
          </button>
        </div>
      </div>
    </div>
  );

  // Render the modal at the document body level using a portal
  return createPortal(modalContent, document.body);
}

export default DatePickerModal;
