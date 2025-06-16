import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User"; // adjust if needed

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/venpay");

  const email = "vendor@gmail.com"; // 🔁 Replace with the user’s email
  const newPlainPassword = "password456"; // 🔁 Replace with the new password

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