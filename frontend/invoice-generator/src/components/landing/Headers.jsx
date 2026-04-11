import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AI Invoice App
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Testimonials</a>
          <a href="#faq" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">FAQ</a>
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <Link 
            to="/login" 
            className="text-black hover:text-gray-900 font-medium transition-colors duration-200"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-blue-950 to-blue-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>

        <div className="lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-18 left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium">Features</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium">Testimonials</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium">FAQ</a>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <Link to="/login" className="text-center font-medium py-2">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;