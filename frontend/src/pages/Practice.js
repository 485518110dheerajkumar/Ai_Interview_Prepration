import React from 'react'
import { Link } from "react-router-dom";
import { FaBrain, FaCode, FaUserTie } from "react-icons/fa";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Practice() {
  const features = [
    { name: "Quiz Practice", path: "/quiz", color: "from-blue-400 to-blue-600", icon: <FaBrain /> },
    { name: "Coding Practice", path: "/coding", color: "from-green-400 to-green-600", icon: <FaCode /> },
    { name: "Interview Prep", path: "/interview", color: "from-purple-400 to-purple-600", icon: <FaUserTie /> },
  ];

  return (
    <div>
     <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center px-6 py-16">
       
      <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center tracking-wide">
        Practice Hub
      </h1>

      <section className=" w-full max-w-6xl grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {features.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`bg-gradient-to-r ${item.color} text-white p-10 rounded-3xl shadow-2xl hover:scale-105 transform transition-all duration-300 flex flex-col items-center justify-center text-center`}
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h2 className="text-2xl font-semibold">{item.name}</h2>
          </Link>
        ))}
      </section>

      
    </div>
    <Footer/>
    </div>
  )
}
