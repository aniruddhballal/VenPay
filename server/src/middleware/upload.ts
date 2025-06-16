import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"; // ✅ this stays
import cloudinary from "../utils/cloudinary";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "venpay-products",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
}) as unknown as multer.StorageEngine;

const upload = multer({ storage });

export default upload;