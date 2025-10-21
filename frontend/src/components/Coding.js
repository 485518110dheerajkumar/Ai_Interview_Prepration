import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Coding() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedProblems, setSolvedProblems] = useState([]); // ✅ Track solved problems

  const navigate = useNavigate();
  const problemsPerPage = 10;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/problems`)
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((err) => console.error(err));

    // ✅ Fetch solved problems (you can replace this with API call)
    const solvedFromStorage = JSON.parse(localStorage.getItem("solvedProblems")) || [];
    setSolvedProblems(solvedFromStorage);
  }, []);

  // 🔍 Filter problems
  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (problem.topic &&
        problem.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 📄 Pagination logic
  const indexOfLast = currentPage * problemsPerPage;
  const indexOfFirst = indexOfLast - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  return (
  <>
  <Navbar />
    <div className="min-h-screen flex flex-col">
      <div className="p-6 max-w-5xl mx-auto flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">DSA Problems</h1>

        {/* 🔍 Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by problem name or topic..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* 📋 Problem List */}
        <div className="grid gap-4">
          {currentProblems.map((problem) => {
            const isSolved = solvedProblems.includes(problem._id); // ✅ Check if solved

            return (
              <div
                key={problem._id}
                onClick={() =>
                  navigate(`/coding/${problem._id}`, { state: problem })
                }
                className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer flex justify-between items-center bg-white"
              >
                <div>
                  <h2 className="text-xl font-semibold">{problem.title}</h2>
                  <p className="text-gray-600">{problem.topic}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Difficulty */}
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  {/* ✅ Solved Badge */}
                  {isSolved && (
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                      ✔ Solved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ⚡ Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      
    </div>
    <Footer />
    </>
  );
}

export default Coding;
