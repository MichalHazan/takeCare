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
  const {
    fullname,
    username,
    email,
    password,
    phone,
    gender,
    birthDate,
    location, // { type: 'Point', coordinates: [longitude, latitude] }
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

    //  create a Professional profile
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

  try {
    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Create a JWT token with the user's id and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: "24h" } // Expiration time (optional)
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

// Logout a user
router.delete("/logout", onlyUsers, (req, res) => {
  req.session.destroy();
  res.send({ msg: "bye bye" });
});

//get all proffiasonal
router.get("/allprofessional", getProfessionals);
//get professional by id
router.get("/proffessional/:professionalId", getProfessionalById);

router.get("/admin", onlyAdmin, (req, res) => {
  res.send({ msg: "hello admin" });
});

router.get("/test", onlyProfessional, (req, res) => {
  res.send({ msg: "hello test" });
});
module.exports = router;
