import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Correct `__dirname` handling for Windows
const __dirname = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:\/)/, '$1'));

// Define the Story schema/model
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
  tags: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  savedAt: { type: Date, default: Date.now }
});
const Story = mongoose.model('Story', storySchema);

async function migrateStories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Read and parse the JSON file
    const filePath = path.resolve(__dirname, 'stories.json');
    console.log("Using file path:", filePath); // Debugging: Check correct path

    const data = fs.readFileSync(filePath, 'utf8');
    const stories = JSON.parse(data);

    // Use a for–of loop so that each async update completes before disconnecting
    for (const story of stories) {
      await Story.findOneAndUpdate(
        { storyTitle: story.storyTitle },
        story,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Inserted/Updated story: ${story.storyTitle}`);
    }
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateStories();
