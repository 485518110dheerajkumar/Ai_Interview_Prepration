import mongoose from "mongoose";

// Individual question and answer schema
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// Interview schema
const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g., "Frontend Developer"
  resumeText: { type: String, default: "" },
  questions: [QuestionSchema],
  totalScore: { type: Number, default: 0 },
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
  interviewDuration: { type: Number, default: 0 }, // in seconds
  llmModel: { type: String, default: "GPT-5-mini" }, // track which LLM model was used
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before each save
InterviewSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});


const Interview = mongoose.model("Interview", InterviewSchema);

export default Interview;