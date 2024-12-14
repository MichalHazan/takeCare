const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Implement logic to find or create user in your database
    // Example: Save user in DB or find existing one
    const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
    };
    done(null, user);
}));

// Serialize/Deserialize user for session support
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initialize Router
const router = express.Router();

// Google OAuth Routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful login, user is stored in session
        res.redirect('/dashboard'); // Change this to your frontend dashboard route
    }
);

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