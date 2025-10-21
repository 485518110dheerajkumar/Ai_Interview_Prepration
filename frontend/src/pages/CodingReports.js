import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CodingReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("userId") || "guest-user";

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/attempts?userId=${userId}`)
      .then((res) => {
        const userCoding = res.data.filter((attempt) => attempt.userId === userId);
        setReports(userCoding);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching coding reports:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p className="p-6 text-center">Loading coding reports...</p>;
  }

  if (reports.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">No coding reports found.</h2>
        </div>
        <Footer/>
      </div>
    );
  }

  const totalAttempts = reports.length;
  const accepted = reports.filter((r) => r.status === "Accepted").length;
  const accuracy = ((accepted / totalAttempts) * 100).toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">My Coding Reports</h1>

        {/* Overall Stats */}
        <div className="p-4 mb-6 bg-gray-100 border rounded-lg shadow">
          <p><strong>Total Attempts:</strong> {totalAttempts}</p>
          <p><strong>Accepted:</strong> {accepted}</p>
          <p><strong>Accuracy:</strong> {accuracy}%</p>
        </div>

        {/* Individual Attempts */}
        <div className="space-y-6">
          {reports.map((report, idx) => (
            <div key={idx} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">
                {report.title || "Untitled Problem"}
              </h2>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    report.status === "Accepted"
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {report.status}
                </span>
              </p>
              <p><strong>Language:</strong> {report.language}</p>
              <p><strong>Submitted At:</strong> {new Date(report.submittedAt).toLocaleString()}</p>

              {/* Expand to view code */}
              <details className="mt-3">
                <summary className="cursor-pointer text-blue-600 font-semibold">
                  View Code
                </summary>
                <pre className="bg-gray-100 p-3 mt-2 rounded text-sm text-left overflow-x-auto">
                  {report.code}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default CodingReports;
