// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const STORIES_FILE = path.join(__dirname, 'stories.json');

// Use built-in JSON parser (Express 4.16+)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read saved stories from disk
function readStories() {
  try {
    if (fs.existsSync(STORIES_FILE)) {
      const data = fs.readFileSync(STORIES_FILE, 'utf8');
      console.log("Reading stories.json. Data length:", data.length);
      return JSON.parse(data);
    }
    console.log("stories.json not found; returning empty array.");
    return [];
  } catch (err) {
    console.error("Error reading stories.json:", err);
    return [];
  }
}

// Helper function to write stories to disk
function saveStories(stories) {
  try {
    fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2), 'utf8');
    console.log("Stories saved successfully.");
  } catch (err) {
    console.error("Error writing stories.json:", err);
  }
}

// Endpoint to save (or overwrite) a story
app.post('/api/savestory', (req, res) => {
  const newStory = req.body;
  console.log("Received story for saving:", newStory);

  // Validate required fields: storyTitle, storyAuthor, and storyText
  const missingFields = [];
  if (!newStory.storyTitle) missingFields.push("storyTitle");
  if (!newStory.storyAuthor) missingFields.push("storyAuthor");
  if (!newStory.storyText) missingFields.push("storyText");

  if (missingFields.length > 0) {
    console.error("Missing required fields:", missingFields.join(", "));
    return res
      .status(400)
      .json({ error: "Missing required fields: " + missingFields.join(", ") });
  }

  let stories = readStories();
  // Check if a story with the same title exists
  const existingIndex = stories.findIndex(s => s.storyTitle === newStory.storyTitle);
  if (existingIndex !== -1) {
    // If the client did not request overwrite, send a 409 conflict
    if (!newStory.overwrite) {
      console.log("Story exists and overwrite not requested.");
      return res.status(409).json({ error: "Story with this title already exists." });
    }
    console.log("Overwriting existing story:", newStory.storyTitle);
    stories[existingIndex] = newStory;
  } else {
    console.log("Adding new story:", newStory.storyTitle);
    stories.push(newStory);
  }
  saveStories(stories);
  res.json({ success: true });
});

// Endpoint to get all saved stories
app.get('/api/getstories', (req, res) => {
  const stories = readStories();
  res.json(stories);
});

// Endpoint to delete a story by title
app.delete('/api/deletestory', (req, res) => {
  const { storyTitle } = req.body;
  if (!storyTitle) {
    return res.status(400).json({ error: "Missing storyTitle in request" });
  }
  let stories = readStories();
  const newStories = stories.filter(s => s.storyTitle !== storyTitle);
  saveStories(newStories);
  res.json({ success: true });
});

// Bind to all interfaces (0.0.0.0) so that it's available on your LAN.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://<your-local-IP>:${PORT}`);
});
