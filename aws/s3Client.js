import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // AWS_REGION=ap-south-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

// Main function that handles s3 upload
const s3Upload = async (fileName, body, contentType) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000",
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
};

// Fetch image data from URL, then upload to s3
const s3ImageUpload = async (imageUrl) => {
  try {
    // Fetch the image data from the URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const contentType = response.headers["content-type"];
    const randomString = generateRandomString(32);
    const fileExtension = imageUrl.split(".").pop(); // Extract file extension
    const fileName = `image/${randomString}.${fileExtension}`;

    await s3Upload(fileName, response.data, contentType);

    return fileName;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

// Upload file to s3
const s3FileUpload = async (file) => {
  try {
    const randomString = generateRandomString(32);
    const fileExtension = file.originalname.split(".").pop(); // Extract file extension
    const fileName = `image/${randomString}.${fileExtension}`;

    await s3Upload(fileName, file.buffer, file.mimetype);

    return fileName;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
};

export { s3ImageUpload, s3FileUpload };
