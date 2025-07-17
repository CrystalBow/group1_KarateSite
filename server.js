require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// MongoDB setup
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
let db = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Connect to MongoDB and load all API routes
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db('KarateTracker');
    console.log('Connected to MongoDB');

    // Dynamically load all routes in APIs folder
    const routesDir = path.join(__dirname, 'APIs');
    fs.readdirSync(routesDir).forEach(file => {
      if (file.endsWith('.js')) {
        const route = require(path.join(routesDir, file));
        app.use('/api', route(db)); // Pass db to each route module
      }
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

connectToMongo();