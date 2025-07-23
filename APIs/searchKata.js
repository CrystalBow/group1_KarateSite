const express = require('express');
const router = express.Router();
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { search, jwtToken } = req.body;


    try {
      if (token.isExpired(jwtToken)) {
        return res.status(200).json({ error: 'The JWT is no longer valid', jwtToken: '' });
      }
    } catch (e) {
      console.log(e.message);
      return res.status(200).json({ error: e.message, jwtToken: '' });
    }

 
    const query = search && search.trim() !== ""
      ? { Name: { $regex: search, $options: "i" } }
      : {}; 

    try {
      const results = await db.collection('Kata').find(query).toArray();

  
      let refreshedToken = jwtToken;
      try {
        refreshedToken = token.refresh(jwtToken);
      } catch (e) {
        console.log(e.message);
      }

      return res.status(200).json({ results, jwtToken: refreshedToken });
    } catch (error) {
      console.error('Error searching Kata:', error);
      return res.status(500).json({ error: 'Unable to search Kata' });
    }
  });

  return router;
};
