const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const user = await db.collection('Users').findOne({ passwordResetToken: token });
      if (!user) {
        return res.status(400).json({ error: 'Invalid password reset token' });
      }

      if (Date.now() > user.passwordRecoveryExpiresInOneHour) {
        return res.status(400).json({ error: 'Password reset token has expired' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await db.collection('Users').updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { passwordResetToken: "", passwordResetExpires: "" }
        }
      );

      return res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not reset password' });
    }
  });

  return router;
};