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

export default function CompanyRequests() {
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
        setAmountDueMap((prev) => ({ ...prev, [req._id]: paymentRes.data.amountDue }));
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
      await axios.post(
        `http://localhost:5000/api/paymenttransactions/${req._id}`,
        { amount, password },
        { withCredentials: true }
      );
      toast.success("Payment successful!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment failed.");
    }
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

                <div className="payment-input-group">
                  <input
                    className="payment-input-amount"
                    type="number"
                    placeholder="Amount to pay"
                    value={amounts[req._id] || ""}
                    onChange={(e) => setAmounts({ ...amounts, [req._id]: e.target.value })}
                    max={amountDueMap[req._id] ?? req.totalPrice}
                    min={1}
                    disabled={amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0}
                  />
                  <input
                    className="payment-input-password"
                    type="password"
                    placeholder="Password"
                    value={passwords[req._id] || ""}
                    onChange={(e) => setPasswords({ ...passwords, [req._id]: e.target.value })}
                    disabled={amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0}
                  />
                  <button
                    className="payment-button"
                    onClick={() => handlePayment(req)}
                    disabled={amountDueMap[req._id] !== undefined && amountDueMap[req._id] <= 0}
                  >
                    Make Payment
                  </button>
                </div>

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
          </div>
        );
      })}
    </section>
  );
}
