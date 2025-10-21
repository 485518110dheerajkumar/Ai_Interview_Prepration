import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [quizReports, setQuizReports] = useState([]);
  const [codingReports, setCodingReports] = useState([]);
  const [interviewReports, setInterviewReports] = useState([]);
  const navigate = useNavigate();

  // ✅ Get userId from JWT stored in localStorage
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      userId = decoded.id; // user id stored in JWT
    } catch (err) {
      console.error("Invalid token", err);
      userId = null;
    }
  }

  useEffect(() => {
    if (!userId) return; // no user, skip fetching

    // ✅ Fetch only reports belonging to the logged-in user
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/quiz-reports/user/${userId}`)
      .then((res) => {
        // ✅ Filter only attempts where userId matches localStorage
        const userAttempts = res.data.filter((attempt) => attempt.userId === userId);
        setQuizReports(userAttempts);
      })
      .catch((err) => console.error("Quiz reports error:", err));

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/attempts?userId=${userId}`)
      .then((res) => {
        // ✅ Filter only attempts where userId matches localStorage
        const userAttempts = res.data.filter((attempt) => attempt.userId === userId);
        setCodingReports(userAttempts);
      })
      .catch((err) => console.error("Coding reports error:", err));

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/interview-reports/user/${userId}`)
      .then((res) => {
        // ✅ Filter only attempts where userId matches localStorage
        const userInterview = res.data.filter((attempt) => attempt.userId === userId);
        setInterviewReports(userInterview);
      })
      .catch((err) => console.error("Interview reports error:", err));
  }, [userId]);

  // Calculate accuracies
  const calculateQuizAccuracy = () => {
    if (quizReports.length === 0) return 0;
    const totalCorrect = quizReports.reduce((acc, r) => acc + r.correctAnswers, 0);
    const totalQuestions = quizReports.reduce((acc, r) => acc + r.totalQuestions, 0);
    return totalQuestions ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : 0;
  };

  const calculateCodingAccuracy = () => {
    if (codingReports.length === 0) return 0;
    const totalSolved = codingReports.filter((c) => c.status === "Accepted").length;
    return ((totalSolved / codingReports.length) * 100).toFixed(2);
  };

  const calculateInterviewAccuracy = () => {
    if (interviewReports.length === 0) return 0;
    const totalScore = interviewReports.reduce((acc, r) => acc + (r.score || 0), 0);
    const maxScore = interviewReports.length * 100; // assuming each interview max score = 100
    return maxScore ? ((totalScore / maxScore) * 100).toFixed(2) : 0;
  };

  const accuracyData = [
    { type: "Quiz", value: calculateQuizAccuracy(), color: "#3B82F6" },
    { type: "Coding", value: calculateCodingAccuracy(), color: "#10B981" },
    { type: "Interview", value: calculateInterviewAccuracy(), color: "#8B5CF6" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
     
    navigate("/login");
  };
  const combinedReports = [
    ...quizReports.map((r) => ({ type: "Quiz", date: new Date(r.completedAt), content: r })),
    ...codingReports.map((c) => ({ type: "Coding", date: new Date(c.submittedAt), content: c })),
    ...interviewReports.map((i) => ({ type: "Interview", date: new Date(i.completedAt), content: i })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-blue-600">Prepbot</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="/userprofile" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">🏠 Profile</a>
            <a href="/practice" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">📝 Practice</a>
            <a href="/reports" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">📊 Reports</a>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >Logout</button>
            
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back 👋</h2>

          {/* Circular Accuracy Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {accuracyData.map((acc, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">{acc.type} Accuracy</h3>
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={acc.value}
                    text={`${acc.value}%`}
                    styles={buildStyles({
                      pathColor: acc.color,
                      textColor: acc.color,
                      trailColor: "#E5E7EB",
                      textSize: "16px",
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="bg-white p-6 rounded-xl shadow ">
              <ul className="space-y-3 text-gray-600 text-sm">
                {combinedReports.length === 0 ? (
                  <li>No recent activity.</li>
                ) : (
                  combinedReports.map((r, idx) => (
                    <li key={idx}>
                      {r.type === "Quiz" && `✅ Quiz – Score: ${r.content.score}/${r.content.totalQuestions}`}
                      {r.type === "Coding" && ` ${r.content.status === "Accepted" ? "✅" : "❌"} Coding – ${r.content.title} (${r.content.status})`}
                      {r.type === "Interview" && `✅ Interview – Score: ${r.content.score ?? "N/A"}`}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Quick Start Buttons */}
          <div className="flex flex-wrap gap-5 mb-10 mt-8">
            <a href="/interview">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
                🚀 Start Interview
              </button>
            </a>
            <a href="/quiz">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition">
                🚀 Start Quiz
              </button>
            </a>
            <a href="/coding">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition">
                🚀 Start Coding
              </button>
            </a>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
