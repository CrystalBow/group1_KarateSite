const express = require("express");
const router = express.Router();
const token = require("../createJWT.js");

module.exports = function (db) {
  // Update progress endpoint at /api/updateProgress
  router.post("/updateProgress", async (req, res) => {
    const { id, progressW, progressY, progressO, jwtToken } = req.body;

    // Validate JWT token
    try {
      if (token.isExpired(jwtToken)) {
        return res.status(200).json({ error: "The JWT is no longer valid", jwtToken: "" });
      }
    } catch (e) {
      console.log(e.message);
      return res.status(200).json({ error: e.message, jwtToken: "" });
    }

    let rank = 0;
    if (progressW >= 6) // 0-6
    {
      rank = 1;
      if (progressY >= 3) // 0-3
      {
        rank = 2;
      }
    }

    try {
      let updateFields = { rank };

      if (progressW !== undefined) updateFields.progressW = progressW;
      if (progressY !== undefined) updateFields.progressY = progressY;
      if (progressO !== undefined) updateFields.progressO = progressO;

      await db.collection("Users").updateOne({ id }, { $set: updateFields });
    } catch (err) {
      console.error("DB update error:", err);
      return res.status(500).json({ error: "DB update error: " + err.toString(), jwtToken: "" });
    }

    // Refresh token
    let refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log("JWT refresh crash");
      return res.status(500).json({ error: "JWT refresh failed", jwtToken: "" });
    }

    let user;
    try {
      user = await db.collection("Users").findOne({ id });
      if (!user) {
        return res.status(404).json({ error: "User not found", jwtToken: "" });
      }
    } catch (err) {
      console.error("DB find error:", err);
      return res.status(500).json({ error: "DB find error: " + err.toString(), jwtToken: "" });
    }

    return res.status(200).json({
      rank,
      progressW: user.progressW,
      progressY: user.progressY,
      progressO: user.progressO,
      jwtToken: refreshedToken,
      error: "",
    });
  });

  // Get user progress endpoint at /api/getUserProgress
  router.post("/getUserProgress", async (req, res) => {
    const { id, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        return res.status(200).json({ error: "The JWT is no longer valid", jwtToken: "" });
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
        console.log("JWT refresh crash");
        return res.status(500).json({ error: "JWT refresh crash", jwtToken: "" });
      }

      return res.status(200).json({
        progressW: user.progressW || 0,
        progressY: user.progressY || 0,
        progressO: user.progressO || 0,
        jwtToken: refreshedToken,
        error: "",
      });
    } catch (err) {
      console.error("DB find error:", err);
      return res.status(500).json({ error: "Internal server error", jwtToken: "" });
    }
  });

  return router;
};