const express = require("express");
const router = express.Router();
const {authorize, listEvents,updateEvent, addMeet } = require('../controllers/googleCalendar');


router.post("/addMeeting", authorize, addMeet ,(req, res) => {
    try{
        const event = req.newEvent;
        res.status(201).json({
        message: 'Meeting added successfully', event});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
 } );


///////////////////////////////////////////////////////////////////
router.patch("/getAllMeeting", authorize, listEvents, (req, res) => {
    try {
        const auth = req.auth; // Retrieve the auth object from the middleware
        console.log('auth')
        // const calendarId = 'dc7b7528a6d622dbb7cdd305f152a37f7d982ac09e6f5b690d0ca046adc85c97@group.calendar.google.com'; // מזהה היומן
        // const maxResults = 5; // Maximum number of events
        console.log('getAllMeeting')
        const events=req.events
        console.log('Retrieved events:', events);

        // Returning events to the client
        res.status(200).json(events);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put("/updateEvent", authorize, listEvents, (req, res) => {
    try {
        const auth = req.auth; // Retrieve the auth object from the middleware
        console.log('auth')
        // const calendarId = 'dc7b7528a6d622dbb7cdd305f152a37f7d982ac09e6f5b690d0ca046adc85c97@group.calendar.google.com'; // מזהה היומן
        // const maxResults = 5; // Maximum number of events
        console.log('getAllMeeting')
        const events=req.events
        console.log('Retrieved events:', events);

        // Returning events to the client
        res.status(200).json(events);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;