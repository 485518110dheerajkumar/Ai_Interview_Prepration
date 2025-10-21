import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InterviewPage from "./components/InterviewPage";
import Quiz from "./components/Quiz";
import Coding from "./components/Coding";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProblemPage from "./components/ProblemPage";
import QuizReports from "./pages/QuizReports";
import CodingReports from "./pages/CodingReports";
import ReportsDashboard from "../src/pages/ReportsDashboard";
import Landpage from "./pages/Landpage";
import Contact from "./pages/Contact";
import Aboutus from "./pages/Aboutus";
import Features from "./pages/Features";
import Practice from "./pages/Practice";

import Userprofile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/practice" element={<Practice />} />
        
        <Route path="/features" element={<Features />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/quiz-reports" element={<QuizReports />} />
        <Route path="/coding-reports" element={<CodingReports />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/coding" element={<Coding />}/>
        <Route path="/userprofile" element={<Userprofile />}/>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/coding/:id" element={<ProblemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
