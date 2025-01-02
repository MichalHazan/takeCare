const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
///////////////
const uploadToCloudinary = require('../middleware/uploadToCloudinary');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
//const upload = require("../middleware/upload");

const app = express();
//////////////////

// Register a new user
router.post("/register", async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    phone,
    gender,
    birthDate,
    location, // { type: 'Point', coordinates: [longitude, latitude] }
    cityName,
    streetName,
    role,
    professions,
    services,
    description,
    images,
    hourlyRate,
  } = req.body;

  try {
    if (role === "professional" && (!professions || professions.length === 0)) {
      return res
        .status(400)
        .json({ message: "Professionals must specify their professions" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate location
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message:
          'Location must be provided as { type: "Point", coordinates: [longitude, latitude] }',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the base user
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
      location,
      birthDate,
      cityName,
      streetName,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a Professional profile if role is professional
    if (role === "professional") {
      const newProfessional = new Professional({
        userId: savedUser._id,
        professions,
        services,
        description,
        images,
        hourlyRate,
      });

      await newProfessional.save();
    }

    res
      .status(201)
      .json({ message: "User registered successfully", userId: savedUser._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    // Find user by either email or username
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }

    // Create a JWT token with the user's id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    // Store user data in session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user details
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is professional, fetch professional details
    let professionalDetails = null;
    if (user.role === "professional") {
      professionalDetails = await Professional.findOne({ userId: user._id });
    }

    res.status(200).json({
      user,
      professionalDetails,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout a user
router.post("/logout", onlyUsers, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out.' });
    }
    res.clearCookie('takecare'); // Clear session cookie
    res.json({ message: 'Logout successful' });
  });
});

// Get all professionals
router.get("/allprofessional", getProfessionals);

// Get professional by ID
router.get("/professional/:professionalId", getProfessionalById);

// Update user details
router.put("/update/:userId", async (req, res) => {
  const { userId } = req.params;

  const {
    fullname,
    username,
    email,
    phone,
    gender,
    birthDate,
    professions,
    services,
    description,
    images,
    hourlyRate,
  } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.birthDate = birthDate || user.birthDate;

    const updatedUser = await user.save();

    if (user.role === "professional") {
      const professional = await Professional.findOne({ userId: user._id });
      if (professional) {
        professional.professions = professions || professional.professions;
        professional.services = services || professional.services;
        professional.description = description || professional.description;
        professional.images = images || professional.images;
        professional.hourlyRate = hourlyRate || professional.hourlyRate;

        // Save the updated professional data
        await professional.save();
      }
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error" });
    }
  }
});

// Adding and updating images
router.put(
  "/updateImages/:userId",
  upload.array("images", 10),
  uploadToCloudinary,
  //upload.processFiles,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "professional") {
        const professional = await Professional.findOne({ userId: user._id });
        if (!professional) {
          return res.status(404).json({ message: "Professional not found" });
        }

        if (!req.uploadedUrls || req.uploadedUrls.length === 0) {
          return res.status(400).json({ message: "No images were uploaded" });
        }

        // Add new images
        professional.images = professional.images || [];
        professional.images.push(...req.uploadedUrls);

        // Save updated professional
        await professional.save();

        return res.status(200).json({
          message: "Images updated successfully",
          images: professional.images,
        });
      } else {
        return res
          .status(403)
          .json({ message: "Only professionals can upload images" });
      }
    } catch (err) {
      console.error("Error updating images:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);



// Delete an image
router.put("/DeleteImages/:userId", 
  //upload.deleteFiles, 
  uploadToCloudinary.deleteFiles,  async (req, res) => {
  const { userId } = req.params;
  const { public_id } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "professional") {
      const professional = await Professional.findOne({ userId: user._id });
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }

      const images = professional.images;

      // Check if public_id exists in the array
      const assetExists = images.some((image) => {
        const parsedImage = JSON.parse(image); // Parse the JSON string
        return parsedImage.public_id === public_id; // Check if public_id matches
      });

      if (!assetExists) {
        return res.status(404).json({ message: "Image with the given public_id not found" });
      }

      // Filter the array to remove the specified asset
      const updatedImages = images.filter((image) => {
        const parsedImage = JSON.parse(image);
        return parsedImage.public_id !== public_id;
      });

      professional.images = updatedImages;

      // Save the updated professional data
      await professional.save();

      return res.status(200).json({
        message: "Image deleted successfully",
        updatedImages: professional.images,
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only professionals can delete images" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete All an image
router.delete("/DeleteAllImages/:userId", 
  //upload.deleteFiles, 
  uploadToCloudinary.deleteAllImages,  async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "professional") {
      const professional = await Professional.findOne({ userId: user._id });
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }


      professional.images = [];

      // Save the updated professional data
      await professional.save();

      return res.status(200).json({
        message: "All Image deleted successfully",
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only professionals can delete images" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
