import express, { Request, Response } from "express";
import Product from "../models/Product";
import { protect } from "../middleware/authMiddleware";
import { IUser } from "../models/User";

const router = express.Router();

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Create product - only for vendors
router.post("/", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.userType !== "vendor") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const { name, description, price } = req.body;
  const product = new Product({ name, description, price, vendorId: req.user._id });

  await product.save();
  res.status(201).json(product);
});

// Get vendor's own products
router.get("/my", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.userType !== "vendor") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const products = await Product.find({ vendorId: req.user._id });
  res.json(products);
});

// Get all products - for companies
router.get("/", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.userType !== "company") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const products = await Product.find().populate("vendorId", "email name type");
  res.json(products);
});

// Update product - vendor only on own products
router.put("/:id", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.userType !== "vendor") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  if (product.vendorId.toString() !== req.user._id.toString()) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// Delete product - vendor only on own products
router.delete("/:id", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.userType !== "vendor") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  if (product.vendorId.toString() !== req.user._id.toString()) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

export default router;