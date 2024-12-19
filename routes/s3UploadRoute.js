import express from "express";
import multer from "multer";

import s3Upload from "../aws/s3Client.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const imageUrl = await s3Upload(req.file);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully to s3",
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
