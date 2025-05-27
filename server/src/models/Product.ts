import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  vendorId: Types.ObjectId; // reference to User who is a vendor
  // add other fields as needed (e.g., category, availability)
  image?: string; // <-- Add this line
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String }, // <-- Add this line
});

export default mongoose.model<IProduct>("Product", productSchema);

// add pictures, star rating, reviews, quantity available, discount, last purchased date  > all these for display, for the company to see
//  star rating, reviews, and last purchased dates - are set automatically, not customisable by the vendor-user
