import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, form);

      // Log the API response to see the user object
      // console.log("Login API Response:", res.data);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store userId (MongoDB _id)
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
          <h1 className="text-3xl font-bold text-blue-600">PrepAI</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
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
            Login with Google
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/303145/facebook-icon-logo.svg"
              className="w-5 h-5 mr-2"
              alt="Facebook"
            />
            Login with Facebook
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
