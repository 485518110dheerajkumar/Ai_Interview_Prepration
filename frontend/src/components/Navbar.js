import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ decode JWT

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // store user from MongoDB
  const dropdownRef = useRef();

  // ✅ Get userId from JWT token stored in localStorage
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id; // matches backend payload
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ✅ Fetch user from MongoDB
  useEffect(() => {
    if (!userId) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          ...data,
          image: data.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQHstFutlfl8tgZAtY8nDWucSWEvFM5AETQ&s", // default image
          name: data.name || "Guest"
        });
      })
      .catch((err) => console.error("Navbar fetch error:", err));
  }, [userId]);

  const profileImg = user?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQHstFutlfl8tgZAtY8nDWucSWEvFM5AETQ&s";

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/quiz", label: "Quiz" },
    { path: "/coding", label: "Coding" },
    { path: "/quiz-reports", label: "Quiz Reports" },
    { path: "/coding-reports", label: "Coding Reports" },
    { path: "/reports", label: "Reports" },
  ];

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
     // remove token on logout
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-slate-800 text-white shadow-md px-8 py-3 flex items-center justify-between w-full">
      {/* Logo */}
      <div
        className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400"
        onClick={() => navigate("/")}
      >
        Prepbot
      </div>

      {/* Center Links */}
      <div className="flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
              location.pathname === link.path
                ? "bg-blue-500 text-white shadow"
                : "text-gray-200 hover:text-white hover:bg-blue-400/30"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Section - User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <img
          src={profileImg}
          alt="User"
          className="w-10 h-10 rounded-full border object-cover cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
            <Link
              to="/userprofile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              👤 Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              ⚙️ Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
