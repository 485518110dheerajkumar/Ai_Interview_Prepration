import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "./Footer";

// Define aptitude categories
const aptitudeCategories = [
  { name: "Numerical", apiCategory: 19, discription: "Arithmetic, algebra, percentages" },
  { name: "Logical", apiCategory: 18, discription: "Logic, puzzles, problem solving" },
  { name: "Verbal", apiCategory: 9, discription: "Grammar, vocabulary, comprehension" },
  { name: "Abstract", apiCategory: 17, discription: "Vocabulary & comprehension" },
];

function QuizPage() {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizEnded, setQuizEnded] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Fetch questions when category selected
  useEffect(() => {
    if (!category) return;

    fetch(`https://opentdb.com/api.php?amount=20&category=${category.apiCategory}&type=multiple`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const options = [...q.incorrect_answers, q.correct_answer];
          options.sort(() => Math.random() - 0.5);
          return { question: q.question, options, answer: q.correct_answer };
        });
        setQuestions(formatted);
        setCurrent(0);
        setScore(0);
        setSelected("");
        setTimer(30);
        setQuizEnded(false);
        setUserAnswers([]);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [category]);

  // ✅ Wrap handleNext in useCallback to fix dependency warning
  const handleNext = useCallback(() => {
    setUserAnswers((prev) => [
      ...prev,
      { question: questions[current].question, selected: selected, answer: questions[current].answer },
    ]);

    if (selected === questions[current].answer) setScore((prev) => prev + 1);

    setSelected("");
    setTimer(30);

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setQuizEnded(true);
    }
  }, [current, questions, selected]);

  // Timer per question
  useEffect(() => {
    if (quizEnded || !category) return;
    if (timer === 0) {
      handleNext();
      return;
    }
    const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, quizEnded, category, handleNext]); // ✅ added handleNext

  // Save report when quiz ends
  useEffect(() => {
    if (quizEnded && questions.length > 0) {
      const report = {
        userId: localStorage.getItem("userId") || "guest-user", // ✅ from localStorage
        quizId: `${category.name}-${Date.now()}`,
        score,
        totalQuestions: questions.length,
        correctAnswers: score,
        wrongAnswers: questions.length - score,
        answers: userAnswers.map((ans, i) => ({
          questionId: `q${i + 1}`,
          question: ans.question,
          selectedOption: ans.selected || "No Answer",
          correctOption: ans.answer,
          isCorrect: ans.selected === ans.answer,
        })),
      };

      axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quiz-reports`, report)
        .then(() => console.log("✅ Quiz report saved to MongoDB"))
        .catch((err) => console.error("❌ Error saving quiz report:", err));
    }
  }, [quizEnded, questions.length, score, userAnswers, category?.name]); // ✅ added missing deps

  if (!category) {
    return (
      <div>
        <Navbar />
        <div className="mt-5 p-2 w-full min-h-screen">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose an Aptitude Topic</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center text-center">
            {aptitudeCategories.map((cat) => (
              <div key={cat.name} className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer">
                <div className="w-14 h-14 mx-auto flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-2xl font-bold">A</div>
                <button onClick={() => setCategory(cat)} className="mt-4 text-lg font-semibold text-gray-700">{cat.name}</button>
                <p className="text-sm text-gray-500 mt-1">{cat.discription}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (quizEnded) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{category.name} Quiz Completed!</h1>
            <p className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Score: {score} / {questions.length}</p>
            <h2 className="text-2xl font-semibold mt-4 mb-2 text-center">Solutions</h2>
            <ul className="text-left space-y-2">
              {userAnswers.map((q, idx) => (
                <li key={idx} className="mb-6 p-4 border shadow-md rounded-lg">
                  <p className='font-medium text-gray-700' dangerouslySetInnerHTML={{ __html: `Q${idx + 1}: ${q.question}` }} />
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-gray-600">Your Answer:</span> 
                    <span className={q.selected === q.answer ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{q.selected || "No Answer"}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-gray-600">Correct Answer:</span> <span className="font-semibold">{q.answer}</span>
                  </p>
                </li>
              ))}
            </ul>
            <a href="/quiz">
            <button onClick={() => setCategory(null)} className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Choose Another Category
            </button>
            </a>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div>
      <Navbar />
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6" dangerouslySetInnerHTML={{ __html: `Q${current + 1}: ${q.question}` }} />
          <div className="grid grid-cols-2 gap-4 mb-6">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`px-4 py-3 rounded-lg border text-gray-700 font-medium transition-colors duration-200
                  ${selected === opt ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => setSelected(opt)}
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            ))}
          </div>
          <div className="flex justify-end items-center mb-6 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timer}s</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          </div>
          <div className="text-right text-gray-600 text-sm mb-6">{current + 1}/20</div>
          <div className="text-center">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition" onClick={handleNext} disabled={!selected}>
              {current === questions.length - 1 ? "Finish Quiz" : "Next"}
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default QuizPage;
