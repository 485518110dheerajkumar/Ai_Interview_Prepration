import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function QuizReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("userId") || "guest-user";

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/quiz-reports/user/${userId}`)
      .then((res) => {
        const userQuiz = res.data.filter((attempt) => attempt.userId === userId);
        setReports(userQuiz);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quiz reports:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p className="p-6 text-center">Loading reports...</p>;
  }

  if (reports.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">No quiz reports found.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate overall accuracy
  const totalQuizzes = reports.length;
  const totalQuestions = reports.reduce((sum, r) => sum + r.totalQuestions, 0);
  const totalCorrect = reports.reduce((sum, r) => sum + r.correctAnswers, 0);
  const accuracy = ((totalCorrect / totalQuestions) * 100).toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">My Quiz Reports</h1>

        {/* Overall Stats */}
        <div className="p-4 mb-6 bg-gray-100 border rounded-lg shadow">
          <p><strong>Total Quizzes:</strong> {totalQuizzes}</p>
          <p><strong>Total Questions Attempted:</strong> {totalQuestions}</p>
          <p><strong>Total Correct Answers:</strong> {totalCorrect}</p>
          <p><strong>Overall Accuracy:</strong> {accuracy}%</p>
        </div>

        {/* Individual Reports */}
        <div className="space-y-6">
          {reports.map((report, idx) => (
            <div key={idx} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">
                Quiz ID: {report.quizId}
              </h2>
              <p>
                <strong>Score:</strong> {report.score} / {report.totalQuestions}{" "}
                ({((report.correctAnswers / report.totalQuestions) * 100).toFixed(2)}%)
              </p>
              <p>
                <strong>Correct:</strong> {report.correctAnswers} |{" "}
                <strong>Wrong:</strong> {report.wrongAnswers}
              </p>
              <p>
                <strong>Completed At:</strong>{" "}
                {new Date(report.completedAt).toLocaleString()}
              </p>

              {/* Answer Breakdown */}
              <details className="mt-3">
                <summary className="cursor-pointer text-blue-600 font-semibold">
                  View Answers
                </summary>
                <ul className="mt-2 space-y-2">
                  {report.answers.map((a, i) => (
                    <li
                      key={i}
                      className={`p-2 border rounded ${
                        a.isCorrect
                          ? "bg-green-100 border-green-400"
                          : "bg-red-100 border-red-400"
                      }`}
                    >
                      <p dangerouslySetInnerHTML={{ __html: `Q${i + 1}: ${a.question}` }} />
                      <p>
                        Your Answer:{" "}
                        <span
                          className={
                            a.isCorrect
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {a.selectedOption}
                        </span>
                      </p>
                      <p>Correct Answer: <strong>{a.correctOption}</strong></p>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default QuizReports;
