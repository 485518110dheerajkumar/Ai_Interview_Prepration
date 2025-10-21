import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", });

const speak = (text, onEnd) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onEnd;
    speechSynthesis.speak(utterance);
  } else {
    if (onEnd) onEnd();
  }
};

const useSpeechRecognition = ({ onResult, onError }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      onResult && onResult(final, interim);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      onError && onError(e);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      // Don't auto-restart here; we’ll control it manually in logic
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [onResult, onError]);

  const start = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop(); // Stop any ongoing session first
      recognition.start(); // Safe to start now
    } catch (err) {
      console.warn("Speech recognition already active, skipping restart.");
    }
  };

  const stop = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (err) {
      console.warn("Failed to stop recognition:", err);
    }
  };

  return { start, stop };
};


function InterviewPage() {
  const [category, setCategory] = useState("");
  const [resume, setResume] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [countdown, setCountdown] = useState(50);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [answersWithFeedback, setAnswersWithFeedback] = useState([]);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const userId = localStorage.getItem("userId") || "guest-user";
  const navigate = useNavigate();

  const { start, stop } = useSpeechRecognition({
    onResult: (final, interim) => {
      setTranscript(interim);
      if (final.trim().length > 0) {
        setTranscript("");
        handleAnswer(final.trim());
      }
    },
    onError: () => handleAnswer("No response"),
  });

  const resetTimer = useCallback((seconds = 50) => setCountdown(seconds), []);

  const saveInterviewReport = useCallback(async (report) => {
    try {
      await api.post("/api/interview/report", {
        interviewId,
        userId,
        category,
        report,
      });
    } catch (err) {
      console.error("Failed to save report:", err);
    }
  }, [interviewId, userId, category]);

  // const handleAnswer = useCallback(async (answer) => {
  //   if (!waitingForAnswer) return;

  //   setWaitingForAnswer(false);
  //   stop();
  //   clearInterval(timerRef.current);
  //   resetTimer();

  //   try {
  //     setLoading(true);

  //     const res = await api.post("/api/interview/feedback", {
  //       question: questions[currentIndex],
  //       answer,
  //     });
  //     const feedback = res.data.feedback || "Good answer";

  //  answers and question asking by the ai


  const handleAnswer = useCallback(
    async (answer) => {
      if (!waitingForAnswer) return;

      setWaitingForAnswer(false);
      stop();
      clearInterval(timerRef.current);
      resetTimer();

      try {
        setLoading(true);

        // Get feedback only if the answer isn't "No response"
        let feedback = "No response recorded";
        if (answer !== "No response") {
          const res = await api.post("/api/interview/feedback", {
            question: questions[currentIndex],
            answer,
          });
          feedback = res.data.feedback || "Good answer";
        }

        setAnswersWithFeedback((prev) => {
          const updated = [
            ...prev,
            { question: questions[currentIndex], answer, feedback },
          ];
          setFeedbackMessage(feedback);

          setTimeout(async () => {
            setFeedbackMessage("");
            const nextIndex = currentIndex + 1;

            if (nextIndex < questions.length) {
              setCurrentIndex(nextIndex);
              setTranscript("");
              setWaitingForAnswer(true);
              speak(questions[nextIndex], () => {
                start();
                resetTimer(50);
              });
            } else {
              await saveInterviewReport(updated);
              setCompleted(true);
            }
          }, 2000);

          return updated;
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [waitingForAnswer, questions, currentIndex, saveInterviewReport, stop, start, resetTimer]
  );

  
  useEffect(() => {
    if (countdown === 0 && waitingForAnswer) handleAnswer("No response");
  }, [countdown, waitingForAnswer, handleAnswer]);



// waiting for the answer

useEffect(() => {
  if (waitingForAnswer) {
    timerRef.current = setInterval(() => setCountdown(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timerRef.current);
  }
}, [waitingForAnswer]);

useEffect(() => {
  if (countdown === 0 && waitingForAnswer) handleAnswer("No response");
}, [countdown, waitingForAnswer, handleAnswer]);

useEffect(() => {
  if (completed) {
    const timer = setTimeout(() => navigate("/interview"), 2000);
    return () => clearTimeout(timer);
  }
}, [completed, navigate]);

const startCamera = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  } catch (err) {
    console.error("Camera/Mic access denied:", err);
    alert("Allow camera and mic access.");
  }
}, []);

const handleStart = useCallback(async () => {
  if (!resume || !category) {
    alert("Please choose a category and upload your resume.");
    return;
  }

  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("category", category);
  formData.append("userId", userId);

  try {
    setLoading(true);
    const res = await api.post("/api/interview/start", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setInterviewId(res.data.interviewId);
    setQuestions(res.data.questions);
    setCurrentIndex(0);
    setTranscript("");
    setAnswersWithFeedback([]);
    setCompleted(false);
    setWaitingForAnswer(true);
    resetTimer(50);

    await startCamera();

    // Speak first question
    speak(res.data.questions[0], () => {
      start();
      resetTimer(50);
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to start interview: " + (err.response?.data?.details || err.message));
  } finally {
    setLoading(false);
  }
}, [resume, category, userId, startCamera, start, resetTimer]);

return (
  <div className="h-screen w-screen bg-black flex flex-col items-center p-4">
    {/* Center GIF */}
    <div className="w-full flex justify-center mb-4 mt-20">
      <img
        src="https://i.pinimg.com/originals/f1/69/47/f16947ca6a616349ed63771804d16250.gif"
        alt="Interview GIF"
        className="w-64 h-64 rounded-full bg-transparent"
      />
    </div>

    {/* Transcript & Answers */}
    <div className="w-full max-w-3xl p-4 rounded-lg shadow-inner mb-4 text-white">
      <h3 className="font-semibold mb-2">Transcript & Answers</h3>
      <div className="flex flex-col gap-2">
        {answersWithFeedback.map((qa, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-gray-800 text-white">
            <strong>Q:</strong> {qa.question} <br />
            <strong>A:</strong> {qa.answer} <br />
            <strong>Feedback:</strong> {qa.feedback}
          </div>
        ))}

        {questions[currentIndex] && !completed && (
          <div className="p-2 rounded-lg text-blue-700">{questions[currentIndex]}</div>
        )}

        {transcript && (
          <div className="p-2 rounded-lg text-green-700 italic">{transcript}...</div>
        )}

        {feedbackMessage && (
          <div className="p-2 rounded-lg text-yellow-400 italic">{feedbackMessage}</div>
        )}

        {waitingForAnswer && (
          <div className="text-yellow-400 font-bold mt-2">
            ⏱ Time left: {countdown}s
          </div>
        )}
      </div>
    </div>

    {/* Completed message */}
    {completed && (
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold text-green-700">Interview Completed 🎉</h2>
        <p className="mt-2 text-lg text-gray-100">Report saved successfully.</p>
        <p className="mt-1 text-gray-200 italic">Redirecting to category page...</p>
      </div>
    )}

    {/* Live camera */}
    <video
      ref={videoRef}
      autoPlay
      muted
      className="fixed bottom-4 left-4 w-72 h-52 border-2 border-white rounded-xl shadow-lg z-50"
    />

    {/* Start Interview Modal */}
    {!interviewId && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Start AI Interview</h2>

          <span className="text-gray-700 font-semibold mb-2 block">Choose Category</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["Machine Learning", "Web Development", "Cloud Computing", "HR", "Technical", "Software Development"].map(
              (cat) => (
                <div
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer p-4 rounded-xl text-center border-2 transition ${category === cat ? "border-blue-600 bg-blue-100" : "border-gray-300 hover:border-blue-400"
                    }`}
                >
                  {cat}
                </div>
              )
            )}
          </div>

          <label className="block mb-4">
            <span className="text-gray-700">Upload Resume</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="mt-1 block w-full border rounded-lg p-2"
            />
          </label>

          <button
            onClick={handleStart}
            disabled={loading || !category || !resume}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Starting..." : "🚀 Start Interview"}
          </button>
        </div>
      </div>
    )}
  </div>
);
}

export default InterviewPage;
