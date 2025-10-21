import React, { useState } from "react";
import Footer from '../components/Footer';

function Landpage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess("✅ Your response has been submitted!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setSuccess("❌ Failed to submit. Try again later.");
      }
    } catch (err) {
      console.error(err);
      setSuccess("❌ Server error. Try again.");
    }
  };
  return (
    <div className='w-screen'>
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
      <section class="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white pt-32 pb-24 text-center">
        <div class="max-w-3xl mx-auto px-6 ">

          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Master Your Interview with <span class="text-yellow-300">AI Confidence</span>
          </h1>
          <p class="text-lg text-gray-200 mb-8">
            Practice aptitude, verbal, and reasoning tests with smart feedback to ace your next job interview.
          </p>
          <a href="/signup"
            class="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition">
            Get Started Free
          </a>
        </div>
      </section>
      <section id="features" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose Prepbot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600">Get instant analysis of your answers with detailed feedback to improve.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your growth with dashboards and detailed performance reports.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Job Ready Skills</h3>
              <p className="text-gray-600">Prepare for interviews with verbal, numerical, and reasoning practice.</p>
            </div>

          </div>
        </div>
      </section>


      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
              alt="Interview Prep"
              className="rounded-xl shadow-lg" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Prepbot</h2>
            <p className="text-gray-600 mb-4">
              Prepbot helps you practice interview-style questions with real-time feedback powered by AI.
              We believe in giving everyone the confidence to succeed in their career journey.
            </p>
            <a href="/signup" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
              Join Now
            </a>
          </div>
        </div>
      </section>


      <section id="contact" className="py-20 bg-gray-100">


        <div className="shadow-md rounded-xl flex-col max-w-4xl mx-auto text-center bg-gray-50 min-h-screen flex items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">Have questions? We’d love to hear from you.</p>

          <form
            onSubmit={handleSubmit}
            className=" p-8 rounded-xl w-full  space-y-4"
          >

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg"
              required
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="4"
              className="w-full p-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>

            {success && <p className="text-center mt-2">{success}</p>}
          </form>
        </div>

      </section>

      <Footer />


    </div>

  );
}

export default Landpage;