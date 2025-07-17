const express = require('express');
const router = express.Router();

module.exports = function(db) {
  router.post('/deleteUser', async (req, res) => {
    const { user } = req.body;

    try {
      const deleteResult = await db.collection('Users').deleteOne({ user });
      
      if (deleteResult.deletedCount === 0) {
        return res.status(200).json({ message: "User not found." });
      }
      
      res.status(200).json({ message: "User has been successfully deleted." });
    } catch (error) {
      res.status(500).json({ error: "Could not delete user" });
    }
  });

  return router;
};