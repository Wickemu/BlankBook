require('dotenv').config(); // Load configuration from .env
// Enable global async error handling
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

let dbConnected = false;
async function connectToDatabase() {
  if (dbConnected || process.env.DISABLE_DB === 'true') return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost/blankbook';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    dbConnected = true;
    console.log(`${new Date().toISOString()} - Connected to MongoDB`);
  } catch (err) {
    console.error(`${new Date().toISOString()} - MongoDB connection error:`, err);
  }
}

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
  tags: { type: [String], default: [] },              // Tags for filtering stories
  rating: { type: Number, default: 0 },              // Average rating
  ratingCount: { type: Number, default: 0 },         // Number of ratings received
  savedAt: { type: Date, default: Date.now },
  password: { type: String, default: null },         // Password for private stories
  
  // New fields for chapter support
  chapters: {
    type: [{
      chapterTitle: { type: String, required: true },
      chapterNumber: { type: Number, required: true },
      chapterText: { type: String, required: true },
      variables: { type: Array, default: [] },
      fillValues: { type: Object, default: {} },
      pronounGroups: { type: Object, default: {} },
      variableCounts: { type: Object, default: {} },
      customPlaceholders: { type: Array, default: [] },
      pronounGroupCount: { type: Number, default: 0 },
      savedAt: { type: Date, default: Date.now }
    }],
    default: []
  },
  currentChapter: { type: Number, default: 0 } // 0 means no chapters yet or at the story level
});
const Story = mongoose.model('Story', storySchema);

// --- Create Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Security & Logging Middleware ---
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",  // Allow inline scripts
        "'unsafe-eval'",    // Allow eval for webpack development
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://maxcdn.bootstrapcdn.com",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11.4.8"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://maxcdn.bootstrapcdn.com",
        "https://cdnjs.cloudflare.com",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com"
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://maxcdn.bootstrapcdn.com",
        "https://cdnjs.cloudflare.com",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.gstatic.com"
      ],
      imgSrc: ["'self'", "data:"]
    }
  })
);

app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

app.use(compression());

// Parse allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : (process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:3000']);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '100kb' })); // Limit JSON payloads
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));

// Enable HTTP Strict Transport Security (HSTS)
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

