//nominatim.js
const express = require('express');
const axios = require('axios'); // Importing axios for making HTTP requests
const router = express.Router();

// Geocoding: Convert an address to coordinates
router.get('/geocode', async (req, res) => {
    const { address } = req.query; // Extracting the 'address' parameter from the query

    // Check if the address parameter is provided
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        // Sending a request to Nominatim using axios
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address, // Address to search for
                format: 'json', // Format of the response
            },
            headers: {
                'User-Agent': 'takecare-server/1.0', // Identifying the client
            },
        });

        const results = response.data;

        // Check if results were found
        if (results.length === 0) {
            return res.status(404).json({ error: 'No results found' });
        }

        // Send the first result back to the client
        res.json(results[0]);
    } catch (error) {
        // Log the error and return a 500 Internal Server Error
        console.error('Error during geocoding:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reverse Geocoding: Convert coordinates to an address
router.get('/reverse', async (req, res) => {
    const { lat, lon } = req.query; // Extracting 'lat' and 'lon' parameters from the query


    // Check if both latitude and longitude are provided
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        // Sending a request to Nominatim using axios
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                format: 'json', // Format of the response
                lat, // Latitude
                lon, // Longitude
            },
            headers: {
                'User-Agent': 'takecare-server/1.0', // Identifying the client
            },
        });

        const result = response.data;

        // Check if an address was found
        if (!result || !result.address) {
            return res.status(404).json({ error: 'No address found' });
        }

        // Send the address back to the client
        res.json(result.address);
    } catch (error) {
        // Log the error and return a 500 Internal Server Error
        console.error('Error during reverse geocoding:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
