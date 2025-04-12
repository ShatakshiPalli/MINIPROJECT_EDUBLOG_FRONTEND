import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#61dafb] sm:text-5xl lg:text-6xl">
            Welcome to EduBlog
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Discover a world of knowledge through our educational blog posts. From mathematics to literature,
            explore in-depth articles written by experts in various fields.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 border border-[#61dafb] text-base font-medium rounded-md text-[#61dafb] bg-[#121212] hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              Explore Posts
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-[#61dafb] text-base font-medium rounded-md text-[#61dafb] bg-transparent hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose EduBlog Section */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#61dafb] sm:text-4xl">
              Why Choose EduBlog?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Our platform offers a unique learning experience through high-quality educational content.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Expert Content */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#61dafb]/20 hover:border-[#61dafb] transition-colors duration-200 text-center">
              <img 
                src="/images/expert-content.png" 
                alt="Expert Content" 
                className="w-20 h-20 mx-auto mb-4 object-cover rounded-lg shadow-lg" 
              />
              <h3 className="text-lg font-medium text-[#61dafb]">Expert Content</h3>
              <p className="mt-2 text-gray-300">
                Articles written by qualified educators and professionals in their respective fields.
              </p>
            </div>

            {/* Diverse Topics */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#61dafb]/20 hover:border-[#61dafb] transition-colors duration-200 text-center">
              <img 
                src="/images/diverse-topics.png" 
                alt="Diverse Topics" 
                className="w-20 h-20 mx-auto mb-4 object-cover rounded-lg shadow-lg" 
              />
              <h3 className="text-lg font-medium text-[#61dafb]">Diverse Topics</h3>
              <p className="mt-2 text-gray-300">
                From mathematics to literature, find content that matches your interests.
              </p>
            </div>

            {/* Community Driven */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#61dafb]/20 hover:border-[#61dafb] transition-colors duration-200 text-center">
              <img 
                src="/images/community-driven.png" 
                alt="Community Driven" 
                className="w-20 h-20 mx-auto mb-4 object-cover rounded-lg shadow-lg" 
              />
              <h3 className="text-lg font-medium text-[#61dafb]">Community Driven</h3>
              <p className="mt-2 text-gray-300">
                Join a community of learners and share your knowledge with others.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
