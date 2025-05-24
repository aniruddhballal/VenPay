import mongoose, { Document, Schema } from "mongoose";

export interface IPaymentTransaction extends Document {
  paymentRequestId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  amountPaid: number;
  amountDueBefore: number;
  amountDueAfter: number;
  paidAt: Date;
  paidBy: mongoose.Types.ObjectId; // <-- ADD THIS
}

const PaymentTransactionSchema: Schema<IPaymentTransaction> = new Schema({
  paymentRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentRequest",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // <-- IMPORTANT FOR .populate("paidBy")
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0.01,
  },
  amountDueBefore: {
    type: Number,
    required: true,
  },
  amountDueAfter: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPaymentTransaction>(
  "PaymentTransaction",
  PaymentTransactionSchema
);