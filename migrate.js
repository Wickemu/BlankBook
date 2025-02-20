import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const Story = mongoose.model('Story', new mongoose.Schema({
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
}));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const filePath = path.join(__dirname, 'stories.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const stories = JSON.parse(data);

        for (const story of stories) {
            try {
                // Optionally sanitize or adjust the story data as needed.
                await Story.findOneAndUpdate(
                    { storyTitle: story.storyTitle },
                    story,
                    { upsert: true, new: true, runValidators: true }
                );
                console.log(`Inserted/Updated story: ${story.storyTitle}`);
            } catch (err) {
                console.error(`Error processing story ${story.storyTitle}:`, err);
            }
        }
        mongoose.disconnect();
    })
    .catch(err => console.error('Database connection error:', err));