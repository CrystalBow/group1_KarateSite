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

  // Mount each API with the shared `db`
  app.use('/api/login', require('./APIs/login')(db));
  app.use('/api/register', require('./APIs/register')(db));
  app.use('/api/resetPassword', require('./APIs/resetPassword')(db));
  app.use('/api/verifyEmail', require('./APIs/verifyEmail')(db));
  app.use('/api/requestPasswordReset', require('./APIs/requestPasswordReset')(db));
  app.use('/api/updateProgress', require('./APIs/updateProgress')(db));
  app.use('/api/deleteUser', require('./APIs/deleteUser')(db));
  app.use('/api/editUserInfo', require('./APIs/editUserInfo')(db));
  app.use('/api/searchKata', require('./APIs/searchKata')(db));
  app.use('/api/getPasswordInfo', require('./APIs/getPasswordInfo')(db));

  // Return both app and client so tests can shut down the DB connection
  return { app, client, db };
}

module.exports = createTestServer;