import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config(); // optional for local dev only

import authRoutes from "./routes/auth.js";
import attemptsRouter from "./routes/attempts.js";
import quizReportsRouter from "./routes/quizReports.js";
import interviewRouter from "./routes/interviewReports.js";
import userRoutes from "./routes/user.js";
import Contact from "./models/Contact.js";

//  Create express app
const app = express();

//  Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//  API Routes
app.use("/api/auth", authRoutes);
app.use("/api/attempts", attemptsRouter);
app.use("/api/quiz-reports", quizReportsRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/users", userRoutes);

//  MongoDB connection
const uri = process.env.MONGODB_URI; // Render env variable
if (!uri) {
  console.error("❌ MONGODB_URI is not set. Set it in Render Dashboard!");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

//  Problem model & route
const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  sampleTests: [{ input: String, output: String }],
});
const Problem = mongoose.model("codingproblems", problemSchema);

app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Contact form route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//  Serve React build
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

//  Start server on Render port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
