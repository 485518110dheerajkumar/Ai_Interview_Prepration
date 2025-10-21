import express from "express";
import QuizReport from "../models/QuizReport";

const router = express.Router();

// Save quiz report
router.post("/", async (req, res) => {
  try {
    const report = new QuizReport(req.body);
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reports (optional)
router.get("/", async (req, res) => {
  try {
    const reports = await QuizReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const reports = await QuizReport.find({ userId: req.params.userId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
