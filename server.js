require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');  // Added bcrypt for password hashing
const url = process.env.MONGODB_URI; 
const client = new MongoClient(url);
let db = null;
const mail = require('@sendgrid/mail'); // email verification
mail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require('crypto'); // email token
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
  var rank = 0;
  var progressW = 0;
  var progressY = 0;
  var progressO = 0;

  if(results.length > 0)
  {
    const userRecord = results[0];

    // Compare hashed password using bcrypt
    const match = await bcrypt.compare(password, userRecord.password);
    
    if (!match) 
    {
      // Passwords don't match
      error = 'Invalid username or password';
    }
    else
    {
      // Return error if no verified email
      if (userRecord.isVerified == false)
      {
        return res.status(200).json({
        id: -1,
        name: '',
        email: '',
        error: "You must verify your email before logging in. Check your email to verify your account."
      });
      }
      // Passwords match - proceed
      id = userRecord.id;
      name = userRecord.name;
      email = userRecord.email;
      previousLogin = userRecord.lastlogin;
      rank = userRecord.rank;
      progressW = userRecord.progressW;
      progressY = userRecord.progressY;
      progressO = userRecord.progressO;

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
    error = 'Invalid username or password';
  }

  var ret = { name: name, email: email, id:id ,rank: rank, progressW: progressW, progressO: progressO, progressY: progressY, error: error};
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  // incoming: login, password, firstName, lastName
  // outgoing: error

  const { user, password, name, email, rank} = req.body;

  // Hash the password before saving
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newUser = {
    user: user,
    password: hashedPassword,  // store hashed password instead of plain text
    name: name, 
    email: email,
    id: serverNum + (new Date()).getTime(),
    rank: rank,
    streak: 0, 
    lastlogin: -1,
    isVerified: false,
    progressW: 0,
    progressY: 0,
    progressO: 0
  };

  // Create Email Verification Token for new user
  const verificationToken = crypto.randomBytes(32).toString('hex');
  newUser.verificationToken = verificationToken;

  serverNum++;
  var error = '';

  try
  {
    const results = await db.collection('Users').find({"user":user}).toArray();
    if (results.length > 0) 
    {
      throw new Error("User already exists");
    }
    if (newUser.rank >= 1) {
      newUser.progressW = 5;
    }
    if (newUser.rank >= 2) {
      newUser.progressY = 3;
    }

    const result = db.collection('Users').insertOne(newUser);

    // Send verification email
    const verifyEmailLink = `http://143.198.160.127:5000/api/verifyEmail?token=${verificationToken}`;

    // Email template
    const msg =
    {
      to: email,
      from:
      {
        email: 'karatetracker@gmail.com',
        name: 'Karate Trainer'
      }, 
      subject: 'Verify your Karate Trainer email',
      html: `Hello ${newUser.name}, click <a href="${verifyEmailLink}">here</a> to verify your email. Once verified, you will be redirected to the login page.`, // Verification link
    }
    try {
      await mail.send(msg);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }
  }
  catch(e) // Add type annotation for 'e'
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

// TEMPORARY DEBUG ROUTE - View unhashed + hashed password*
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

// Email verification api
app.get('/api/verifyEmail', async (req, res) => {
  
  const token = req.query.token; // read token

  try {
    const user = await db.collection('Users').findOne({ verificationToken: token }); // check for matching token

    if (!user) {
      return res.status(400).send('Invalid verification token');
    }
    // Update user to verified
    await db.collection('Users').updateOne(
      { _id: user._id },
      { $set: { isVerified: true }, $unset: { verificationToken: '' } } 
    );
    res.redirect('http://143.198.160.127/login'); // Redirect user to login page

  } catch (err) {
    console.error(err);
    res.status(500).json('');
  }
});

app.post('/api/updateProgress', async (req, res) => {
  const { id, progressW, progressY, progressO } = req.body;
  let rank = 0;
  if (progressW >= 5) {
    rank = 1;
    if (progressY >= 3) {
      rank = 2;
    }
  }
  let error = '';
  try {
    await db.collection('Users').updateOne({id: id}, {$set: {rank:rank, progressW: progressW, progressY: progressY, progressO: progressO }});
  } catch (err) {
    error = err.toString();
  }
  var ret = { rank:rank, progressW: progressW, progressY: progressY, progressO: progressO, error: error};
  res.status(200).json(ret);
});

app.listen(5000); // start Node + Express server on port 5001

