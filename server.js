// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const STORIES_FILE = path.join(__dirname, 'stories.json');
const { sanitize } = require('express-validator'); // Import express-validator's sanitize function

// Use built-in JSON parser (Express 4.16+)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// --- New Utility Function: Sanitize Input ---
function sanitizeInput(text) {
  if (typeof text !== 'string') {
    return text; // Return non-string inputs as-is (or handle differently if needed)
  }
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Basic HTML escaping
  // For more robust sanitization, consider using a library like 'sanitize-html'
}

// Helper function to read saved stories from disk
function readStories() {
  try {
    if (fs.existsSync(STORIES_FILE)) {
      const data = fs.readFileSync(STORIES_FILE, 'utf8');
      console.log(`${new Date().toISOString()} - Reading stories.json. Data length: ${data.length}`); // Added timestamp to log
      return JSON.parse(data);
    }
    console.log(`${new Date().toISOString()} - stories.json not found; returning empty array.`); // Added timestamp to log
    return [];
  } catch (err) {
    console.error(`${new Date().toISOString()} - Error reading stories.json:`, err); // Added timestamp to log
    return [];
  }
}

// Helper function to write stories to disk
function saveStories(stories) {
  try {
    fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2), 'utf8');
    console.log(`${new Date().toISOString()} - Stories saved successfully.`); // Added timestamp to log
  } catch (err) {
    console.error(`${new Date().toISOString()} - Error writing stories.json:`, err); // Added timestamp to log
  }
}

// Endpoint to save (or overwrite) a story
app.post('/api/savestory', (req, res) => {
  const newStory = req.body;
  console.log(`${new Date().toISOString()} - Received story for saving:`, newStory.storyTitle); // Added timestamp and story title to log

  // --- Input Validation and Sanitization ---
  const missingFields = [];
  if (!newStory.storyTitle) missingFields.push("storyTitle");
  if (!newStory.storyAuthor) missingFields.push("storyAuthor");
  if (!newStory.storyText) missingFields.push("storyText");

  if (missingFields.length > 0) {
    const errorMessage = "Missing required fields: " + missingFields.join(", ");
    console.error(`${new Date().toISOString()} - ${errorMessage}`); // Added timestamp to log
    return res
      .status(400)
      .json({ error: errorMessage });
  }

  // Sanitize story data to prevent XSS (Cross-Site Scripting)
  newStory.storyTitle = sanitizeInput(newStory.storyTitle);
  newStory.storyAuthor = sanitizeInput(newStory.storyAuthor);
  newStory.storyText = sanitizeInput(newStory.storyText);
  // Sanitize variables displayOverride if present - important for user-provided text in placeholders
  if (newStory.variables && Array.isArray(newStory.variables)) {
    newStory.variables.forEach(variable => {
      if (variable.displayOverride) {
        variable.displayOverride = sanitizeInput(variable.displayOverride);
      }
    });
  }


  // Normalize optional fields
  newStory.variables = newStory.variables || [];
  newStory.fillValues = newStory.fillValues || {};
  newStory.pronounGroups = newStory.pronounGroups || {};
  newStory.variableCounts = newStory.variableCounts || {};
  newStory.customPlaceholders = newStory.customPlaceholders || [];
  newStory.pronounGroupCount = newStory.pronounGroupCount || 0;

  let stories = readStories();
  const existingIndex = stories.findIndex(s => s.storyTitle === newStory.storyTitle);
  if (existingIndex !== -1) {
    if (!newStory.overwrite) {
      console.log(`${new Date().toISOString()} - Story exists and overwrite not requested: ${newStory.storyTitle}`); // Added timestamp and story title to log
      return res.status(409).json({ error: "Story with this title already exists." });
    }
    console.log(`${new Date().toISOString()} - Overwriting existing story: ${newStory.storyTitle}`); // Added timestamp and story title to log
    stories[existingIndex] = newStory;
  } else {
    console.log(`${new Date().toISOString()} - Adding new story: ${newStory.storyTitle}`); // Added timestamp and story title to log
    stories.push(newStory);
  }
  saveStories(stories);
  res.json({ success: true });
});

// Endpoint to get all saved stories
app.get('/api/getstories', (req, res) => {
  try {
    const stories = readStories();
    res.json(stories);
  } catch (error) {
    const errorMessage = "Error retrieving saved stories.";
    console.error(`${new Date().toISOString()} - ${errorMessage}`, error); // Added timestamp and error details to log
    res.status(500).json({ error: errorMessage }); // Respond with 500 and error message
  }
});

// Endpoint to delete a story by title
app.delete('/api/deletestory', (req, res) => {
  const { storyTitle } = req.body;
  if (!storyTitle) {
    const errorMessage = "Missing storyTitle in request body.";
    console.error(`${new Date().toISOString()} - ${errorMessage}`); // Added timestamp to log
    return res.status(400).json({ error: errorMessage });
  }

  try {
    let stories = readStories();
    const newStories = stories.filter(s => s.storyTitle !== storyTitle);
    saveStories(newStories);
    res.json({ success: true });
  } catch (error) {
    const errorMessage = "Error deleting story.";
    console.error(`${new Date().toISOString()} - ${errorMessage} Title: ${storyTitle}`, error); // Added timestamp, title, and error details to log
    res.status(500).json({ error: errorMessage }); // Respond with 500 and error message
  }
});

// Bind to all interfaces (0.0.0.0) so that it's available on your LAN.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`${new Date().toISOString()} - Server is running on http://<your-local-IP>:${PORT}`); // Added timestamp to log
});