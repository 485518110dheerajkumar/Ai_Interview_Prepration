import mongoose from "mongoose";

const quizReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },  
  quizId: { type: String, required: true },   
  score: { type: Number, required: true },   
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  answers: [
    {
      questionId: String,
      question: String,
      selectedOption: String,
      correctOption: String,
      isCorrect: Boolean,
    },
  ],
  completedAt: { type: Date, default: Date.now },
});

const QuizReport = mongoose.model("quizreports", quizReportSchema);


export default QuizReport;
