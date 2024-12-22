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


const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(express.json());
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
const reviewRoutes = require('./routes/reviewRoutes');
const galeryRoutes = require('./routes/galeryRoutes');

app.use('/api/reviews', reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/galery", galeryRoutes);

// Start the server
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
