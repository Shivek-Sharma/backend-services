import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
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

const s3Upload = async (file) => {
  try {
    const randomString = generateRandomString(32);
    const fileExtension = file.originalname.split(".").pop(); // Extract file extension
    const fileName = `banner-image-new/${randomString}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000",
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const objectURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return objectURL;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
};

export default s3Upload;
