import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";
import fs from "node:fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Define TypeScript types for Cloudinary upload response
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

// Function to upload a file to Cloudinary
const uploadonCloudinary = async (localFilePath: string, options={}): Promise<CloudinaryUploadResult | null> => {
  try {
    // Check if the file exists
    await fs.promises.access(localFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      ...options,
    });

    console.log("File uploaded to Cloudinary. File URL:", result.url);

    // Delete the local file after uploading
    await fs.promises.unlink(localFilePath);

    return { secure_url: result.secure_url, public_id: result.public_id }; // Return the Cloudinary response
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // Attempt to delete the local file if it exists
    try {
      await fs.promises.unlink(localFilePath);
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError);
    }

    return null; // Return null if upload fails
  }
};

// Function to delete a file from Cloudinary
const deleteOnCloudinary = async (publicId: string): Promise<boolean> => {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log("File deleted from Cloudinary. PublicID:", publicId);
      return true;
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      return false;
    }
  };

export { uploadonCloudinary, deleteOnCloudinary };