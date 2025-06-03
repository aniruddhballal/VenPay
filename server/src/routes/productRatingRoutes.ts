import express from "express";
import ProductRating from "../models/ProductRating"; // Adjust path as needed
import { protect } from "../middleware/authMiddleware"; // Adjust path as needed
import mongoose from "mongoose";

const router = express.Router();

// GET /api/productratings/company/:productId - Get existing rating by current company for a product (legacy endpoint)
router.get("/company/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const companyId = (req as any).user._id; // Get user ID from the full user object

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    // Check if user is a company
    if ((req as any).user.userType !== "company") {
      res.status(403).json({ error: "Only companies can access ratings" });
      return;
    }

    const existingRating = await ProductRating.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!existingRating) {
      res.status(404).json({ error: "No rating found" });
      return;
    }

    res.json(existingRating);
  } catch (error) {
    console.error("Error fetching company rating:", error);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

// GET /api/productratings/productrequest/:productRequestId - Get existing rating by current company for a specific product request
router.get("/productrequest/:productRequestId", protect, async (req, res) => {
  try {
    const { productRequestId } = req.params;
    const companyId = (req as any).user._id;

    // Validate productRequestId
    if (!mongoose.Types.ObjectId.isValid(productRequestId)) {
      res.status(400).json({ error: "Invalid product request ID" });
      return;
    }

    // Check if user is a company
    if ((req as any).user.userType !== "company") {
      res.status(403).json({ error: "Only companies can access ratings" });
      return;
    }

    const existingRating = await ProductRating.findOne({
      productRequestId: new mongoose.Types.ObjectId(productRequestId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!existingRating) {
      res.status(404).json({ error: "No rating found" });
      return;
    }

    res.json(existingRating);
  } catch (error) {
    console.error("Error fetching product request rating:", error);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

// POST /api/productratings - Create new rating
router.post("/", protect, async (req, res) => {
  try {
    const { productId, productRequestId, rating, review } = req.body;
    const companyId = (req as any).user._id;

    // Validate required fields
    if (!productId || !productRequestId || !rating) {
      res.status(400).json({ error: "Product ID, product request ID, and rating are required" });
      return;
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productRequestId)) {
      res.status(400).json({ error: "Invalid product request ID" });
      return;
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    // Check if user is a company
    if ((req as any).user.userType !== "company") {
      res.status(403).json({ error: "Only companies can submit ratings" });
      return;
    }

    // Check if rating already exists for this specific product request
    const existingRating = await ProductRating.findOne({
      productRequestId: new mongoose.Types.ObjectId(productRequestId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (existingRating) {
      res.status(409).json({ error: "You have already rated this product request" });
      return;
    }

    // Create new rating
    const newRating = new ProductRating({
      productId: new mongoose.Types.ObjectId(productId),
      productRequestId: new mongoose.Types.ObjectId(productRequestId),
      companyId: new mongoose.Types.ObjectId(companyId),
      rating: Number(rating),
      review: review?.trim() || undefined,
      date: new Date(),
    });

    await newRating.save();

    res.status(201).json(newRating);
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ error: "Failed to create rating" });
  }
});

// GET /api/productratings/product/:productId - Get all ratings for a product
router.get("/product/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const ratings = await ProductRating.find({
      productId: new mongoose.Types.ObjectId(productId),
    })
      .populate("companyId", "name email") // Populate company details
      .populate("productRequestId", "createdAt quantity") // Populate product request details
      .sort({ date: -1 }); // Sort by newest first

    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
      : 0;

    res.json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Failed to fetch product ratings" });
  }
});

// GET /api/productratings/company/:companyId/all - Get all ratings by a specific company
router.get("/company/:companyId/all", protect, async (req, res) => {
  try {
    const { companyId } = req.params;
    const requestingUserId = (req as any).user._id;

    // Validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      res.status(400).json({ error: "Invalid company ID" });
      return;
    }

    // Check if user is authorized (either the company itself or admin/vendor)
    const isOwnCompany = requestingUserId.toString() === companyId;
    const isAuthorized = isOwnCompany || 
                        (req as any).user.userType === "admin" || 
                        (req as any).user.userType === "vendor";

    if (!isAuthorized) {
      res.status(403).json({ error: "Unauthorized to view these ratings" });
      return;
    }

    const ratings = await ProductRating.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .populate("productId", "name description") // Populate product details
      .populate("productRequestId", "createdAt quantity unitPrice totalPrice") // Populate product request details
      .sort({ date: -1 }); // Sort by newest first

    res.json({
      ratings,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Error fetching company ratings:", error);
    res.status(500).json({ error: "Failed to fetch company ratings" });
  }
});

// PUT /api/productratings/:ratingId - Update existing rating
router.put("/:ratingId", protect, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, review } = req.body;
    const companyId = (req as any).user._id;

    // Validate ratingId
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      res.status(400).json({ error: "Invalid rating ID" });
      return;
    }

    // Validate rating range
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    // Check if user is a company
    if ((req as any).user.userType !== "company") {
      res.status(403).json({ error: "Only companies can update ratings" });
      return;
    }

    // Find and update rating
    const existingRating = await ProductRating.findOne({
      _id: new mongoose.Types.ObjectId(ratingId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!existingRating) {
      res.status(404).json({ error: "Rating not found or unauthorized" });
      return;
    }

    // Update fields
    if (rating !== undefined) existingRating.rating = Number(rating);
    if (review !== undefined) existingRating.review = review?.trim() || undefined;

    await existingRating.save();

    res.json(existingRating);
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Failed to update rating" });
  }
});

// DELETE /api/productratings/:ratingId - Delete rating
router.delete("/:ratingId", protect, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const companyId = (req as any).user._id;

    // Validate ratingId
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      res.status(400).json({ error: "Invalid rating ID" });
      return;
    }

    // Check if user is a company
    if ((req as any).user.userType !== "company") {
      res.status(403).json({ error: "Only companies can delete ratings" });
      return;
    }

    // Find and delete rating
    const deletedRating = await ProductRating.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(ratingId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!deletedRating) {
      res.status(404).json({ error: "Rating not found or unauthorized" });
      return;
    }

    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ error: "Failed to delete rating" });
  }
});

export default router;