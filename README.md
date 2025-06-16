# BlankBook

BlankBook is a Node.js/Express application for creating and sharing fill‑in‑the‑blank style stories. It stores stories in MongoDB and exposes a small REST API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with at least the following variables:

   ```bash
   MONGODB_URI=mongodb://localhost/blankbook
   ALLOWED_ORIGINS=http://localhost:3000
   # optional
   SALT_ROUNDS=10
   ```

3. Start the server:

   ```bash
   npm start
   ```

Set `DISABLE_DB=true` to skip connecting to MongoDB (useful for running tests).

## Development

Run the linter with:

```bash
npm run lint
```

## Running Tests

```bash
npm test
```

The test suite uses Jest and `mongodb-memory-server` to run against an in-memory MongoDB instance.
