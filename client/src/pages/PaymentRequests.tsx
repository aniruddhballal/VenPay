import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';

import {Button} from '@mui/material';

interface Transaction {
  _id: string;
  amountPaid: number;
  paidBy: { name: string };
  createdAt: string;
  paidAt?: string;
}

interface Request {
  _id: string;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: string;
  productId: { _id: string; name: string };
  vendorId: { name: string; email: string };
  paymentDeadline?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ProductRating {
  _id: string;
  productId: string;
  companyId: string;
  productRequestId: string; // Added this field
  date: string;
  rating: number;
  review?: string;
}

// Define the props interface
interface StyledButtonProps {
  variant?: 'original' | 'primary' | 'danger';
  [key: string]: any;
}

// Single unified styled button
const StyledButton = styled(({ variant = 'original', ...props }: StyledButtonProps) => (
  <Button {...props} />
))(({ theme, variant }) => ({
  // Base styles common to both buttons
  fontWeight: 600,
  width: '40px',
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  
  // Shared ::before pseudo-element
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    transition: variant === 'original' ? 'left 0.6s ease' : 'left 0.4s ease',
    background: variant === 'original' 
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    ...(variant === 'original' && {
      '@media (prefers-reduced-motion: reduce)': {
        display: 'none',
      },
    }),
  },
  
  '&:hover::before': {
    left: '100%',
  },

  // Variant-specific styles
  ...(variant === 'original' && {
    padding: '0rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    '&:disabled': {
      background: '#9ca3af !important',
      color: '#ffffff !important',
      boxShadow: 'none !important',
      transform: 'none !important',
    },
    [theme.breakpoints.down('md')]: {
      padding: '1rem 2rem',
      fontSize: '1rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
      '&:active': { transform: 'none' },
    },
  }),

  ...(variant !== 'original' && {
    padding: '0.375rem 0.875rem',
    fontSize: '0.75rem',
    borderRadius: '6px',
    letterSpacing: '0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    transition: 'all 0.2s ease',
    flex: 1,
    justifyContent: 'center',
  }),

  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    },
  }),

  ...(variant === 'danger' && {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      boxShadow: '0 4px 8px rgba(239, 68, 68, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    },
  }),
}));

export default function PaymentRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/requests/company/full", { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch((err: any) => {
        console.error(err);
        const message = err.response?.data?.error || "Failed to load product requests.";
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = {
    accepted: requests.filter((r) => r.status === "accepted"),
    declined: requests.filter((r) => r.status === "declined"),
    pending: requests.filter((r) => r.status === "pending"),
  };

