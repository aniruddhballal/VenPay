import mongoose, { Schema, Document } from "mongoose";

export interface IProductRequest extends Document {
  productId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  quantity: number; // ✅ new field
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  unitPrice: Number,
  totalPrice: Number,
  defaultDeadline?: Date; // ✅ new optional field
}

const ProductRequestSchema = new Schema<IProductRequest>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true, min: 1 }, // ✅ new field with validation
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  message: { type: String },
  unitPrice: { type: Number, required: true },   // ✅ Added to schema
  totalPrice: { type: Number, required: true },  // ✅ Added to schema
  defaultDeadline: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model<IProductRequest>("ProductRequest", ProductRequestSchema);