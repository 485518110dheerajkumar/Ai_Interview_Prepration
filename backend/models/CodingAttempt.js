// backend/models/CodingAttempt.js
import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
   userId: { type: String, required: true }, 
  problemId: { type: String, required: true },
  title: String,
  status: { type: String, enum: ["Accepted", "Wrong Answer"], required: true },
  language: String,
  code: String,
  submittedAt: { type: Date, default: Date.now },
});

const Attempt = mongoose.model("codingattempts", attemptSchema);

export default Attempt;
