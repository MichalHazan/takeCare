const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Token generation utility
const generateTokens = (user) => {
	 // Check if JWT_SECRET exists
	 if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	  }
	
  // Access token
  const accessToken = jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      role: user.role
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' }
  );
 // Similarly check for refresh secret
 if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  // Refresh token
  const refreshToken = jwt.sign(
    { 
      userId: user._id 
    }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Google OAuth Login/Signup
router.post('/google/login', async (req, res) => {
  try {
    const { token, clientId } = req.body;
    console.log("token ", token)
    console.log("clientId ", clientId)
     // Validate inputs
     if (!token) {
      return res.status(400).json({ 
        message: 'Missing token' 
      });
    }
    // Use environment variable as fallback
    const verifyClientId = clientId || process.env.GOOGLE_CLIENT_ID;

    if (!verifyClientId) {
      return res.status(400).json({ 
        message: 'Google Client ID is not configured' 
      });
    }
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: verifyClientId // Use the client ID from the request
    });
    
    const payload = ticket.getPayload();
    const email = payload['email'];

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      console.log("creating new user")
      // Create new user
      user = new User({
        fullname: payload['name'],
        email: email,
        username: email.split('@')[0],
        password: "123", // Google users don't have a password
        phone: '111111111', // You might want to add a flow to collect this
        gender: 'other',
        role: 'customer',
        location: {
          type: 'Point',
          coordinates: [0, 0] // Default coordinates
        },
        birthDate: new Date()
      });

      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during Google authentication',
      error: error.message
    });
  }
});

// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out.' });
    }
    res.clearCookie('tackecare'); // Clear session cookie
    res.json({ message: 'Logout successful' });
  });
});


module.exports = router;