import React from 'react'
import Footer from '../components/Footer'

export default function Aboutus() {
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
      <section className="bg-blue-900 text-white px-6 py-16 md:px-20 lg:px-32">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg leading-relaxed">
              Innovating the Future of Digital Experiences with cutting-edge
              solutions that empower businesses and individuals worldwide.
            </p>
            <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white">
              Start Interview Prep
            </button>
          </div>
          <img src="/images/current.jpg" alt="Hero" className="rounded-lg shadow-lg max-h-80 object-cover"/>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16 md:px-20 lg:px-32 bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: "Dheeraj Kumar", role: "Interview Conduct By Ai", img: "/images/previous.jpg" },
            { name: "Amit Gupta", role: "User Authentication/Autherization", img: "/images/previous.jpg" },
            { name: "Yash Jain", role: "Protect Routes And Quiz conduct", img: "/images/previous.jpg" },
            { name: "Sobhit Chodhari", role: "Deshboard", img: "/images/previous.jpg" },
            { name: "Rishit Mishra", role: "Coding Problems", img: "/images/previous.jpg" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-gray-100 p-6 rounded-xl text-center shadow hover:shadow-lg transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
