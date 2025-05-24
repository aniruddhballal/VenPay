import express, { Request, Response } from "express";
import ProductRequest from "../models/ProductRequest";
import Product from "../models/Product";
import { protect } from "../middleware/authMiddleware";
import { IUser } from "../models/User";
import PaymentRequest from "../models/PaymentRequest";

const router = express.Router();

// Extended request interface to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Company requests a product
router.post("/", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, message, quantity } = req.body;

    if (!req.user || req.user.userType !== "company") {
      res.status(403).json({ error: "Only companies can request products." });
      return;
    }

    // ✅ Validate quantity
    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: "Quantity must be a positive number." });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    const existingRequest = await ProductRequest.findOne({
      productId,
      companyId: req.user._id,
      status: { $in: ["pending"] },
    });

    if (existingRequest) {
      res.status(400).json({ error: "You have already requested this product." });
      return;
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;

    // Compute 11:59:59.999 PM today and add 30 days
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const defaultDeadline = new Date(endOfDay.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

    const request = await ProductRequest.create({
      productId,
      vendorId: product.vendorId,
      companyId: req.user._id,
      message,
      quantity,
      unitPrice,                  // ✅ Capture price at request time
      totalPrice,                 // ✅ Compute total
      defaultDeadline, // ✅ Add this
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Lightweight route used in ProductList.tsx to show which products have been requested
router.get("/company", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.userType !== "company") {
      res.status(403).json({ error: "Only companies can view their requests." });
      return;
    }

    const requests = await ProductRequest.find({
      companyId: req.user._id,
      status: { $in: ["pending"] },
    }).select("productId");

    const requestedProductIds = requests.map(r => r.productId.toString());
    res.json(requestedProductIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ NEW full detail route for the company dashboard
router.get("/company/full", protect, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await ProductRequest.find({ companyId: req.user?._id })
      .populate("productId")
      .populate("vendorId")
      .lean();

    // For accepted requests, attach payment deadline
    const withDeadlines = await Promise.all(
      requests.map(async (req: any) => {
        if (req.status === "accepted") {
          const payment = await PaymentRequest.findOne({ productRequestId: req._id }).lean();
          return { ...req, paymentDeadline: payment?.paymentDeadline };
        }
        return req;
      })
    );

    res.json(withDeadlines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Vendor views requests for their products
router.get("/vendor", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.userType !== "vendor") {
      res.status(403).json({ error: "Only vendors can view requests." });
      return;
    }

    const requests = await ProductRequest.find({ vendorId: req.user._id })
      .populate("productId")
      .populate("companyId", "email");

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vendor updates request status
router.put("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }

    const request = await ProductRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ error: "Request not found." });
      return;
    }

    if (!req.user || req.user._id.toString() !== request.vendorId.toString()) {
      res.status(403).json({ error: "Not authorized to update this request." });
      return;
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;