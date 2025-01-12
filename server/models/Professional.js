const mongoose = require('mongoose');

// Define the Professional schema
const professionalSchema = new mongoose.Schema({
    // Reference to the User model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // List of professions the professional specializes in
    professions: { 
        type: [String], 
        enum: ['fitness trainer', 'yoga', 'pilates', 'nlp', 'psychology', 'sociology'], 
        required: true 
    },

    // Services offered by the professional
    services: {
        inPerson: { type: Boolean, default: true }, // Indicates if in-person services are available
        viaZoom: { type: Boolean, default: false }  // Indicates if services via Zoom are available
    },

    // Optional description about the professional
    description: { type: String, required: false },

    // Array of image URLs for a gallery
    images: { type: [String], required: false },

    // Optional hourly rate for the professional's services
    hourlyRate: { type: Number, required: false },

    // Average rating of the professional
    rating: { type: Number, default: 0 },

    // References to the reviews for this professional
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

// Export the Professional model
module.exports = mongoose.model('Professional', professionalSchema);
