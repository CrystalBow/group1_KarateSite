const express = require('express');
const router = express.Router();
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/updateProgress', async (req, res) => {
    const { id, progressW, progressY, progressO, jwtToken } = req.body;

    // Test validity of token
    try
    {
      if (token.isExpired(jwtToken))
      {
        var r = {error:'The JWT is no longer valid', jwtToken:''}
        res.status(200).json(r);
        return;
      }
    }
    catch(e)
    {
      console.log(e.message);
      var r = {error:e.message,jwtToken:''};
      res.status(200).json(r);
      return;
    }

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
     // Refresh and return the token
    var refreshedToken = null;
    try
    {
      refreshedToken = token.refresh(jwtToken);
    }
    catch(e)
    {
      console.log(e.message);
    }
    const ret = {rank: rank,progressW: progressW, progressY: progressY, progressO: progressO, jwtToken: refreshedToken, error: error};
    res.status(200).json(ret);
  });

  return router;
};