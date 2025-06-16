// ⚠️ DEV-ONLY: This script resets user passwords. DO NOT RUN in production!

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User"; // adjust if needed

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/venpay");

  const email = process.env.RESET_EMAIL!;
  const newPlainPassword = process.env.RESET_PASSWORD!;

  const hashed = await bcrypt.hash(newPlainPassword, 12);

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashed },
    { new: true }
  );

  if (updatedUser) {
    console.log("Password reset successfully");
  } else {
    console.log("User not found");
  }

  process.exit();
};

run();