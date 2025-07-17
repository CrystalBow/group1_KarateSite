const express = require('express');
const router = express.Router();

module.exports = function(db) {
  router.post('/updateProgress', async (req, res) => {
    const { id, progressW, progressY, progressO } = req.body;

    let rank = 0;
    if (progressW >= 5) {
      rank = 1;
      if (progressY >= 3) {
        rank = 2;
      }
    }

    let error = '';
    try {
      await db.collection('Users').updateOne(
        { id: id },
        { $set: { rank: rank, progressW: progressW, progressY: progressY, progressO: progressO } }
      );
    } catch (err) {
      error = err.toString();
    }

    const ret = { rank: rank, progressW: progressW, progressY: progressY, progressO: progressO, error: error };
    res.status(200).json(ret);
  });

  return router;
};