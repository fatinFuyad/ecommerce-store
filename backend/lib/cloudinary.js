import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export default cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Uploads an image file
export const uploadImage = async function (imagePath, folder) {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: `ecommerce/${folder || "products"}`
  };

  // Upload the image
  if (!imagePath) throw new Error("No image of the product is provided!");
  const result = await cloudinary.uploader.upload(imagePath, options);
  return result.secure_url;
};

export const deleteImage = async (image, folder) => {
  const path = `ecommerce/${folder || "products"}`;
  const publicId = image.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(`${path}/${publicId}`);
};
