const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const session = require('express-session');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2000;

// Load environment variables
dotenv.config();

// Database connection
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://accounts.google.com', 'https://apis.google.com'],
    frameSrc: ["'self'", 'https://accounts.google.com'],
    frameAncestors: ["'self'", 'https://accounts.google.com']
  }
}));

const corsOptions = {
    origin: [
        'http://localhost:3000', // Your frontend URL
        'http://localhost:5174', // Another possible frontend URL if you have multiple
        'http://127.0.0.1:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept'
    ],
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

//--testing---
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
  });
  
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
app.use("/api/auth", authGoogle);

// Start the server
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
