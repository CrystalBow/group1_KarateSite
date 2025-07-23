const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(db) {
  router.post('/getPasswordInfo', async (req, res) => {
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

  return router;
};