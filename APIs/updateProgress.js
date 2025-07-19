const express = require("express");
const router = express.Router();
const token = require("../createJWT.js");

module.exports = function (db) {
  router.post("/updateProgress", async (req, res) => {
    const { id, progressW, progressY, progressO, jwtToken } = req.body;

    // Test validity of token
    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: "The JWT is no longer valid", jwtToken: "" };
        res.status(200).json(r);
        return;
      }
    } catch (e) {
      console.log(e.message);
      var r = { error: e.message, jwtToken: "" };
      res.status(200).json(r);
      return;
    }

    let rank = 0;
    if (progressW >= 6) {
      rank = 1;
      if (progressY >= 4) {
        rank = 2;
      }
    }

    let error = "";
    try {
      let updateFields = { rank: rank };

      if (progressW !== undefined) updateFields.progressW = progressW;
      if (progressY !== undefined) updateFields.progressY = progressY;
      if (progressO !== undefined) updateFields.progressO = progressO;

      await db
        .collection("Users")
        .updateOne({ id: id }, { $set: updateFields } );
    } catch (err) {
      error = err.toString();
    }
    // Refresh and return the token
    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log(e.message);
    }
    const user = await db.collection("Users").findOne({ id });

    const ret = {
      rank,
      progressW: user.progressW,
      progressY: user.progressY,
      progressO: user.progressO,
      jwtToken: refreshedToken,
      error,
    };
    res.status(200).json(ret);
  });

  router.post("/getUserProgress", async (req, res) => {
    const { id, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        return res
          .status(200)
          .json({ error: "The JWT is no longer valid", jwtToken: "" });
      }
    } catch (e) {
      return res.status(200).json({ error: e.message, jwtToken: "" });
    }

    try {
      const user = await db.collection("Users").findOne({ id });

      if (!user) {
        return res.status(404).json({ error: "User not found", jwtToken: "" });
      }

      let refreshedToken = null;
      try {
        refreshedToken = token.refresh(jwtToken);
      } catch (e) {
        console.log(e.message);
      }

      return res.status(200).json({
        progressW: user.progressW || 1,
        progressY: user.progressY || 1,
        progressO: user.progressO || 1,
        jwtToken: refreshedToken,
        error: "",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Internal server error", jwtToken: "" });
    }
  });

  return router;
};
