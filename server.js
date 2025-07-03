require('dotenv').config();
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');  // Added bcrypt for password hashing
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
let db = null;
async function connectToMongo() {
  try 
  {
    await client.connect();
    db = client.db('KarateTracker');
    console.log('Connected to MongoDB');
  } 
  catch (error) 
  {
    console.error('MongoDB connection error:', error);
    // Exit the process if unable to connect to MongoDB
    process.exit(1); // <-- THIS IS THE KEY!
  }
}

connectToMongo(); // This function is called immediately

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

serverNum = 0;

app.post('/api/login', async (req, res, next) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  var error = '';
  const {user, password} = req.body;

  // Find user by username
  const results = await db.collection('Users').find({user:user}).toArray(); // * Removed password from query *
  var id = -1;
  var name = '';
  var email = '';
  var previousLogin = 0;

  if(results.length > 0)
  {
    const userRecord = results[0];

    // Compare hashed password using bcrypt
    const match = await bcrypt.compare(password, userRecord.password);

    if (!match) 
    {
      // Passwords don't match
      error = 'Invalid username or password (2)';
    }
    else
    {
      // Passwords match - proceed
      id = userRecord.id;
      name = userRecord.name;
      email = userRecord.email;
      previousLogin = userRecord.lastlogin;

      try 
      {
        await db.collection('Users').updateOne({id:id},{$set: {lastlogin:(new Date()).getTime()}})

        if (previousLogin >= 0) 
        {
          if ((new Date()).getTime() - previousLogin > 86400000) 
          {
            if ((new Date()).getTime() - previousLogin < 86400000*2) 
            {
              await db.collection('Users').updateOne({id:id},{$set: {streak: results[0].streak + 1}});
            } 
            else 
            {
              await db.collection('Users').updateOne({id:id},{$set: {streak: 0}});
            }
          }
        }
      } 
      catch (e) 
      {
        error = e.toString();
      }
    }
  }
  else 
  {
    error = 'Invalid username or password (1)';
  }

  var ret = { name: name, email: email, id:id , error: error};
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  // incoming: login, password, firstName, lastName
  // outgoing: error

  const { user, password, name, email} = req.body;

  // Hash the password before saving
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newUser = {
    user: user,
    password: hashedPassword,  // store hashed password instead of plain text
    name: name, 
    email: email,
    id: serverNum + (new Date()).getTime(),
    rank: 0, 
    streak: 0, 
    lastlogin: -1
  };

  serverNum++;
  var error = '';

  try
  {
    const results = await db.collection('Users').find({"user":user}).toArray();

    if (results.length > 0) 
    {
      throw new Error("User already exists");
    }

    const result = db.collection('Users').insertOne(newUser);
  }
  catch(e) // Add type annotation for 'e'
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

// TEMPORARY DEBUG ROUTE - View unhashed + hashed password
/*
app.post('/api/debug/getPasswordInfo', async (req, res) => {
  const { user, password } = req.body;

  try {
    const userDoc = await db.collection('Users').findOne({ user });

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedHash = userDoc.password;
    const isMatch = await bcrypt.compare(password, storedHash);

    res.json({
      user: userDoc.user,
      unhashedPassword: password,
      storedHashedPassword: storedHash,
      matchResult: isMatch
    });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});
*/


app.listen(5000); // start Node + Express server on port 5001

