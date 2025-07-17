const express = require('express');
const router = express.Router();

module.exports = function(db) {
  router.get('/verifyEmail', async (req, res) => {
    const token = req.query.token;

    try {
      const user = await db.collection('Users').findOne({ verificationToken: token });

      if (!user) {
        return res.status(400).send('Invalid verification token');
      }

      await db.collection('Users').updateOne(
        { _id: user._id },
        { $set: { isVerified: true }, $unset: { verificationToken: "" } }
      );

      // Redirect user to login page after successful verification
      res.redirect('http://143.198.160.127/login');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};