const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mail = require('@sendgrid/mail');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
      const user = await db.collection('Users').findOne({ email });

      if (!user) {
        // Send a generic success message even if user doesn't exist, for security
        return res.status(200).json({ 
          message: "We've sent a password reset link to the registered email of this account. Please check your spam folder if you do not see the link in your inbox."
        });
      }

      // Generate password reset token and expiry
      const passwordResetToken = crypto.randomBytes(32).toString('hex');
      const passwordRecoveryExpiresInOneHour = Date.now() + 3600000; // 1 hour from now

      await db.collection('Users').updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetToken,
            passwordRecoveryExpiresInOneHour
          }
        }
      );

      // Create recovery email
      const passwordRecoveryLink = `http://karatemanager.xyz/reset-password?token=${passwordResetToken}`;
      const passwordRecoveryMsg = {
        to: email,
        from: {
          email: 'karatetracker@gmail.com',
          name: 'Karate Trainer'
        },
        subject: 'Reset your Karate Trainer password',
        html: `Hello, ${user.name}, click <a href="${passwordRecoveryLink}">here</a> to reset your password.`,
      };

      try {
        await mail.send(passwordRecoveryMsg);
        console.log('Password reset email sent successfully');
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
      }

      return res.status(200).json({ 
        message: "We've sent a password reset link to the registered email of this account. Please check your spam folder if you do not see the link in your inbox."
      });

    } catch (error) {
      console.error('General error in password reset:', error);
      return res.status(500).json({ error: "Could not process password reset request" });
    }
  });

  return router;
};