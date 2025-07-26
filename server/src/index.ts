import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
//import { rateLimiter } from "./middleware/rateLimiter";
import productRoutes from "./routes/productRoutes";
import productRequests from "./routes/productRequests";
import paymentRequestRoutes from "./routes/paymentRequests";
import paymentTransactionRoutes from "./routes/paymentTransactions";
import userRoutes from "./routes/userRoutes";
import productRatingRoutes from "./routes/productRatingRoutes";
import razorpayRoutes from "./routes/razorpayRoutes"; // 👈 Add this import

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
//app.use(rateLimiter);

// Existing routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/requests", productRequests);
app.use("/api/users", userRoutes);
app.use("/api/paymentrequests", paymentRequestRoutes);
app.use("/api/paymenttransactions", paymentTransactionRoutes);
app.use("/api/productratings", productRatingRoutes);

// 👈 Add Razorpay routes
app.use("/api/razorpay", razorpayRoutes);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
    console.log("💳 Razorpay integration available at /api/razorpay");
    console.log(`🔧 Razorpay configured: ${process.env.RAZORPAY_KEY_ID ? '✅' : '❌'}`);
  });
});