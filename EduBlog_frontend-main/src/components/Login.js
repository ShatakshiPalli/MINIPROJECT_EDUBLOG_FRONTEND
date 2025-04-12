import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const validateUsername = (username) => /^[a-zA-Z0-9_]{3,16}$/.test(username); // Alphanumeric, underscores, 3-16 characters.
  const validatePassword = (password) => password.length >= 8; // At least 8 characters.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // added input validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateUsername(formData.username)) {
      setError('Username must be 3-16 characters long and contain only letters, numbers, or underscores.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        navigate('/blogs');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1a1a1a] p-8 rounded-lg border border-[#61dafb]/20">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#61dafb]">
            Sign in to your account
          </h2>
          <p className="mt-3 text-center text-sm text-gray-300">
            Access your educational content and engage with the community
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-[#121212] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:border-transparent sm:text-sm"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-[#121212] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:border-transparent sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-[#61dafb] text-sm font-medium rounded-md text-[#61dafb] bg-[#121212] hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              Sign in
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/signup" className="font-medium text-[#61dafb] hover:text-[#61dafb]/80">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
