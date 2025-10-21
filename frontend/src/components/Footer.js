import React from 'react'
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        
        <div>
          <h2 className="text-2xl font-bold text-white">Prepbot</h2>
          <p className="mt-3 text-gray-400 text-sm">
            Master your interview with AI-powered confidence.
          </p>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Blog</Link></li>
            <li><Link to="#" className="hover:text-white">Help Center</Link></li>
            <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <form className="flex">
            <input type="email" placeholder="Enter your email" 
                   className="w-full px-3 py-2 rounded-l-lg focus:outline-none text-gray-900"/>
            <button type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      
      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">&copy; 2025 Prepbot. All rights reserved.</p>
        
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="#" className="hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12"/>
            </svg>
          </Link>
          <Link to="#" className="hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
            </svg>
          </Link>
          <Link to="#" className="hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.54 6.42a8.63 8.63 0 0 0-.57-2.04 4.92 4.92 0 0 0-3.1-3.1A8.63 8.63 0 0 0 16.83.71C15.76.5 12 .5 12 .5s-3.76 0-4.83.21a8.63 8.63 0 0 0-2.04.57 4.92 4.92 0 0 0-3.1 3.1 8.63 8.63 0 0 0-.57 2.04C1.5 7.49 1.5 12 1.5 12s0 4.51.21 5.58c.12.7.31 1.39.57 2.04a4.92 4.92 0 0 0 3.1 3.1c.65.26 1.34.45 2.04.57C8.24 23.5 12 23.5 12 23.5s3.76 0 4.83-.21a8.63 8.63 0 0 0 2.04-.57 4.92 4.92 0 0 0 3.1-3.1c.26-.65.45-1.34.57-2.04.21-1.07.21-5.58.21-5.58s0-4.51-.21-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </footer>
  )
}
