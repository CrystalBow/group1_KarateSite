const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { user, password } = req.body;

    const allowedFields = ['user', 'password'];
    const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
    if (extraFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
    }

    if (!user || !password || user.trim() === '' || password.trim() === '') {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Add these logs right BEFORE you query the DB:

    try {
      // Find user by username
      let results;
      try {
        results = await db.collection('Users').find({ user }).toArray();
      } catch (dbError) {
        console.error("Database query failed:", dbError);
        return res.status(500).json({ error: dbError.toString() });
      }

      if (results.length === 0) {
        return res.status(200).json({ id: -1, name: '', email: '', error: 'Invalid username or password' });
      }

      const userRecord = results[0];

      // Compare hashed password
      const match = await bcrypt.compare(password, userRecord.password);

      if (!match) {
        return res.status(200).json({ id: -1, name: '', email: '', error: 'Invalid username or password' });
      }

      // Check if email verified
      if (!userRecord.isVerified) {
        return res.status(200).json({
          id: -1,
          name: '',
          email: '',
          error: 'You must verify your email before logging in. Check your email to verify your account.'
        });
      }

      // Passwords match and email verified - return user data
      const id = userRecord.id;
      const username = userRecord.user;  // renamed to avoid conflict with input 'user'
      const name = userRecord.name;
      const email = userRecord.email;
      const previousLogin = userRecord.lastlogin || 0;
      const rank = userRecord.rank || 0;
      const streak = userRecord.streak || 0;
      const progressW = userRecord.progressW || 0;
      const progressY = userRecord.progressY || 0;
      const progressO = userRecord.progressO || 0;
      let error = '';

      try {
        // Update last login timestamp and streak
        const now = Date.now();

        await db.collection('Users').updateOne({ id }, { $set: { lastlogin: now } });

        if (previousLogin > 0) {
          const diff = now - previousLogin;

          if (diff > 86400000) {
            if (diff < 2 * 86400000) {
              // Increment streak by 1
              await db.collection('Users').updateOne({ id }, { $set: { streak: (userRecord.streak || 0) + 1 } });
            } else {
              // Reset streak
              await db.collection('Users').updateOne({ id }, { $set: { streak: 0 } });
            }
          }
        }
      } catch (updateError) {
        error = updateError.toString();
      }

      // Generate token
      try {
        const result = token.createToken(id, username, name, email, rank, streak, progressW, progressY, progressO);

        if (result.error) {
          return res.status(500).json({ error: 'Failed to generate token: ' + result.error });
        }

        // Include error: '' for test compatibility
        return res.status(200).json({
          accessToken: result.accessToken,
          id,
          user: username,
          name,
          email,
          rank,
          streak,
          progressW,
          progressY,
          progressO,
          error: ''
        });
      } catch (tokenErr) {
        return res.status(500).json({ error: 'Failed to generate token: ' + tokenErr.message });
      }
    } catch (err) {
      console.error("Login error caught:", err);
      return res.status(500).json({ error: err.toString() });
    }
  });

  return router;
};