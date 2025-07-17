const express = require('express');
const router = express.Router();

module.exports = function(db) {
  router.post('/searchKata', async (req, res) => {
    const { search } = req.body;

    try {
      const results = await db.collection('Kata').find({
        Name: { $regex: search, $options: "i" }
      }).toArray();

      return res.status(200).json(results); // Always return an array
    } catch (error) {
      console.error('Error searching Kata:', error);
      return res.status(500).json({ error: 'Unable to search Kata' });
    }
  });

  return router;
};