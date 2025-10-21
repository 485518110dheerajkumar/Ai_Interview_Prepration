import React from "react";
import Footer from "../components/Footer";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Prep",
      description: "Get instant feedback with our smart AI interview coach.",
      img: "/images/AI.png",
    },
    {
      title: "Practice Tests",
      description: "Simulate real interviews with adaptive test questions.",
      img: "/images/Exam.png",
    },
    {
      title: "Reports & Analytics",
      description: "Track your progress with detailed reports and accuracy graphs.",
      img: "/images/report.png",
    },
    {
      title: "Anytime Access",
      description: "Learn and practice from anywhere, on any device.",
      img: "/images/anytime.png",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">


            <div class="flex items-center">
              <span class="text-2xl font-bold text-blue-600">Prepbot</span>
            </div>


            <div class="hidden md:flex space-x-6 items-center">
              <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/about" class="text-gray-700 hover:text-blue-600">About</a>
              <a href="/features" class="text-gray-700 hover:text-blue-600">Features</a>
              <a href="/contact" class="text-gray-700 hover:text-blue-600">Contact</a>
            </div>


            <div class="flex items-center space-x-4">
              <a href="/login" class="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600">Login</a>
              <a href="/signup" class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                Sign Up
              </a>
            </div>

          </div>
        </div>
      </nav>
      <section className="bg-blue-900 text-white px-6 py-16 md:px-20 lg:px-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Features</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Powerful tools designed to make your interview preparation smarter and easier.
        </p>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 md:px-20 lg:px-32">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
