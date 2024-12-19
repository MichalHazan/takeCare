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

// Register a new user
router.post("/register", async (req, res) => {
  //console.log(req)
  const {
    fullname,
    username,
    email,
    password,
    phone,
    gender,
    birthDate,
    location,
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
  const { email, password } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

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
  console.log(userId)

  try {
    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password
    console.log(user)
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
router.delete("/logout", onlyUsers, (req, res) => {
  req.session.destroy();
  res.send({ msg: "bye bye" });
});

// Get all professionals
router.get("/allprofessional", getProfessionals);

// Get professional by ID
router.get("/proffessional/:professionalId", getProfessionalById);
// Update user details
router.put("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log('userId',userId)
  console.log('========================')

  console.log('req.params',req.params)
  //const { userId } = req.params;
  const {
    fullname,
    username,
    email,
    phone,
    gender,
    birthDate,
    //address,
    professions,
    services,
    description,
    images,
    hourlyRate,
  } = req.body;
console.log('req.session.user',req.session)
  try {
    // if (req.session.user.id !== userId) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not authorized to update this user." });
    // }

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

        await professional.save();
      }
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