// --- Rate Limiting Middleware for API endpoints ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// --- Enhanced HTML Sanitization for XSS Protection ---
function sanitizeInput(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')    // Escape ampersands first
    .replace(/</g, '&lt;')     // Less than
    .replace(/>/g, '&gt;')     // Greater than
    .replace(/"/g, '&quot;')   // Double quotes
    .replace(/'/g, '&#x27;')   // Single quotes
    .replace(/\//g, '&#x2F;')  // Forward slash
    .replace(/`/g, '&#x60;')   // Backtick
    .replace(/\(/g, '&#40;')   // Open parenthesis
    .replace(/\)/g, '&#41;');  // Close parenthesis
}

// ====================================================
// Endpoint: Save (or Overwrite) a Story
// ====================================================
app.post(
  '/api/savestory',
  [
    body('storyTitle').notEmpty().withMessage('storyTitle is required').trim().escape(),
    body('storyAuthor').notEmpty().withMessage('storyAuthor is required').trim().escape(),
    body('storyText').notEmpty().withMessage('storyText is required').trim().escape()
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
      newStory.tags = newStory.tags || [];
      newStory.chapters = newStory.chapters || [];
      newStory.currentChapter = newStory.currentChapter || 0;
      if (newStory.password && newStory.password.trim() === "") {
        newStory.password = null;
      }
      if (newStory.password) {
        const rounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
        newStory.password = await bcrypt.hash(newStory.password, rounds);
      }
      
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
// NEW Endpoint: Save (or Update) a Chapter to a Story
// ====================================================
app.post(
  '/api/savechapter',
  [
    body('storyTitle').notEmpty().withMessage('storyTitle is required').trim().escape(),
    body('chapterTitle').notEmpty().withMessage('chapterTitle is required').trim().escape(),
    body('chapterNumber').isNumeric().withMessage('chapterNumber is required and must be a number'),
    body('chapterText').notEmpty().withMessage('chapterText is required').trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(`${new Date().toISOString()} - Validation errors for chapter:`, errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { 
        storyTitle, 
        chapterTitle, 
        chapterNumber, 
        chapterText, 
        variables, 
        fillValues, 
        pronounGroups,
        variableCounts, 
        customPlaceholders, 
        pronounGroupCount
      } = req.body;
      
      console.log(`${new Date().toISOString()} - Saving chapter ${chapterNumber} for story: ${storyTitle}`);
      
      // Find the story
      const story = await Story.findOne({ storyTitle });
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      
      // Sanitize inputs
      const sanitizedChapterTitle = sanitizeInput(chapterTitle);
      const sanitizedChapterText = sanitizeInput(chapterText);
      
      // Create chapter object
      const chapter = {
        chapterTitle: sanitizedChapterTitle,
        chapterNumber: parseInt(chapterNumber),
        chapterText: sanitizedChapterText,
        variables: variables || [],
        fillValues: fillValues || {},
        pronounGroups: pronounGroups || {},
        variableCounts: variableCounts || {},
        customPlaceholders: customPlaceholders || [],
        pronounGroupCount: pronounGroupCount || 0,
        savedAt: new Date()
      };
      
      // Find if the chapter already exists by chapter number
      const chapterIndex = story.chapters.findIndex(ch => ch.chapterNumber === parseInt(chapterNumber));
      
      if (chapterIndex !== -1) {
        // Update existing chapter
        story.chapters[chapterIndex] = chapter;
      } else {
        // Add new chapter
        story.chapters.push(chapter);
        // Sort chapters by chapter number
        story.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
      }
      
      // Update current chapter
      story.currentChapter = parseInt(chapterNumber);
      
      await story.save();
      console.log(`${new Date().toISOString()} - Chapter ${chapterNumber} saved for story: ${storyTitle}`);
      res.json({ success: true, story });
      
    } catch (error) {
      console.error(`${new Date().toISOString()} - Error saving chapter:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ====================================================
// Endpoint: Get All Saved Stories with Filtering & Sorting Options
// ====================================================
app.get('/api/getstories', async (req, res) => {
  try {
    console.log(`${new Date().toISOString()} - GET /api/getstories request received from: ${req.ip}`);
    console.log(`${new Date().toISOString()} - Query params:`, req.query);
    
    const { tag, sort } = req.query;
    let query = {};
    if (tag) {
      // Search in storyTitle, storyText, or tags (exact match for tags)
      query.$or = [
        { storyTitle: { $regex: tag, $options: 'i' } },
        { storyText: { $regex: tag, $options: 'i' } },
        { tags: tag }
      ];
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
    } else if (sort === 'alpha_asc') {
      sortOptions.storyTitle = 1;
    } else if (sort === 'alpha_desc') {
      sortOptions.storyTitle = -1;
    }
    console.log(`${new Date().toISOString()} - DB Query:`, query);
    console.log(`${new Date().toISOString()} - Sort options:`, sortOptions);
    
    const stories = await Story.find(query).sort(sortOptions).exec();
    console.log(`${new Date().toISOString()} - Found ${stories.length} stories`);
    
    // For locked stories, remove sensitive fields and add a "locked" flag.
    const modifiedStories = stories.map(story => {
      const s = story.toObject();
      if (s.password) {
        s.locked = true;
        delete s.storyText;
        delete s.password;
        
        // Also protect chapter texts for locked stories
        if (s.chapters && s.chapters.length > 0) {
          s.chapters = s.chapters.map(chapter => {
            const ch = { ...chapter };
            delete ch.chapterText;
            return ch;
          });
        }
      } else {
        s.locked = false;
      }
      
      // Add chapter count for all stories
      s.chapterCount = s.chapters ? s.chapters.length : 0;
      
      return s;
    });
    
    console.log(`${new Date().toISOString()} - Sending response with ${modifiedStories.length} stories`);
    res.json(modifiedStories);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving stories:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// Endpoint: Get All Distinct Tags
// ====================================================
app.get('/api/gettags', async (req, res) => {
  try {
    const tags = await Story.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving tags:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// Endpoint: Unlock a Story
// ====================================================
app.post('/api/unlockstory', async (req, res) => {
  const { storyId, password } = req.body;
  if (!storyId) {
    return res.status(400).json({ error: "Missing storyId" });
  }
  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    if (!story.password) {
      return res.status(400).json({ error: "Story is not password protected" });
    }
    const match = await bcrypt.compare(password || '', story.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    res.json(story);
  } catch (error) {
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
// NEW Endpoint: Get a Specific Chapter from a Story
// ====================================================
app.get('/api/getchapter', async (req, res) => {
  try {
    const { storyId, chapterNumber } = req.query;
    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId in query parameters." });
    }
    if (!chapterNumber) {
      return res.status(400).json({ error: "Missing chapterNumber in query parameters." });
    }
    
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    
    // Check if the story is password-protected
    if (story.password) {
      return res.status(401).json({ error: "This story is password protected. Please unlock it first." });
    }
    
    // Return the main story if chapterNumber is 0
    if (parseInt(chapterNumber) === 0) {
      return res.json({
        chapterTitle: story.storyTitle,
        chapterNumber: 0,
        chapterText: story.storyText,
        variables: story.variables,
        fillValues: story.fillValues,
        pronounGroups: story.pronounGroups,
        variableCounts: story.variableCounts,
        customPlaceholders: story.customPlaceholders,
        pronounGroupCount: story.pronounGroupCount
      });
    }
    
    // Find the chapter
    const chapter = story.chapters.find(ch => ch.chapterNumber === parseInt(chapterNumber));
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    
    res.json(chapter);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving chapter:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// NEW Endpoint: Delete a Chapter from a Story
// ====================================================
app.delete('/api/deletechapter', async (req, res) => {
  try {
    const { storyId, chapterNumber } = req.body;
    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId in request body." });
    }
    if (!chapterNumber) {
      return res.status(400).json({ error: "Missing chapterNumber in request body." });
    }
    
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    
    // Cannot delete chapter 0 (main story)
    if (parseInt(chapterNumber) === 0) {
      return res.status(400).json({ error: "Cannot delete the main story. Use /api/deletestory instead." });
    }
    
    // Find the chapter's index
    const chapterIndex = story.chapters.findIndex(ch => ch.chapterNumber === parseInt(chapterNumber));
    if (chapterIndex === -1) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    
    // Remove the chapter
    story.chapters.splice(chapterIndex, 1);
    
    // Update current chapter if needed
    if (story.currentChapter === parseInt(chapterNumber)) {
      story.currentChapter = story.chapters.length > 0 ? 
                            story.chapters[story.chapters.length - 1].chapterNumber : 
                            0;
    }
    
    await story.save();
    res.json({ success: true, story });
    
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error deleting chapter:`, error);
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
// NEW Endpoint: Get All Chapters for a Story
// ====================================================
app.get('/api/getchapters', async (req, res) => {
  try {
    const { storyId } = req.query;
    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId in query parameters." });
    }
    
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    
    // Check if the story is password-protected
    if (story.password) {
      return res.status(401).json({ error: "This story is password protected. Please unlock it first." });
    }
    
    // Create a combined response with the main story as chapter 0
    const mainStoryAsChapter = {
      chapterTitle: story.storyTitle,
      chapterNumber: 0,
      chapterText: story.storyText,
      variables: story.variables,
      fillValues: story.fillValues,
      pronounGroups: story.pronounGroups,
      variableCounts: story.variableCounts,
      customPlaceholders: story.customPlaceholders,
      pronounGroupCount: story.pronounGroupCount,
      savedAt: story.savedAt
    };
    
    // Combine main story with chapters, ensuring they're in order
    const allChapters = [mainStoryAsChapter, ...story.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    res.json({
      storyId: story._id,
      storyTitle: story.storyTitle,
      storyAuthor: story.storyAuthor,
      currentChapter: story.currentChapter,
      chapters: allChapters,
      tags: story.tags,
      rating: story.rating,
      ratingCount: story.ratingCount
    });
    
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error retrieving chapters:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====================================================
// Global Error-Handling Middleware
// ====================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(`${new Date().toISOString()} - Unhandled error:`, err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ====================================================
// Start the Server
// ====================================================
if (require.main === module) {
  connectToDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`${new Date().toISOString()} - Server is running on port ${PORT}`);
    });
  });
}

module.exports = { app, connectToDatabase };
