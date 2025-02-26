// Script to check MongoDB for stories
require('dotenv').config(); // Load configuration from .env
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blankbook';
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Define the Story Schema & Model
  const storySchema = new mongoose.Schema({
    storyTitle: { type: String, required: true },
    storyAuthor: { type: String, required: true },
    storyText: { type: String, required: true },
    variables: Array,
    fillValues: Object,
    pronounGroups: Object,
    variableCounts: Object,
    customPlaceholders: Array,
    pronounGroupCount: Number,
    tags: [String],
    rating: Number,
    ratingCount: Number,
    savedAt: Date,
    password: String
  });

  const Story = mongoose.model('Story', storySchema);
  
  // Count stories in the collection
  return Story.countDocuments()
    .then(count => {
      console.log(`Number of stories in database: ${count}`);
      
      if (count > 0) {
        // If there are stories, retrieve them
        return Story.find().select('storyTitle storyAuthor savedAt').lean()
          .then(stories => {
            console.log('Story list:');
            stories.forEach(story => {
              console.log(`${story.storyTitle} by ${story.storyAuthor} (saved at ${story.savedAt})`);
            });
          });
      }
    });
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
})
.finally(() => {
  // Close the connection after a delay to ensure all operations complete
  setTimeout(() => {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }, 1000);
}); 