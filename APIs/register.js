const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('@sendgrid/mail');
mail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(db) {
  router.post('/register', async (req, res) => {
    const { user, password, name, email, rank } = req.body;

    try {
      // Check if user already exists
      const existingUsers = await db.collection('Users').find({ user }).toArray();
      if (existingUsers.length > 0) {
        return res.status(200).json({ error: "User already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user object
      const newUser = {
        user,
        password: hashedPassword,
        name,
        email,
        id: Date.now(), // Simplified ID generation, removed serverNum + Date.now()
        rank,
        streak: 0,
        lastlogin: -1,
        isVerified: false,
        progressW: 0,
        progressY: 0,
        progressO: 0,
      };

      if (rank >= 1) newUser.progressW = 5;
      if (rank >= 2) newUser.progressY = 3;

      // Create email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      newUser.verificationToken = verificationToken;

      // Insert new user
      await db.collection('Users').insertOne(newUser);

      // Send verification email
      const verifyEmailLink = `http://143.198.160.127:5000/api/verifyEmail?token=${verificationToken}`;

      const msg = {
        to: email,
        from: {
          email: 'karatetracker@gmail.com',
          name: 'Karate Trainer',
        },
        subject: 'Verify your Karate Trainer email',
        html: `Hello ${newUser.name}, click <a href="${verifyEmailLink}">here</a> to verify your email. Once verified, you will be redirected to the login page.`,
      };

      try {
        await mail.send(msg);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      return res.status(200).json({ error: '' });

    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  });

  return router;
};