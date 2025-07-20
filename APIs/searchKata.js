const express = require('express');
const router = express.Router();
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { search, jwtToken } = req.body;
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
    
    try {
      const results = await db.collection('Kata').find({
        Name: { $regex: search, $options: "i" }
      }).toArray();

      // Refresh and return token with results
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }
      
      return res.status(200).json({results, jwtToken: refreshedToken});
      //return res.status(200).json(results); // Always return an array
    } catch (error) {
      console.error('Error searching Kata:', error);
      return res.status(500).json({ error: 'Unable to search Kata' });
    }
  });

  return router;
};