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
  message?: string;
  status: "pending" | "accepted" | "declined";
  productId: {
    _id: string;
    name: string;
    image?: string;
  };
  companyId: { _id: string; email: string };
  createdAt?: string;
  paymentDeadline?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export default function VendorRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [amountDueMap, setAmountDueMap] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});

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
    let paymentDeadline: Date | undefined;

    if (!request.message || request.message.trim() === "") {
      paymentDeadline = undefined;
    } else {
      const deadlineInput = prompt("Enter payment deadline (YYYY-MM-DD):");
      if (!deadlineInput) return toast.warn("Deadline is required.");

      const istDateStr = `${deadlineInput}T23:59:59+05:30`;
      paymentDeadline = new Date(istDateStr);
      const now = new Date();

      if (isNaN(paymentDeadline.getTime())) {
        return toast.warn("Invalid date format.");
      }

      if (paymentDeadline <= now) {
        return toast.warn("Deadline must be in the future.");
      }
    }

    try {
      await axios.put(
        `http://localhost:5000/api/requests/${request._id}`,
        { status: "accepted" },
        { withCredentials: true }
      );

      await axios.post(
        `http://localhost:5000/api/paymentrequests/${request._id}`,
        paymentDeadline ? { deadline: paymentDeadline } : {},
        { withCredentials: true }
      );

      setRequests((prev) =>
        prev.map((req) => (req._id === request._id ? { ...req, status: "accepted" } : req))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request or create payment request.");
    }
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

          return (
            <div key={req._id} className={`request-card status-${req.status}`}>
              <div className="request-info">
                {req.productId.image && (
                  <img
                    src={req.productId.image}
                    alt={req.productId.name}
                    className="productRequestImage"
                  />
                )}

                <p>
                  <strong>Product:</strong> {req.productId.name}
                </p>
                <p>
                  <strong>From:</strong> {req.companyId.email}
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
                  <button onClick={() => handleAccept(req)} className="accept-btn">
                    {!req.message || req.message.trim() === ""
                      ? "Accept (net30)"
                      : "Accept & Set Deadline"}
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, "declined")}
                    className="decline-btn"
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
    </div>
  );
}
