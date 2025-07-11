import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DatePickerModal from "../Modals/DatePickerModal";
import { useMemo } from 'react';
import api from "../../api/api";
import { tabStyles } from "../../styles/requestsTabStyles";
import  {reviewStyles} from "../../styles/reviewStyles"

interface Transaction {
  _id: string;
  amountPaid: number;
  paidBy: { name: string };
  createdAt: string;
  paidAt?: string;
}

interface Request {
  _id: string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  productId: {
    _id: string;
    name: string;
    image?: string;
  };
  companyId: { _id: string; email: string, name: string};
  createdAt?: string;
  paymentDeadline?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

interface ProductRating {
  _id: string;
  productId: string;
  companyId: string;
  productRequestId: string;
  date: string;
  rating: number;
  review?: string;
}

export default function ProductRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [amountDueMap, setAmountDueMap] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [deadlineMap, setDeadlineMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('pending');
  const [ratingsMap, setRatingsMap] = useState<Record<string, ProductRating>>({});

  useEffect(() => {
    api
      .get("/requests/vendor")
      .then((res) => setRequests(res.data))
      .catch((err) => {
        console.error("Error loading vendor requests:", err); // toast is already handled by api.ts interceptor
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const txMap: Record<string, Transaction[]> = {};
      const dueMap: Record<string, number> = {};
      const deadlineMap: Record<string, string> = {};
      const ratingsMap: Record<string, ProductRating> = {};

      for (const req of requests.filter((r) => r.status === "accepted")) {
        try {
          const [txRes, amountRes] = await Promise.all([
            api.get(`/paymenttransactions/transactions/byProductRequest/${req._id}`),
            api.get(`/paymentrequests/paymentRequestByProductRequest/${req._id}`)
          ]);

          txMap[req._id] = txRes.data;
          dueMap[req._id] = amountRes.data.amountDue;
          if (amountRes.data.paymentDeadline) {
            deadlineMap[req._id] = amountRes.data.paymentDeadline;
          }

          // Fetch rating if payment is cleared
          if (amountRes.data.amountDue <= 0) {
            try {
              const ratingRes = await api.get(`/productratings/productrequest/${req._id}`);
              
              if (ratingRes.data) {
                ratingsMap[req._id] = ratingRes.data;
              }
            } catch (ratingErr: any) {
              // No rating found, which is fine
              console.log(`No rating found for product request ${req._id}`);
            }
          }
          
        } catch (err) {
          console.error("Error loading payment info for request", req._id, err);
          toast.error(`Failed to load payment info for request ${req._id.slice(-4)}...`);
        }
      }

      setTransactions(txMap);
      setAmountDueMap(dueMap);
      setDeadlineMap(deadlineMap);
      setRatingsMap(ratingsMap);
    };

    fetchData();
  }, [requests]);

  const handleAccept = async (request: Request) => {
    if (!request.message || request.message.trim() === "") {
      // Direct accept for net30
      try {
        await api.put(`/requests/${request._id}`, { status: "accepted" });
        await api.post(`/paymentrequests/${request._id}`, {});

        setRequests((prev) =>
          prev.map((req) => (req._id === request._id ? { ...req, status: "accepted" } : req))
        );
        
        toast.success("Request accepted with Net30 terms");
      } catch (err) {
        console.error(err);
        toast.error("Failed to accept request or create payment request.");
      }
    } else {
      // Show date picker for custom deadline
      setCurrentRequest(request);
      setShowDatePicker(true);
    }
  };

  const handleDateConfirm = async (selectedDate: string) => {
    if (!currentRequest) return;

    const istDateStr = `${selectedDate}T23:59:59+05:30`;
    const paymentDeadline = new Date(istDateStr);

    try {
      await api.put(`/requests/${currentRequest._id}`, { status: "accepted" });

      await api.post(`/paymentrequests/${currentRequest._id}`, { deadline: paymentDeadline });

      setRequests((prev) =>
        prev.map((req) => (req._id === currentRequest._id ? { ...req, status: "accepted" } : req))
      );
      
      toast.success("Request accepted with custom deadline");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request or create payment request.");
    }

    setCurrentRequest(null);
  };

  const updateStatus = async (id: string, status: "declined") => {
    try {
      await api.put(`/requests/${id}`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch {
      toast.error("Failed to update request.");
    }
  };

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

  const renderStarRating = (rating: number) => {
    return (
      <div className="star-rating readonly">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} readonly`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  function RequestSection({ title, data }: { title: string; data: Request[] }) {
    if (data.length === 0) return null;

    return (
      <section className="request-section">
        <h4 className="section-title">{title}</h4>
        {data.map((req) => {
          const deadlineDate = deadlineMap[req._id]
            ? new Date(deadlineMap[req._id]).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : null;

          const timeLeft = deadlineMap[req._id] ? formatTimeLeft(deadlineMap[req._id]) : null;
          const isPaymentCleared = amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0;
          const productRating = ratingsMap[req._id];

          // Calculate cleared before deadline text
          const lastTx = transactions[req._id]?.[transactions[req._id].length - 1];
          const deadline = deadlineMap[req._id] ? new Date(deadlineMap[req._id]).getTime() : null;
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
          }, [req._id, transactions, deadlineMap]);

          if (!req.productId) {
            return (
              <div key={req._id} className={`request-card status-${req.status}`}>
                <p>This product has been deleted.</p>
              </div>
            );
          }

          return (
            <div key={req._id} className={`request-card status-${req.status}`}>
              <div className="request-info">
                {req.productId?.image && (
                  <img
                    src={req.productId.image}
                    alt={req.productId.name || "Product"}
                    className="productRequestImage"
                  />
                )}

                <p>
                  <strong>Product:</strong> {req.productId?.name || "Deleted product"}
                </p>

                <p>
                  <strong>From:</strong>{" "}
                  <Link to={`/user/${req.companyId._id}`}>
                    {req.companyId.name} ({req.companyId.email})
                  </Link>
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
                  {req.createdAt ? new Date(req.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {req.quantity ?? "N/A"}
                </p>
                <p>
                  <strong>Unit Price:</strong> ₹{req.unitPrice?.toFixed(2) ?? "N/A"}
                </p>
                <p>
                  <strong>Total Price:</strong> ₹{req.totalPrice?.toFixed(2) ?? "N/A"}
                </p>
              </div>

              {req.status === "accepted" && (
                <div className="payment-section">
                  {amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0 ? (
                    <p className="paid-clear">
                      {clearedBeforeDeadlineText || "✅ Payment cleared before deadline."}
                    </p>
                  ) : (
                    <>
                      <p>
                        <strong>Amount Due:</strong> ₹
                        {amountDueMap[req._id] !== undefined
                          ? amountDueMap[req._id].toFixed(2)
                          : "Loading..."}
                      </p>
                      <p className={
                        deadlineMap[req._id] && 
                        new Date(deadlineMap[req._id]).getTime() - Date.now() < 24 * 60 * 60 * 1000 &&
                        new Date(deadlineMap[req._id]).getTime() > Date.now()
                          ? "deadline-urgent" 
                          : ""
                      }>
                        <strong>Deadline:</strong> {deadlineDate} – <strong>Time left:</strong> {timeLeft}
                      </p>
                    </>
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
                      <h5>Customer Rating</h5>
                      {productRating ? (
                        <div className="existing-rating">
                            {renderStarRating(productRating.rating)}
                            <p><strong>Rating:</strong> {productRating.rating}/5</p>
                              {productRating.review && (
                              <div>
                                <p><strong>Customer Review:</strong></p>
                                <p>"{productRating.review}"</p>
                              </div>
                            )}
                            <p>
                              <strong>Rated on:</strong> {new Date(productRating.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                            </p>
                          </div>
                        ) : (
                          <div className="rating-form">
                            <p>No rating provided by the customer yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  )} 
              {req.status === "pending" && (
                <div className="vendor-actions">
                  <button onClick={() => handleAccept(req)} className="btn accept-btn">
                    {!req.message || req.message.trim() === ""
                      ? "Accept (net30)"
                      : "Accept & Set Deadline"}
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, "declined")}
                    className="btn decline-btn"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
    );
  }

  const grouped = {
    accepted: requests.filter((r) => r.status === "accepted"),
    declined: requests.filter((r) => r.status === "declined"),
    pending: requests.filter((r) => r.status === "pending"),
  };

  return (
  <>
    <style>{tabStyles}</style>
    <style>{reviewStyles}</style>
    <div className="vendor-requests-container">
      <h3 className="requests-title">Product Requests</h3>
     
      {requests.length === 0 ? (
        <p className="no-requests">No requests received yet.</p>
      ) : (
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button pending ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
              <span className="tab-badge">{grouped.pending.length}</span>
            </button>
            <button
              className={`tab-button accepted ${activeTab === 'accepted' ? 'active' : ''}`}
              onClick={() => setActiveTab('accepted')}
            >
              Accepted
              <span className="tab-badge">{grouped.accepted.length}</span>
            </button>
            <button
              className={`tab-button declined ${activeTab === 'declined' ? 'active' : ''}`}
              onClick={() => setActiveTab('declined')}
            >
              Declined
              <span className="tab-badge">{grouped.declined.length}</span>
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'pending' && (
              grouped.pending.length === 0 ? (
                <p className="no-requests">No pending requests yet.</p>
              ) : (
                <RequestSection title="Pending Requests" data={grouped.pending} />
              )
            )}
            {activeTab === 'accepted' && (
              grouped.accepted.length === 0 ? (
                <p className="no-requests">No accepted requests yet.</p>
              ) : (
                <RequestSection title="Accepted Requests" data={grouped.accepted} />
              )
            )}
            {activeTab === 'declined' && (
              grouped.declined.length === 0 ? (
                <p>No declined requests yet.</p>
              ) : (
                <RequestSection title="Declined Requests" data={grouped.declined} />
              )
            )}
          </div>
        </div>
      )}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => {
          setShowDatePicker(false);
          setCurrentRequest(null);
        }}
        onConfirm={handleDateConfirm}
        title="Set Payment Deadline"
      />
    </div>
  </>
);
}