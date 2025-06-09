import express, { Request, Response } from "express";
import Product from "../models/Product";
import { protect } from "../middleware/authMiddleware";
import { IUser } from "../models/User";
import upload from "../middleware/upload"; // import this at the top
import PaymentRequest from '../models/PaymentRequest';
import ProductRating from '../models/ProductRating';
import ProductRequest from '../models/ProductRequest';

const router = express.Router();

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File; // <-- Add this line
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

  // Cascaded deletion - delete all related records first
  const productId = req.params.id;
  
  // Delete all payment requests for this product
  await PaymentRequest.deleteMany({ productId });
  
  // Delete all product ratings for this product
  await ProductRating.deleteMany({ productId });
  
  // Delete all product requests for this product
  await ProductRequest.deleteMany({ productId });
  
  // Finally delete the product itself
  await product.deleteOne();
  
  res.json({ message: "Product and all related records deleted successfully" });
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("vendorId", "name email");

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload product image
router.post(
  "/upload-image/:id",
  protect,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    if (!req.file || !req.file.path) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }

    product.image = req.file.path;
    await product.save();

    res.status(200).json({ message: "Image uploaded", image: product.image });
  }
);

export default router;
