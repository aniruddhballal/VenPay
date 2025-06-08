import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Calendar, X, Check } from "lucide-react";

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
    }
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

  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-container">
            <Calendar className="modal-icon" />
            <h3 className="modal-title">{title}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="date-input-container">
            <label htmlFor="payment-deadline" className="date-label">
              Payment Deadline
            </label>
            <input
              id="payment-deadline"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className={`date-input ${error ? 'error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          {selectedDate && !error && (
            <div className="date-preview">
              <p className="preview-label">Selected deadline:</p>
              <p className="preview-date">
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
        
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="btn btn-confirm"
            disabled={!selectedDate || !!error}
          >
            <Check size={16} />
            Set Deadline
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [amountDueMap, setAmountDueMap] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/requests/vendor", { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch((err) => {
        console.error("Error loading vendor requests:", err);
        toast.error("Failed to load requests.");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const txMap: Record<string, Transaction[]> = {};
      const dueMap: Record<string, number> = {};

      for (const req of requests.filter((r) => r.status === "accepted")) {
        try {
          const [txRes, amountRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/paymenttransactions/transactions/byProductRequest/${req._id}`, {
              withCredentials: true,
            }),
            axios.get(`http://localhost:5000/api/paymentrequests/paymentRequestByProductRequest/${req._id}`, {
              withCredentials: true,
            }),
          ]);

          txMap[req._id] = txRes.data;
          dueMap[req._id] = amountRes.data.amountDue;
        } catch (err) {
          console.error("Error loading payment info for request", req._id, err);
          toast.error(`Failed to load payment info for request ${req._id.slice(-4)}...`);
        }
      }

      setTransactions(txMap);
      setAmountDueMap(dueMap);
    };

    fetchData();
  }, [requests]);

  const handleAccept = async (request: Request) => {
    if (!request.message || request.message.trim() === "") {
      // Direct accept for net30
      try {
        await axios.put(
          `http://localhost:5000/api/requests/${request._id}`,
          { status: "accepted" },
          { withCredentials: true }
        );

        await axios.post(
          `http://localhost:5000/api/paymentrequests/${request._id}`,
          {},
          { withCredentials: true }
        );

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
      await axios.put(
        `http://localhost:5000/api/requests/${currentRequest._id}`,
        { status: "accepted" },
        { withCredentials: true }
      );

      await axios.post(
        `http://localhost:5000/api/paymentrequests/${currentRequest._id}`,
        { deadline: paymentDeadline },
        { withCredentials: true }
      );

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
      await axios.put(`http://localhost:5000/api/requests/${id}`, { status }, { withCredentials: true });
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

  function RequestSection({ title, data }: { title: string; data: Request[] }) {
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
                  <strong>Product:</strong> {req.productId.name}
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
                  <p>
                    <strong>Amount Due:</strong> ₹
                    {amountDueMap[req._id] !== undefined
                      ? amountDueMap[req._id].toFixed(2)
                      : "Loading..."}
                  </p>

                  {amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0 && (
                    <p className="paid-clear">Payment has been cleared.</p>
                  )}

                  {req.paymentDeadline && (
                    <p>
                      <strong>Deadline:</strong> {deadlineDate} – <strong>Time left:</strong> {timeLeft}
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
    <div className="vendor-requests-container">
      <h3 className="requests-title">Product Requests</h3>
      
      {requests.length === 0 ? (
        <p className="no-requests">No requests received yet.</p>
      ) : (
        <>
          <RequestSection title="Accepted Requests" data={grouped.accepted} />
          <RequestSection title="Declined Requests" data={grouped.declined} />
          <RequestSection title="Pending Requests" data={grouped.pending} />
        </>
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
  );
}
