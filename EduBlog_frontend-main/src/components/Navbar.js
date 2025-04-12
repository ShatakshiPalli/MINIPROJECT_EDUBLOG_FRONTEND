import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#1a1a1a] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#61dafb]">
              EduBlog
            </Link>
            <div className="hidden md:flex md:items-center md:ml-10 space-x-8">
              <Link to="/" className="text-gray-300 hover:text-[#61dafb] transition-colors duration-200">
                Home
              </Link>
              <Link to="/blogs" className="text-gray-300 hover:text-[#61dafb] transition-colors duration-200">
                Blogs
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-[#61dafb] transition-colors duration-200">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-[#61dafb] transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#61dafb] text-[#121212] hover:opacity-90 transition-opacity duration-200 focus:outline-none"
                >
                  <span className="text-lg font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 text-sm text-[#61dafb] border-b border-gray-700">
                      {user.username}
                    </div>
                    <Link
                      to="/dashboard/posts"
                      className="block px-4 py-2 text-gray-300 hover:bg-[#121212] hover:text-[#61dafb] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Posts
                    </Link>
                    <Link
                      to="/dashboard/LikedPosts"
                      className="block px-4 py-2 text-gray-300 hover:bg-[#121212] hover:text-[#61dafb] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Liked Posts
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-[#121212] hover:text-[#61dafb] transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#61dafb] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 