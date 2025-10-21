import mongoose from "mongoose";

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


const Report = mongoose.model("Report", ReportSchema);

export default Report;