const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// Default settings
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Load existing credentials
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Save the credentials
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Perform the actual authentication
 */
const performAuthorization = async () => {
  try {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  } catch (error) {
    console.error('Error during authorization:', error.message);
    throw error; // Rethrow the error for middleware to handle
  }
};

/**
 * Middleware to authenticate using Google API
 */
const authorize = async (req, res, next) => {
  try {
    const auth = await performAuthorization(); // Call the authentication function
    req.auth = auth; // Store the auth object in req for later use
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Authorization error:', error.message);
    res.status(500).json({ error: 'Authorization failed', details: error.message });
  }
};
///////////////////////////////////
const addMeet = async (req, res, next) => {
  try {
    const auth = req.auth; // Authentication object passed from previous middleware
    const {professional,userId, calendarId, summary, description, start, end,recurrence } = req.body; // Extract details from request body

    // Validate required fields
    if (!auth || !calendarId || !start || !end||!recurrence) {
      return res.status(400).json({
        error: 'Authorization, Calendar ID, Start time, and End time are required.',
      });
    }
    console.log('start',start,'====','end',end)
    const calendar = google.calendar({ version: 'v3', auth });

    // Event object
    const event = {
      
      summary: summary || 'Untitled test Event',
      description: description || '',
      start: start,
      end: end,
      userId:userId,
      professional:professional||'',
      recurrence:recurrence||''
    };
          console.log('====================','event.start',event.start,'=====================')

    //console.log('QQQQQQQQQQQQQQQQQQ')

    // Add the event to the calendar
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });
    //console.log('SSSSSSSSSSSSSSS')

    console.log('Event added successfully:', response.data);

    // Store the created event in req for further processing
    req.newEvent = response.data;


    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Error adding a meeting:', error.message);

    // Handle errors appropriately
    if (error.response) {
      console.error('Google API response:', error.response.data);
    }

    res.status(500).json({
      error: 'Failed to add a meeting.',
      details: error.message,
    });
  }
};

//////////////////////
/**
 * Fetch events from the calendar
 * @param {google.auth.OAuth2} auth - The authentication object
 * @param {string} calendarId - The calendar ID
 * @param {number} maxResults - The maximum number of events to fetch
 */

const listEvents = async (req, res, next) => {
  try {
    const auth =req.auth
    const calendarId =req.body.calendarId
    const maxResults = req.body.maxResults|| 10; // Maximum number of events
    
    console.log('maxResults',maxResults)
    // Verify required fields
    if (!auth || !calendarId) {
      return res.status(400).json({ error: 'Authorization or Calendar ID is missing.' });
    }
    const calendar = google.calendar({ version: 'v3', auth });

    // Fetch events
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      req.events = []; // Save empty list in req for further use
    } else {
      console.log(`Upcoming ${maxResults} events:`);
      events.forEach((event) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
      req.events = events; // Save the fetched events in req for further use
    }

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
};



async function updateEvent(calendar, auth, event) {
  let numAttempts = 0;
  let isUpdated = false;

  while (!isUpdated && numAttempts < MAX_UPDATE_ATTEMPTS) {
    try {
      const updatedEvent = await calendar.events.update({
        calendarId: 'primary',
        eventId: event.id,
        resource: event,
        headers: { 'If-Match': event.etag }, // בדיקת ETag למניעת התנגשויות
        auth,
      });
      console.log('Event updated successfully.');
      isUpdated = true;
      return updatedEvent.data;
    } catch (error) {
      if (error.code === 412) {
        console.warn('Conflict detected. Fetching latest event.');
        const latestEvent = await calendar.events.get({
          calendarId: 'primary',
          eventId: event.id,
          auth,
        });
        latestEvent.data.summary = event.summary; // מעדכן את ה-summary
        event = latestEvent.data;
      } else {
        throw error;
      }
    }
    numAttempts++;
  }

  if (!isUpdated) {
    console.error(`Failed to update event after ${MAX_UPDATE_ATTEMPTS} attempts.`);
  }
}

// Export the module
module.exports = {
  addMeet,
  authorize,
  listEvents,
  updateEvent,
};
