import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

  if (loading) return <div className="requests-loading">Loading requests...</div>;

  return (
    <div className="company-requests-container">
      <h3 className="requests-title">Your Product Requests</h3>

      {requests.length === 0 ? (
        <p className=".no-requests">No requests sent yet.</p>
      ) : (
        <>
          <RequestSection title="Accepted Requests" data={grouped.accepted} />
          <RequestSection title="Declined Requests" data={grouped.declined} />
          <RequestSection title="Pending Requests" data={grouped.pending} />
        </>
      )}
    </div>
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

      // Clear form inputs
      setAmounts((prev) => ({ ...prev, [req._id]: "" }));
      setPasswords((prev) => ({ ...prev, [req._id]: "" }));

      toast.success("Payment successful!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment failed.");
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

        return (
                    <div key={req._id} className={`request-card status-${req.status}`}>
            <div className="request-info">
              <p>
                <strong>Product:</strong> {req.productId.name}
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
                      <p>
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
                      <button
                        className="payment-button"
                        onClick={() => handlePayment(req)}
                      >
                        Make Payment
                      </button>
                    </div>
                  </>
                )}

                {/* Show payment cleared message when payment is complete */}
                {isPaymentCleared && (
                  <p className="paid-clear">✅ Payment has been cleared.</p>
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
