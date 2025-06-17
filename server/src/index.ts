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

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/requests", productRequests);
app.use("/api/users", userRoutes);

// Mount paymentRequests routes on /api/paymentrequests
app.use("/api/paymentrequests", paymentRequestRoutes);

// Mount paymentTransactions routes on /api/paymenttransactions
app.use("/api/paymenttransactions", paymentTransactionRoutes);

app.use("/api/productratings", productRatingRoutes);

connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
