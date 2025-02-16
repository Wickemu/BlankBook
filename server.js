const express = require('express');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 3000;
const STORIES_FILE = path.join(__dirname, 'stories.json');

// --- Security & Logging Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));

// --- Basic HTML escaping (improved sanitation) ---
function sanitizeInput(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Asynchronous Helpers to Read/Write Stories ---
async function readStories() {
  try {
    await fsPromises.access(STORIES_FILE);
    const data = await fsPromises.readFile(STORIES_FILE, 'utf8');
    console.log(`${new Date().toISOString()} - Read stories.json, length: ${data.length}`);
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`${new Date().toISOString()} - stories.json not found; returning empty array.`);
      return [];
    }
    console.error(`${new Date().toISOString()} - Error reading stories.json:`, err);
    return [];
  }
}

async function saveStories(stories) {
  try {
    await fsPromises.writeFile(STORIES_FILE, JSON.stringify(stories, null, 2), 'utf8');
    console.log(`${new Date().toISOString()} - Stories saved successfully.`);
  } catch (err) {
    console.error(`${new Date().toISOString()} - Error writing stories.json:`, err);
    throw err;
  }
}

// --- Endpoint to Save (or Overwrite) a Story ---
app.post(
  '/api/savestory',
  [
    body('storyTitle').notEmpty().withMessage('storyTitle is required'),
    body('storyAuthor').notEmpty().withMessage('storyAuthor is required'),
    body('storyText').notEmpty().withMessage('storyText is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(`${new Date().toISOString()} - Validation errors:`, errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newStory = req.body;
      console.log(`${new Date().toISOString()} - Received story for saving:`, newStory.storyTitle);

      // --- Sanitize Inputs ---
      newStory.storyTitle = sanitizeInput(newStory.storyTitle);
      newStory.storyAuthor = sanitizeInput(newStory.storyAuthor);
      newStory.storyText = sanitizeInput(newStory.storyText);
      if (newStory.variables && Array.isArray(newStory.variables)) {
        newStory.variables.forEach(variable => {
          if (variable.displayOverride) {
            variable.displayOverride = sanitizeInput(variable.displayOverride);
          }
        });
      }

      // --- Normalize Optional Fields ---
      newStory.variables = newStory.variables || [];
      newStory.fillValues = newStory.fillValues || {};
      newStory.pronounGroups = newStory.pronounGroups || {};
      newStory.variableCounts = newStory.variableCounts || {};
      newStory.customPlaceholders = newStory.customPlaceholders || [];
      newStory.pronounGroupCount = newStory.pronounGroupCount || 0;

      const stories = await readStories();
      const existingIndex = stories.findIndex(s => s.storyTitle === newStory.storyTitle);
      if (existingIndex !== -1) {
        if (!newStory.overwrite) {
          console.log(`${new Date().toISOString()} - Story exists and overwrite not requested: ${newStory.storyTitle}`);
          return res.status(409).json({ error: "Story with this title already exists." });
        }
        console.log(`${new Date().toISOString()} - Overwriting existing story: ${newStory.storyTitle}`);
        stories[existingIndex] = newStory;
      } else {
        console.log(`${new Date().toISOString()} - Adding new story: ${newStory.storyTitle}`);
        stories.push(newStory);
      }
      await saveStories(stories);
      res.json({ success: true });
    } catch (error) {
      console.error(`${new Date().toISOString()} - Error in /api/savestory:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// --- Endpoint to Get All Saved Stories ---
app.get('/api/getstories', async (req, res) => {
  try {
    const stories = await readStories();
    res.json(stories);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving saved stories:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Endpoint to Delete a Story by Title ---
app.delete('/api/deletestory', async (req, res) => {
  try {
    const { storyTitle } = req.body;
    if (!storyTitle) {
      console.error(`${new Date().toISOString()} - Missing storyTitle in request body.`);
      return res.status(400).json({ error: "Missing storyTitle in request body." });
    }
    let stories = await readStories();
    const newStories = stories.filter(s => s.storyTitle !== storyTitle);
    await saveStories(newStories);
    res.json({ success: true });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error deleting story:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Global Error-Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Unhandled error:`, err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start the Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`${new Date().toISOString()} - Server is running on port ${PORT}`);
});
