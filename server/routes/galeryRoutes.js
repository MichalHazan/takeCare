const express = require("express");
const User = require("../models/User");
const Professional = require("../models/Professional");
const router = express.Router();
const {
  getProfessionals,
  getProfessionalById,
} = require("../controllers/professionalController");
const onlyAdmin = require("../middleware/onlyAdmin");
const onlyProfessional = require("../middleware/onlyProfessional");
const onlyUsers = require("../middleware/onlyUsers");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_uploads", // The folder in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional image transformation
  },
});

const upload = multer({ storage: storage });

// Create the upload route
router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    console.log("user is ", req.user);
    const uploadedFiles = req.files;
    const imageUrls = uploadedFiles.map((file) => file.path);

    // Update user's images array in MongoDB
    await User.findByIdAndUpdate(req.user._id, {
      $push: { images: { $each: imageUrls } },
    });

    res.json({
      success: true,
      imageUrls: imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/images", async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assuming you have authentication middleware
    res.json({ images: user.images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
