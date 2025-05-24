import mongoose, { Document, Schema } from "mongoose";

export interface IPaymentRequest extends Document {
  productId: mongoose.Types.ObjectId;
  productRequestId: mongoose.Types.ObjectId; // ✅ new field
  vendorId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  acceptedAt: Date;
  paymentDeadline: Date;
  status: "unpaid" | "partially_paid" | "paid"; // ✅ new field
  amountDue: number; // ✅ new field
}

const PaymentRequestSchema: Schema<IPaymentRequest> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productRequestId: { // ✅ new field added here
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductRequest",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptedAt: {
    type: Date,
    default: Date.now, // automatically set to current time
  },
  paymentDeadline: {
    type: Date,
    required: true, // must be explicitly set by vendor
  },
  status: {
    type: String,
    enum: ["unpaid", "partially_paid", "paid"],
    default: "unpaid", // ✅ default state
  },
  amountDue: {
    type: Number,
    required: true, // must be populated during creation
    min: 0,
  },
});

export default mongoose.model<IPaymentRequest>("PaymentRequest", PaymentRequestSchema);