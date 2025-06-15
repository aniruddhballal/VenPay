import express, { Request, Response } from "express";
import User from "../models/User";
import { protect } from "../middleware/authMiddleware"; // Adjust the path if needed

const router = express.Router();

// 👇 Add `protect` middleware here
router.get("/:id", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("name email userType profilePicture");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// userRoutes.ts
router.put("/:id", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, userType, profilePicture} = req.body;

    // Optional: You might want to restrict updates to only the logged-in user
    if ((req as any).user._id.toString() !== req.params.id) {
      res.status(403).json({ error: "Not authorized to update this user" });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;
    if (profilePicture) user.profilePicture = profilePicture; // 👈 ADD THIS

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
