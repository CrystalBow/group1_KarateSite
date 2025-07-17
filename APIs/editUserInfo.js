const express = require('express');
const crypto = require('crypto');
const mail = require('@sendgrid/mail');

const router = express.Router();

module.exports = function(db) {
  router.post('/editUserInfo', async (req, res) => {
    const { user, name, email, rank } = req.body;

    try {
      const userBeingEdited = await db.collection('Users').findOne({ user });

      if (!userBeingEdited) {
        return res.status(200).json({ message: "User was not found." });
      }

      const editInfo = {};

      // Edit name
      if (name) editInfo.name = name;

      // Edit email
      if (email) {
        editInfo.email = email;
        editInfo.isVerified = false;

        // User must register new email
        const newToken = crypto.randomBytes(32).toString('hex');
        editInfo.verificationToken = newToken;
        const verifyEmailLink = `http://143.198.160.127:5000/api/verifyEmail?token=${newToken}`;

        // Verification email
        const msg = {
          to: email,
          from: {
            email: 'karatetracker@gmail.com',
            name: 'Karate Trainer'
          },
          subject: 'Verify your Karate Trainer email',
          html: `Hello ${name}, click <a href="${verifyEmailLink}">here</a> to verify your email. Once verified, you will be redirected to the login page.`,
        };

        try {
          await mail.send(msg);
        } catch (emailError) {
          console.error("Unable to send verification email.");
        }
      }

      // Update Rank and progress
      if (rank >= 1) editInfo.progressW = 5;
      if (rank >= 2) editInfo.progressY = 3;

      await db.collection('Users').updateOne({ user }, { $set: editInfo });

      res.status(200).json({ message: "User information updated successfully." });

    } catch (error) {
      res.status(500).json({ error: "Unable to update user information." });
    }
  });

  return router;
};