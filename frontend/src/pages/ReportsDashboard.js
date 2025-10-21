import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [quizReports, setQuizReports] = useState([]);
  const [codingReports, setCodingReports] = useState([]);
  const [interviewReports, setInterviewReports] = useState([]);
  const [expandedReports, setExpandedReports] = useState({}); // Tracks expanded reports

  // ✅ Use userId from localStorage
  const userId = localStorage.getItem("userId") || "guest-user";

  useEffect(() => {
    // Quiz reports
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/quiz-reports/user/${userId}`)
      .then((res) => {
        const userQuiz = res.data.filter((attempt) => attempt.userId === userId);
        setQuizReports(userQuiz)
      })
      .catch((err) => console.error("Quiz reports error:", err));

    // Coding reports
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/attempts`)
      .then((res) => {
        const userCoding = res.data.filter((attempt) => attempt.userId === userId);
        setCodingReports(userCoding)
  })
      .catch((err) => console.error("Coding reports error:", err));

    // Interview reports
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/interview-reports/reports/user/${userId}`)
      .then((res) => {
        const userInterview = res.data.filter((attempt) => attempt.userId === userId);
        setInterviewReports(userInterview)
  })
      .catch((err) => console.error("Interview reports error:", err));
  }, [userId]);

  const toggleReport = (id) => {
    setExpandedReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">My Reports Dashboard</h1>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {["quiz", "coding", "interview"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Reports
            </button>
          ))}
        </div>

        {/* Quiz Reports */}
        {activeTab === "quiz" && (
          <div>
            {quizReports.length === 0 ? (
              <p>No quiz reports yet.</p>
            ) : (
              quizReports.map((report) => {
                const isExpanded = expandedReports[report._id || report.completedAt];
                return (
                  <div key={report._id || report.completedAt} className="p-4 mb-4 border rounded bg-white shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p><strong>Score:</strong> {report.score}/{report.totalQuestions}</p>
                        <p><strong>Correct:</strong> {report.correctAnswers}</p>
                        <p><strong>Wrong:</strong> {report.wrongAnswers}</p>
                        <p><strong>Completed:</strong> {new Date(report.completedAt).toLocaleString()}</p>
                      </div>
                      {report.details && (
                        <button
                          onClick={() => toggleReport(report._id || report.completedAt)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      )}
                    </div>
                    {isExpanded && report.details && (
                      <div className="mt-3 bg-gray-50 p-3 rounded">
                        <pre className="text-sm">{JSON.stringify(report.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Coding Reports */}
        {activeTab === "coding" && (
          <div>
            {codingReports.length === 0 ? (
              <p>No coding attempts yet.</p>
            ) : (
              codingReports.map((attempt) => {
                const isExpanded = expandedReports[attempt._id || attempt.submittedAt];
                return (
                  <div key={attempt._id || attempt.submittedAt} className="p-4 mb-4 border rounded bg-white shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold">{attempt.title}</h2>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className={attempt.status === "Accepted" ? "text-green-600" : "text-red-600"}>
                            {attempt.status}
                          </span>
                        </p>
                        <p><strong>Language:</strong> {attempt.language}</p>
                        <p><strong>Submitted At:</strong> {new Date(attempt.submittedAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => toggleReport(attempt._id || attempt.submittedAt)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {isExpanded ? "Hide Code" : "View Code"}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 bg-gray-50 p-3 rounded">
                        <pre className="text-sm">{attempt.code}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Interview Reports */}
        {activeTab === "interview" && (
          <div>
            {interviewReports.length === 0 ? (
              <p>No interview reports yet.</p>
            ) : (
              interviewReports.map((report) => {
                const isExpanded = expandedReports[report._id];
                return (
                  <div key={report._id} className="p-4 mb-4 border rounded bg-white shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p><strong>Interview ID:</strong> {report._id}</p>
                        <p><strong>Total Score:</strong> {report.totalScore ?? "N/A"}</p>
                        <p><strong>Completed:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => toggleReport(report._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Questions & Feedback:</h3>
                        <ul className="list-disc ml-6 space-y-2">
                          {report.questions.map((q, qIdx) => (
                            <li key={qIdx} className="p-3 border rounded bg-gray-50">
                              <p><strong>Q{qIdx + 1}:</strong> {q.question}</p>
                              <p><strong>Your Answer:</strong> {q.answer || "No answer"}</p>
                              <p><strong>Feedback:</strong> {q.feedback || "N/A"}</p>
                              <p>
                                <strong>Score:</strong>{" "}
                                <span className="font-semibold text-blue-600">{q.score ?? "N/A"} / 10</span>
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default ReportsDashboard;
