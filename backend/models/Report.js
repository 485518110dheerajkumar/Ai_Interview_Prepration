const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true }, // optional, or use userId if auth exists
  answers: [
    {
      question: String,
      answer: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);
