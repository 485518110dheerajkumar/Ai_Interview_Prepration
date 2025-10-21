// backend/routes/attempts.js
const express = require("express");
const Attempt = require("../models/CodingAttempt");

const router = express.Router();

// Save an attempt
router.post("/", async (req, res) => {
  try {
    const attempt = new Attempt(req.body);
    await attempt.save();
    res.json({ success: true, attempt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all attempts
router.get("/", async (req, res) => {
  try {
    const attempts = await Attempt.find();
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
