
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const attemptsRouter = require("./routes/attempts.js");
const quizReportsRouter = require("./routes/quizReports");
const nodemailer = require("nodemailer");
const interviewRouter = require("./routes/interviewReports.js");
const Contact = require("./models/Contact");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");



const app = express();


// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors()); // allow requests from React dev server (localhost:3000)
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/attempts", attemptsRouter);
app.use("/api/quiz-reports", quizReportsRouter);

app.use("/api/interview", interviewRouter);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

// mongodb connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  sampleTests: [
    {
      input: String,
      output: String,
    },
  ],
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


// ✅ Serve React build in production
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});



// contect form data send to mongodb

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(200).json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});




// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
