// ⚠️ DEV-ONLY: This script resets user passwords. DO NOT RUN in production!

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User"; // adjust if needed

import dotenv from 'dotenv';
dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

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