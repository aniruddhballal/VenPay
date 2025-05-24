import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import PaymentRequest from "../models/PaymentRequest";
import PaymentTransaction from "../models/PaymentTransaction";
import User, { IUser } from "../models/User";
import { protect } from "../middleware/authMiddleware";
import mongoose from "mongoose";

const router = express.Router();

interface AuthRequest extends Request {
  user?: IUser;
}

router.post("/:productRequestId", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productRequestId } = req.params;
    const { amount, password } = req.body;

    if (!req.user || req.user.userType !== "company") {
      res.status(403).json({ error: "Only company users can make payments." });
      return;
    }

    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Invalid amount." });
      return;
    }

    if (!password) {
      res.status(400).json({ error: "Password is required for confirmation." });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Incorrect password." });
      return;
    }

    const paymentRequest = await PaymentRequest.findOne({ productRequestId });
    if (!paymentRequest) {
      res.status(404).json({ error: "Payment request not found." });
      return;
    }

    if (paymentRequest.companyId.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: "Unauthorized to pay this request." });
      return;
    }

    if (amount > paymentRequest.amountDue) {
      res.status(400).json({ error: "Payment amount exceeds amount due." });
      return;
    }

    const previousAmountDue = paymentRequest.amountDue;
    const newAmountDue = previousAmountDue - amount;

    const transaction = await PaymentTransaction.create({
      productRequestId,
      paymentRequestId: paymentRequest._id,
      amountPaid: amount, // renamed to amountPaid
      paidBy: req.user._id,
      vendorId: paymentRequest.vendorId,
      companyId: paymentRequest.companyId,
      amountDueBefore: previousAmountDue,
      amountDueAfter: newAmountDue,
    });

    paymentRequest.amountDue = newAmountDue;
    paymentRequest.status = newAmountDue === 0 ? "paid" : "partially_paid";
    await paymentRequest.save();

    res.status(201).json({
      message: "Payment successful.",
      transaction,
      updatedPaymentRequest: paymentRequest,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET all transactions for a paymentRequestId
router.get("/:paymentRequestId/transactions", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentRequestId } = req.params;

    // Optional: Add authorization logic if necessary

    const transactions = await PaymentTransaction.find({ paymentRequestId }).populate("paidBy", "name email");

    if (!transactions || transactions.length === 0) {
      res.status(404).json({ error: "No transactions found for this payment request." });
      return;
    }

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/transactions/byProductRequest/:productRequestId", protect, async (req, res) => {
  try {
    const { productRequestId } = req.params;

    //console.log("=== API Call: Get Transactions by ProductRequestId ===");
    //console.log("Incoming productRequestId param:", productRequestId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productRequestId)) {
      console.error("Invalid ObjectId format:", productRequestId);
      res.status(400).json({ error: "Invalid productRequestId format." });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(productRequestId);

    //console.log("Converted to ObjectId:", objectId);

    // Fetch matching PaymentRequests
    const paymentRequests = await PaymentRequest.find({ productRequestId: objectId });
    //console.log("Matching PaymentRequests found:", paymentRequests.length);

    if (paymentRequests.length === 0) {
      console.warn("No PaymentRequests found for this productRequestId.");
      res.status(404).json({ error: "No payment requests found for this product request." });
      return;
    }

    const paymentRequestIds = paymentRequests.map((pr) => pr._id);
    //console.log("Extracted PaymentRequest IDs:", paymentRequestIds);

    // Fetch all PaymentTransactions matching those paymentRequestIds
    const transactions = await PaymentTransaction.find({
      paymentRequestId: { $in: paymentRequestIds },
    }).populate("paidBy", "name email");

    //console.log("Transactions found:", transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error("🔥 Error fetching transactions by productRequestId:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;