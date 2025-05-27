import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary"; // path may vary

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "venpay-products",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

const upload = multer({ storage });

export default upload;