const styles = `
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

  if (loading) return <div className="requests-loading">Loading requests...</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="vendor-requests-container">
        <h3 className="requests-title">Payment Requests</h3>

        {requests.length === 0 ? (
          <p className="no-requests">No requests received yet.</p>
        ) : (
          <>
            <RequestSection title="Accepted Requests" data={grouped.accepted} />
            <RequestSection title="Declined Requests" data={grouped.declined} />
            <RequestSection title="Pending Requests" data={grouped.pending} />
          </>
        )}
      </div>
    </>
    
  );
}

function formatTimeLeft(deadline: string) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) return "Deadline passed";

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
}

function RequestSection({ title, data }: { title: string; data: Request[] }) {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [amountDueMap, setAmountDueMap] = useState<Record<string, number>>({});
  const [existingRatings, setExistingRatings] = useState<Record<string, ProductRating>>({});
  const [ratingData, setRatingData] = useState<Record<string, { rating: number; review: string }>>({});
  const [ratingLoading, setRatingLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    data.forEach(async (req) => {
      if (req.status !== "accepted") return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/paymenttransactions/transactions/byProductRequest/${req._id}`,
          { withCredentials: true }
        );
        setTransactions((prev) => ({ ...prev, [req._id]: res.data }));

        const paymentRes = await axios.get(
          `http://localhost:5000/api/paymentrequests/paymentRequestByProductRequest/${req._id}`,
          { withCredentials: true }
        );
        const amountDue = paymentRes.data.amountDue;
        setAmountDueMap((prev) => ({ ...prev, [req._id]: amountDue }));

        // If payment is cleared, check for existing rating for this specific request
        if (amountDue <= 0) {
          try {
            // Changed endpoint to get rating by product request ID instead of product ID
            const ratingRes = await axios.get(
              `http://localhost:5000/api/productratings/productrequest/${req._id}`,
              { withCredentials: true }
            );
            if (ratingRes.data) {
              setExistingRatings((prev) => ({ ...prev, [req._id]: ratingRes.data }));
            }
          } catch (ratingErr: any) {
            // No existing rating found, which is fine
            console.log(`No existing rating found for product request ${req._id}`);
          }
        }
      } catch (err: any) {
        console.error(`Failed to load transactions or amount due for request ${req._id}`, err);
        const message = err.response?.data?.error || `Failed to load data for request ${req._id}`;
        toast.error(message);
      }
    });
  }, [data]);

  const handlePayment = async (req: Request) => {
    const amount = parseFloat(amounts[req._id] || "0");
    const password = passwords[req._id];

    if (!password) {
      toast.warn("Please enter your password to confirm the payment.");
      return;
    }

    if (isNaN(amount) || amount <= 0 || amount > (amountDueMap[req._id] ?? req.totalPrice)) {
      toast.warn("Enter a valid amount up to the amount due.");
      return;
    }

    try {
      const paymentResponse = await axios.post(
        `http://localhost:5000/api/paymenttransactions/${req._id}`,
        { amount, password },
        { withCredentials: true }
      );

      // Update amount due
      const newAmountDue = (amountDueMap[req._id] ?? req.totalPrice) - amount;
      setAmountDueMap((prev) => ({ ...prev, [req._id]: newAmountDue }));

      // Add new transaction to the list
      const newTransaction = {
        _id: paymentResponse.data._id || Date.now().toString(),
        amountPaid: amount,
        paidBy: { name: paymentResponse.data.paidBy?.name || "You" },
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      };

      setTransactions((prev) => ({
        ...prev,
        [req._id]: [newTransaction, ...(prev[req._id] || [])],
      }));

      toast.success("Payment successful!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment failed.");
    } finally {
      // Clear form inputs
      setAmounts((prev) => ({ ...prev, [req._id]: "" }));
      setPasswords((prev) => ({ ...prev, [req._id]: "" }));
    }
  };

  const handleRatingSubmit = async (req: Request) => {
    const rating = ratingData[req._id]?.rating;
    const review = ratingData[req._id]?.review || "";

    if (!rating || rating < 1 || rating > 5) {
      toast.warn("Please select a rating between 1 and 5 stars.");
      return;
    }

    setRatingLoading((prev) => ({ ...prev, [req._id]: true }));

    try {
      const response = await axios.post(
        `http://localhost:5000/api/productratings`,
        {
          productId: req.productId._id,
          productRequestId: req._id, // Added this field
          rating,
          review: review.trim() || undefined,
        },
        { withCredentials: true }
      );

      setExistingRatings((prev) => ({ ...prev, [req._id]: response.data }));
      setRatingData((prev) => ({ ...prev, [req._id]: { rating: 0, review: "" } }));
      toast.success("Thank you for your rating!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to submit rating.");
    } finally {
      setRatingLoading((prev) => ({ ...prev, [req._id]: false }));
    }
  };

  const renderStarRating = (reqId: string, currentRating: number, isReadOnly: boolean = false) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? "filled" : ""} ${isReadOnly ? "readonly" : ""}`}
            onClick={() => {
              if (!isReadOnly) {
                setRatingData((prev) => ({
                  ...prev,
                  [reqId]: { ...prev[reqId], rating: star },
                }));
              }
            }}
            style={{ 
              cursor: isReadOnly ? "default" : "pointer",
              color: star <= currentRating ? "#ffd700" : "#ddd",
              fontSize: "24px"
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (data.length === 0) return null;

  return (
    <section className="request-section">
      <h4 className="section-title">{title}</h4>
      {data.map((req) => {
        const deadlineDate = req.paymentDeadline
          ? new Date(req.paymentDeadline).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          : null;

        const timeLeft = req.paymentDeadline ? formatTimeLeft(req.paymentDeadline) : null;
        const isPaymentCleared = amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0;
        const hasExistingRating = existingRatings[req._id];

        // Calculate cleared before deadline text
        const lastTx = transactions[req._id]?.[transactions[req._id].length - 1];
        const deadline = req.paymentDeadline ? new Date(req.paymentDeadline).getTime() : null;
        const clearedAt = lastTx ? new Date(lastTx?.paidAt || lastTx?.createdAt).getTime() : null;
        const diff = deadline && clearedAt ? deadline - clearedAt : null;
        
        const clearedBeforeDeadlineText = useMemo(() => {
          if (!lastTx || !deadline || !clearedAt || isNaN(deadline) || isNaN(clearedAt) || diff === null) return null;
          
          const formatTimeDifference = (timeDiff: number) => {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            const parts = [];
            if (days > 0) parts.push(`${days} days`);
            if (hours > 0) parts.push(`${hours} hrs`);
            if (minutes > 0) parts.push(`${minutes} mins`);
            if (seconds > 0) parts.push(`${seconds} seconds`);
            
            return parts.join(' ');
          };
          
          if (diff > 0) {
            const timeString = formatTimeDifference(diff);
            return `✅ Payment cleared ${timeString} before deadline.`;
          } else {
            const absDiff = Math.abs(diff);
            const timeString = formatTimeDifference(absDiff);
            return `⚠️ Payment cleared ${timeString} after deadline.`;
          }
        }, [req._id, transactions, req.paymentDeadline]);

        return (
          <div key={req._id} className={`request-card status-${req.status}`}>
            <div className="request-info">
              <p>
                <strong>Product:</strong> {req.productId?.name || "Deleted product"} 
              </p>                      
              <p>
                <strong>Vendor:</strong> {req.vendorId.name} ({req.vendorId.email})
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-label status-${req.status}`}>{req.status}</span>
              </p>
              <p>
                <strong>Requested Payback Duration:</strong> {req.message || "Net30 (default)"}
              </p>
              <p>
                <strong>Requested on:</strong>{" "}
                {new Date(req.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </p>
              <p>
                <strong>Quantity:</strong> {req.quantity}
              </p>
              <p>
                <strong>Unit Price:</strong> ₹{req.unitPrice.toFixed(2)}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{req.totalPrice.toFixed(2)}
              </p>
            </div>

            {req.status === "accepted" && (
              <div className="payment-section">
                {/* Only show payment details if payment is NOT cleared */}
                {!isPaymentCleared && (
                  <>
                    <p>
                      <strong>Amount Due:</strong> ₹
                      {amountDueMap[req._id] !== undefined
                        ? amountDueMap[req._id].toFixed(2)
                        : "Loading..."}
                    </p>

                    {req.paymentDeadline && (
                      <p className={
                        req.paymentDeadline && 
                        new Date(req.paymentDeadline).getTime() - Date.now() < 24 * 60 * 60 * 1000 &&
                        new Date(req.paymentDeadline).getTime() > Date.now()
                          ? "deadline-urgent" 
                          : ""
                      }>
                        <strong>Deadline:</strong> {deadlineDate} – <strong>Time left:</strong> {timeLeft}
                      </p>
                    )}

                    <div className="payment-input-group">
                      <input
                        className="payment-input-amount"
                        type="number"
                        placeholder="Amount to pay"
                        value={amounts[req._id] || ""}
                        onChange={(e) => setAmounts({ ...amounts, [req._id]: e.target.value })}
                        max={amountDueMap[req._id] ?? req.totalPrice}
                        min={1}
                      />
                      <input
                        className="payment-input-password"
                        type="password"
                        placeholder="Password"
                        value={passwords[req._id] || ""}
                        onChange={(e) => setPasswords({ ...passwords, [req._id]: e.target.value })}
                      />
                      <StyledButton
                        variant="primary"
                        onClick={() => handlePayment(req)}
                      >
                        Make Payment
                      </StyledButton>
                    </div>
                  </>
                )}

                {/* Show payment cleared message when payment is complete */}
                {isPaymentCleared && (
                  <p className="paid-clear">
                    {clearedBeforeDeadlineText || "✅ Payment cleared before deadline."}
                  </p>
                )}

                <div className="transactions-list">
                  <h5>Payment Transactions</h5>
                  {transactions[req._id]?.length ? (
                    <ul>
                      {transactions[req._id].map((tx) => (
                        <li key={tx._id}>
                          Paid ₹{tx.amountPaid.toFixed(2)} by {tx.paidBy?.name || "Unknown user"} on{" "}
                          {new Date(tx.paidAt || tx.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No payments made yet.</p>
                  )}
                </div>

                {/* Product Rating Section - Only show when payment is cleared */}
                {isPaymentCleared && (
                  <div className="product-rating-section">
                    <h5>Product Rating</h5>
                    {hasExistingRating ? (
                      <div className="existing-rating">
                        <p><strong>Your Rating:</strong></p>
                        {renderStarRating(req._id, hasExistingRating.rating, true)}
                        <p><strong>Rating:</strong> {hasExistingRating.rating}/5</p>
                        {hasExistingRating.review && (
                          <p><strong>Your Review:</strong> "{hasExistingRating.review}"</p>
                        )}
                        <p><strong>Rated on:</strong> {new Date(hasExistingRating.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                      </div>
                    ) : (
                      <div className="rating-form">
                        <p>How would you rate this product?</p>
                        {renderStarRating(req._id, ratingData[req._id]?.rating || 0)}
                        <textarea
                          className="rating-review"
                          placeholder="Write a review (optional)..."
                          value={ratingData[req._id]?.review || ""}
                          onChange={(e) =>
                            setRatingData((prev) => ({
                              ...prev,
                              [req._id]: { ...prev[req._id], review: e.target.value },
                            }))
                          }
                          rows={3}
                          style={{ width: "100%", marginTop: "10px", padding: "8px" }}
                        />
                        <button
                          className="rating-submit-button"
                          onClick={() => handleRatingSubmit(req)}
                          disabled={!ratingData[req._id]?.rating || ratingLoading[req._id]}
                          style={{ 
                            marginTop: "10px",
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: ratingLoading[req._id] ? "not-allowed" : "pointer"
                          }}
                        >
                          {ratingLoading[req._id] ? "Submitting..." : "Submit Rating"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}