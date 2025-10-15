const express = require('express');
const router = express.Router();
const token = require('../createJWT.js');

module.exports = function(db) {
  router.post('/', async (req, res) => {
    const { user, jwtToken } = req.body;
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
    // Delete User from database
    try {
      const deleteResult = await db.collection('Users').deleteOne({ user });
      
      if (deleteResult.deletedCount === 0) {
        return res.status(200).json({ message: "User not found." });
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
      return res.status(200).json({
        message: "User has been deleted.",
        jwtToken: refreshedToken || '',
        error: ''
      });
    } catch (error) {
      res.status(500).json({ error: "Could not delete user" });
    }
  });

  return router;
};