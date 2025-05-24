import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: Types.ObjectId;        // 👈 Add this line
    email: string;
    name: string;
    password: string;
    userType: "company" | "vendor";
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  name: {type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["company", "vendor"],
    required: true,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model<IUser>("User", userSchema);