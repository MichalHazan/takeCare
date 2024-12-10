const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'); // Add passport
const PORT = process.env.PORT || 2000;
const Nominatim = require('./nominatim'); // ייבוא הראוטר

// Load environment variables
dotenv.config();

// Database connection
connectDB();

// Initialize Express app
const app = express();



// Middleware
app.use(bodyParser.json());

app.use('/nominatim', Nominatim);

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Session middleware
app.use(session({
    secret: "takecareshoosh",
    name: "tackecare",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Basic Route
app.get("/", (req, res) => {
    res.send("takecare API is running!");
});

// Routes
const userRoutes = require("./routes/userRoutes");
const authGoogle = require("./routes/authGoogle");
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/reviews', reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authGoogle);

// Demo route (example data)
app.get("/api/professionsList", (req, res) => {
    const professionTypes = ['fitness trainer', 'yoga', 'pilates', 'nlp', 'psychology', 'sociology'];
    res.json(professionTypes);
});

// Start the server
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
