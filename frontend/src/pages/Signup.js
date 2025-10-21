import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send contact and image as null initially
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
        ...form,
        contact: null,
        image: null,
      });
      localStorage.setItem("token", res.data.token);
      const userId = res.data.user.id; // ✅
      localStorage.setItem("userId", userId);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Prepbot</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5 mr-2"
              alt="Google"
            />
            Sign up with Google
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/303145/facebook-icon-logo.svg"
              className="w-5 h-5 mr-2"
              alt="Facebook"
            />
            Sign up with Facebook
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
