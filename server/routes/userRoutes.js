const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Professional = require("../models/Professional");
const axios = require("axios"); // Import axios
const router = express.Router();

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
    address, // Address to geocode
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

    // Geocode the address
    let location;
    if (address) {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "json",
          },
          headers: {
            "User-Agent": "takecare-server/1.0",
          },
        }
      );

      if (response.data.length === 0) {
        return res.status(400).json({ message: "Invalid address" });
      }

      const { lat, lon } = response.data[0];
      location = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      return res
        .status(400)
        .json({ message: "Address is required for geocoding" });
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

    // If the role is professional, create a Professional profile
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

    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
