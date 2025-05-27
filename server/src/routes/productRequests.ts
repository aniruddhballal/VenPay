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

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: "Quantity must be a positive number." });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.warn(`[WARN] Product not found: ${productId}`);
      res.status(404).json({ error: "Product not found." });
      return;
    }

    console.log(`[DEBUG] Product found: ${product.name}, image: ${product.image}`);

    const existingRequest = await ProductRequest.findOne({
      productId,
      companyId: req.user._id,
      status: { $in: ["pending"] },
    });

    if (existingRequest) {
      console.log(`[INFO] Duplicate request blocked for productId: ${productId}`);
      res.status(400).json({ error: "You have already requested this product." });
      return;
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;

    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const defaultDeadline = new Date(endOfDay.getTime() + 30 * 24 * 60 * 60 * 1000);

    const request = await ProductRequest.create({
      productId,
      vendorId: product.vendorId,
      companyId: req.user._id,
      message,
      quantity,
      unitPrice,
      totalPrice,
      defaultDeadline,
    });

    console.log(`[SUCCESS] ProductRequest created for: ${product.name}, image: ${product.image}`);

    res.status(201).json(request);
  } catch (err) {
    console.error("[ERROR] Failed to create product request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Lightweight route for checking which products a company requested
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
    console.error("[ERROR] /company route failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Full product requests with product and vendor info for company dashboard
router.get("/company/full", protect, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await ProductRequest.find({ companyId: req.user?._id })
      .populate("productId")
      .populate("vendorId")
      .lean();

    requests.forEach((req: any, i: number) => {
      const img = req.productId?.image;
      if (img) {
        console.log(`[OK] (Company View) Request #${i} has image: ${img}`);
      } else {
        console.warn(`[WARN] (Company View) Request #${i} missing image:`, req.productId);
      }
    });

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
    console.error("[ERROR] /company/full route failed:", err);
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
      .populate("productId", "name price image image")
      .populate("companyId", "email");

    requests.forEach((req, i) => {
      const product = req.productId as any;
      const img = product?.image;

      if (img) {
        console.log(`[OK] (Vendor View) Request #${i} has image: ${img}`);
      } else {
        console.warn(`[WARN] (Vendor View) Request #${i} missing image. Product:`, product);
      }
    });

    res.json(requests);
  } catch (err) {
    console.error("[ERROR] /vendor route failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vendor updates request status (accept/decline)
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

    console.log(`[INFO] Request status updated: ${request._id} -> ${status}`);

    res.json(request);
  } catch (err) {
    console.error("[ERROR] PUT /:id failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
