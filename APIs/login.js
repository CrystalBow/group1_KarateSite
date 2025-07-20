const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { user, password } = req.body;

    try {
      // Find user by username
      const results = await db.collection('Users').find({ user }).toArray();

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
      // const user = userRecord.user;
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
        // Update last login timestamp
        await db.collection('Users').updateOne({ id: id }, { $set: { lastlogin: Date.now() } });  

        // Update streak logic
        if (previousLogin > 0) {
          const now = Date.now();
          if (now - previousLogin > 86400000) {
            if (now - previousLogin < 2 * 86400000) {
              await db.collection('Users').updateOne({ id: id }, { $set: { streak: (userRecord.streak || 0) + 1 } });
            } else {
              await db.collection('Users').updateOne({ id: id }, { $set: { streak: 0 } });
            }
          }
        }
      } catch (updateError) {
        error = updateError.toString();
      }
      // Generate token
      try 
      {
        const result = token.createToken(id, user, name, email, rank, streak, progressW, progressY, progressO);

        if (result.error) 
          {
          return res.status(500).json({ error: 'Failed to generate token: ' + result.error });
        }

        return res.status(200).json({accessToken: result.accessToken, id, user, name, email, rank, streak, progressW, progressY, progressO});
      } 
      catch (tokenErr) 
      {
        return res.status(500).json({ error: 'Failed to generate token: ' + tokenErr.message });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};