const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createTestServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('KarateTracker');

  app.locals.db = db;
  app.locals.client = client;

  // Mount API route handlers for testing
  app.use('/api/login', require('./APIs/login')(db));
  app.use('/api/register', require('./APIs/register')(db));
  app.use('/api', require('./APIs/updateProgress')(db));

  // Return app, client, and db so tests can control lifecycle and access DB
  return { app, client, db };
}

module.exports = createTestServer;