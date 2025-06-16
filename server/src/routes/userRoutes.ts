import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/upload"; // Your existing Cloudinary upload config
import cloudinary from "../utils/cloudinary";

const router = express.Router();

// Get user by ID
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

// Update user profile with Cloudinary upload support
router.put("/:id", protect, upload.single('profilePicture'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, userType, currentPassword, newPassword } = req.body;
    
    // Check authorization - users can only update their own profile
    if ((req as any).user._id.toString() !== req.params.id) {
      // Clean up uploaded file from Cloudinary if unauthorized
      if (req.file && (req.file as any).filename) {
        try {
          await cloudinary.uploader.destroy((req.file as any).filename);
        } catch (cleanupError) {
          console.error("Error cleaning up unauthorized upload:", cleanupError);
        }
      }
      res.status(403).json({ error: "Not authorized to update this user" });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      // Clean up uploaded file from Cloudinary if user not found
      if (req.file && (req.file as any).filename) {
        try {
          await cloudinary.uploader.destroy((req.file as any).filename);
        } catch (cleanupError) {
          console.error("Error cleaning up upload for missing user:", cleanupError);
        }
      }
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Handle password change if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        // Clean up uploaded file from Cloudinary if password is invalid
        if (req.file && (req.file as any).filename) {
          try {
            await cloudinary.uploader.destroy((req.file as any).filename);
          } catch (cleanupError) {
            console.error("Error cleaning up upload for invalid password:", cleanupError);
          }
        }
        res.status(400).json({ error: "Current password is incorrect" });
        return;
      }

      // Validate new password
      if (newPassword.length < 6) {
        // Clean up uploaded file from Cloudinary if validation fails
        if (req.file && (req.file as any).filename) {
          try {
            await cloudinary.uploader.destroy((req.file as any).filename);
          } catch (cleanupError) {
            console.error("Error cleaning up upload for invalid password:", cleanupError);
          }
        }
        res.status(400).json({ error: "New password must be at least 6 characters long" });
        return;
      }

      // update password - presave hook hashes it
      user.password = newPassword;
    }

    // Handle profile picture upload from Cloudinary
    if (req.file) {
      // Delete old profile picture from Cloudinary if it exists
      if (user.profilePicture) {
        try {
          // Extract public_id from the old Cloudinary URL
          const urlParts = user.profilePicture.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          const folderPath = urlParts.slice(-2, -1)[0]; // Get folder name
          const fullPublicId = `${folderPath}/${publicId}`;
          
          await cloudinary.uploader.destroy(fullPublicId);
        } catch (deleteError) {
          console.error("Error deleting old profile picture from Cloudinary:", deleteError);
          // Continue with update even if old image deletion fails
        }
      }
      
      // Save new profile picture URL from Cloudinary
      user.profilePicture = (req.file as any).path; // Cloudinary URL
    }

    // Update other fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;

    await user.save();

    // Return user data without password
    const updatedUser = await User.findById(user._id).select("name email userType profilePicture");
    
    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });

  } catch (err) {
    // Clean up uploaded file from Cloudinary in case of error
    if (req.file && (req.file as any).filename) {
      try {
        await cloudinary.uploader.destroy((req.file as any).filename);
      } catch (cleanupError) {
        console.error("Error cleaning up upload on server error:", cleanupError);
      }
    }
    
    console.error("Error updating user:", err);
    
  if (err instanceof Error && (err as any).name === 'ValidationError') {
    res.status(400).json({ error: err.message });
    return;
  }
    
    res.status(500).json({ error: "Server error" });
  }
});

export default router;