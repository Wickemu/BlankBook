require('dotenv').config(); // Load configuration from .env

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// --- Connect to MongoDB via Mongoose ---
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blankbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(`${new Date().toISOString()} - Connected to MongoDB`))
  .catch(err => console.error(`${new Date().toISOString()} - MongoDB connection error:`, err));

// --- Define the Story Schema & Model ---
const storySchema = new mongoose.Schema({
  storyTitle: { type: String, required: true, unique: true },
  storyAuthor: { type: String, required: true },
  storyText: { type: String, required: true },
  variables: { type: Array, default: [] },
  fillValues: { type: Object, default: {} },
  pronounGroups: { type: Object, default: {} },
  variableCounts: { type: Object, default: {} },
  customPlaceholders: { type: Array, default: [] },
  pronounGroupCount: { type: Number, default: 0 },
  tags: { type: [String], default: [] },              // NEW: Tags for filtering stories
  rating: { type: Number, default: 0 },                 // NEW: Average rating
  ratingCount: { type: Number, default: 0 },            // NEW: Number of ratings received
  savedAt: { type: Date, default: Date.now }
});
const Story = mongoose.model('Story', storySchema);

// --- Create Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Security & Logging Middleware ---
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://code.jquery.com",
        "https://code.jquery.com/ui",
        "https://cdn.jsdelivr.net",
        "https://maxcdn.bootstrapcdn.com",
        "https://cdn.jsdelivr.net/npm/sweetalert2@10"
      ]
    }
  })
);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit JSON payloads
app.use(express.static(require('path').join(__dirname, 'public')));
app.use(morgan('combined'));

// --- Rate Limiting Middleware for API endpoints ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use('/api/', apiLimiter);

// --- Basic HTML Escaping (Improved Sanitation) ---
function sanitizeInput(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ====================================================
// Endpoint: Save (or Overwrite) a Story
// ====================================================
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
      let newStory = req.body;
      console.log(`${new Date().toISOString()} - Received story for saving:`, newStory.storyTitle);

      // --- Sanitize Inputs ---
      newStory.storyTitle = sanitizeInput(newStory.storyTitle);
      newStory.storyAuthor = sanitizeInput(newStory.storyAuthor);
      newStory.storyText = sanitizeInput(newStory.storyText);
      // (Assume other nested sanitization as needed)

      // --- Normalize Optional Fields & Add New Fields ---
      newStory.variables = newStory.variables || [];
      newStory.fillValues = newStory.fillValues || {};
      newStory.pronounGroups = newStory.pronounGroups || {};
      newStory.variableCounts = newStory.variableCounts || {};
      newStory.customPlaceholders = newStory.customPlaceholders || [];
      newStory.pronounGroupCount = newStory.pronounGroupCount || 0;
      newStory.tags = newStory.tags || []; // NEW: Tags
      // Overwrite flag support
      const overwrite = newStory.overwrite;

      // --- Check for Existing Story if Not Overwriting ---
      if (!overwrite) {
        const existing = await Story.findOne({ storyTitle: newStory.storyTitle });
        if (existing) {
          console.log(`${new Date().toISOString()} - Story exists and overwrite not requested: ${newStory.storyTitle}`);
          return res.status(409).json({ error: "Story with this title already exists." });
        }
      }

      // --- Upsert Story into Database ---
      const options = { new: true, upsert: true, runValidators: true };
      await Story.findOneAndUpdate({ storyTitle: newStory.storyTitle }, newStory, options);
      console.log(`${new Date().toISOString()} - Story saved/updated: ${newStory.storyTitle}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`${new Date().toISOString()} - Error in /api/savestory:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ====================================================
// Endpoint: Get All Saved Stories with Filtering & Sorting Options
// ====================================================
app.get('/api/getstories', async (req, res) => {
  try {
    const { tag, sort } = req.query;
    let query = {};
    if (tag) {
      // Find stories that have the specified tag (exact match)
      query.tags = tag;
    }
    let sortOptions = {};
    if (sort === 'date_asc') {
      sortOptions.savedAt = 1;
    } else if (sort === 'date_desc') {
      sortOptions.savedAt = -1;
    } else if (sort === 'rating_asc') {
      sortOptions.rating = 1;
    } else if (sort === 'rating_desc') {
      sortOptions.rating = -1;
    }
    const stories = await Story.find(query).sort(sortOptions).exec();
    res.json(stories);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving stories:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// Endpoint: Delete a Story by Title
// ====================================================
app.delete('/api/deletestory', async (req, res) => {
  try {
    const { storyTitle } = req.body;
    if (!storyTitle) {
      console.error(`${new Date().toISOString()} - Missing storyTitle in request body.`);
      return res.status(400).json({ error: "Missing storyTitle in request body." });
    }
    const deletion = await Story.deleteOne({ storyTitle });
    if (deletion.deletedCount === 0) {
      return res.status(404).json({ error: "Story not found." });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error deleting story:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// NEW Endpoint: Rate a Story
// ====================================================
app.post('/api/rateStory', async (req, res) => {
  const { storyId, rating } = req.body;
  if (!storyId || typeof rating !== 'number') {
    return res.status(400).json({ error: "Missing storyId or rating" });
  }
  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    // Update rating as an average
    const newRatingCount = story.ratingCount + 1;
    const newRating = ((story.rating * story.ratingCount) + rating) / newRatingCount;
    story.rating = newRating;
    story.ratingCount = newRatingCount;
    await story.save();
    res.json({ success: true, rating: story.rating, ratingCount: story.ratingCount });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error rating story:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// Global Error-Handling Middleware
// ====================================================
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Unhandled error:`, err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ====================================================
// Start the Server
// ====================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`${new Date().toISOString()} - Server is running on port ${PORT}`);
});
