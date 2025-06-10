import express, { Request, Response } from "express";
import ProductRequest from "../models/ProductRequest";
import PaymentRequest from "../models/PaymentRequest";
import { protect } from "../middleware/authMiddleware";
import { IUser } from "../models/User";

const router = express.Router();

interface AuthRequest extends Request {
  user?: IUser;
}

// GET payment request by productRequestId (returning amountDue AND paymentDeadline)
router.get("/paymentRequestByProductRequest/:productRequestId", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { productRequestId } = req.params;
    const paymentRequest = await PaymentRequest.findOne({ productRequestId });
    
    if (!paymentRequest) {
      res.status(404).json({ error: "Payment request not found." });
      return;
    }
    
    res.json({ 
      amountDue: paymentRequest.amountDue,
      paymentDeadline: paymentRequest.paymentDeadline 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST create a new payment request for a given productRequest
router.post("/:requestId", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { deadline } = req.body;

    if (!req.user || req.user.userType !== "vendor") {
      res.status(403).json({ error: "Only vendors can create payment requests." });
      return;
    }

    const productRequest = await ProductRequest.findById(requestId).populate("productId");

    if (!productRequest) {
      res.status(404).json({ error: "Product request not found." });
      return;
    }

    if (!productRequest.vendorId) {
      res.status(400).json({ error: "Invalid product request data: vendorId missing." });
      return;
    }

    if (productRequest.vendorId.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: "Not authorized for this request." });
      return;
    }

    const existingPaymentRequest = await PaymentRequest.findOne({ productRequestId: productRequest._id });

    if (existingPaymentRequest) {
      res.status(400).json({ error: "Payment request already exists for this product request." });
      return;
    }

    // Determine the payment deadline
    let paymentDeadline: Date;
    if (!productRequest.message || productRequest.message.trim() === "") {
      if (!productRequest.defaultDeadline) {
        res.status(400).json({ error: "Default deadline is not set on the product request." });
        return;
      }
      paymentDeadline = new Date(productRequest.defaultDeadline);
    } else {
      if (!deadline) {
        res.status(400).json({ error: "Deadline is required." });
        return;
      }
      paymentDeadline = new Date(deadline);
    }

    // Update productRequest status to accepted
    productRequest.status = "accepted";
    await productRequest.save();

    const product = productRequest.productId as any;

    const newPaymentRequest = await PaymentRequest.create({
      productId: product._id,
      productRequestId: productRequest._id,
      vendorId: productRequest.vendorId,
      companyId: productRequest.companyId,
      acceptedAt: new Date(),
      paymentDeadline: paymentDeadline,
      amountDue: productRequest.totalPrice,
      status: "unpaid",
    });

    res.status(201).json(newPaymentRequest);
  } catch (err) {
    console.error("Error creating payment request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
