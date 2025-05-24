import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  vendorId: Types.ObjectId; // reference to User who is a vendor
  // add other fields as needed (e.g., category, availability)
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IProduct>("Product", productSchema);