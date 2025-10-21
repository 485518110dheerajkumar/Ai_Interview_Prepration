// src/pages/ProblemPage.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";   // ✅ unchanged
import Footer from "./Footer";   // ✅ unchanged
import { jwtDecode } from "jwt-decode"; // ✅ named import fixed

// Supported languages
const languages = [
  { id: "javascript", name: "JavaScript (Node.js)", monaco: "javascript" },
  { id: "python", name: "Python (3.8.1)", monaco: "python" },
  { id: "java", name: "Java (OpenJDK)", monaco: "java" },
  { id: "cpp", name: "C++ (GCC 9.2.0)", monaco: "cpp" },
];

function ProblemPage() {
  const { state: problem } = useLocation();
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [resultStatus, setResultStatus] = useState("");

  // ✅ Extract userId from JWT in localStorage
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id; // must match backend payload
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  if (!problem) {
    return <p className="p-6">No problem found!</p>;
  }

  // Run code
  const handleRun = async () => {
    if (!problem.sampleTests || problem.sampleTests.length === 0) {
      setOutput("No sample tests available");
      return;
    }

    const test = problem.sampleTests[0];
    setOutput("Running...");
    setResultStatus("");

    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          version: "*",
          files: [{ name: "main", content: code }],
          stdin: test.input,
        }
      );

      const got = (response.data.run.output || "").trim();
      const expected = (test.output || "").trim();

      const passed = got === expected;
      setResultStatus(passed ? "✅ Passed" : "❌ Failed");

      setOutput(
        `Input:\n${test.input}\n\nExpected Output:\n${expected}\n\nYour Output:\n${got}`
      );
    } catch (error) {
      console.error(error);
      setOutput("Error running code");
    }
  };

  // Submit code
  const handleSubmit = async () => {
    setOutput("Submitting...");
    let allCorrect = true;
    let resultsText = "";

    for (const [i, test] of problem.sampleTests.entries()) {
      try {
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: language,
            version: "*",
            files: [{ name: "main", content: code }],
            stdin: test.input,
          }
        );

        const got = (response.data.run.output || "").trim();
        const expected = (test.output || "").trim();

        if (got !== expected) allCorrect = false;

        resultsText += `Test Case ${i + 1}:\n`;
        resultsText += `Input:\n${test.input}\n`;
        resultsText += `Expected Output:\n${expected}\n`;
        resultsText += `Your Output:\n${got}\n`;
        resultsText += got === expected ? "✅ Passed\n\n" : "❌ Failed\n\n";
      } catch (error) {
        console.error(error);
        resultsText += `Test Case ${i + 1}: Error running code\n\n`;
        allCorrect = false;
      }
    }

    setResultStatus(allCorrect ? "✅ Accepted" : "❌ Wrong Answer");

    // ✅ Save attempt with userId from localStorage
    if (userId) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/attempts`, {
          userId, // dynamically from localStorage
          problemId: problem._id || problem.id,
          title: problem.title,
          status: allCorrect ? "Accepted" : "Wrong Answer",
          language: languages.find((l) => l.id === language)?.name,
          code,
        });
      } catch (err) {
        console.error("Error saving attempt:", err);
      }
    } else {
      console.warn("No userId found, attempt not saved.");
    }

    setOutput(resultsText);
  };

  return (
    <>
      <Navbar /> 
      <div className="flex h-[calc(100vh-4rem)] mt-4">
        {/* Left: Problem */}
        <div className="w-1/2 border-r p-6 overflow-y-auto bg-gray-50">
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <p
            className={`mb-4 font-semibold ${
              problem.difficulty === "Easy"
                ? "text-green-600"
                : problem.difficulty === "Medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {problem.difficulty}
          </p>
          <p className="text-gray-700 leading-relaxed">{problem.description}</p>

          <h2 className="mt-6 font-bold text-lg">Sample Test Cases:</h2>
          <div className="mt-2 space-y-3">
            {problem.sampleTests?.length > 0 ? (
              problem.sampleTests.map((test, idx) => (
                <div key={idx} className="p-3 bg-white border rounded-lg shadow-sm">
                  <p>
                    <strong>Input:</strong> <code>{test.input}</code>
                  </p>
                  <p>
                    <strong>Output:</strong> <code>{test.output}</code>
                  </p>
                </div>
              ))
            ) : (
              <p>No sample test cases available</p>
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="w-1/2 flex flex-col mb-4">
          <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
            <select
              className="p-2 border rounded bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="space-x-2">
              <button
                onClick={handleRun}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                ▶ Run
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🚀 Submit
              </button>
            </div>
          </div>

          <div className="flex-grow">
            <Editor
              height="100%"
              language={languages.find((l) => l.id === language)?.monaco || "javascript"}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value)}
            />
          </div>

          <div className="p-4 bg-gray-50 border-t h-56 overflow-y-auto">
            <h2 className="font-semibold mb-2">
              Result: <span>{resultStatus}</span>
            </h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      </div>
      <Footer /> 
    </>
  );
}

export default ProblemPage;
