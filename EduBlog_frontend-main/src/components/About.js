import React from 'react';
import { Link } from 'react-router-dom';
const visionImage = "/images/vision.png";
const missionImage = "/images/mission.png";


const About = () => {
  return (
    <div className="min-h-screen bg-[#121212] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#61dafb] sm:text-5xl lg:text-6xl">
            About EduBlog
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering minds through quality educational content. We believe in making learning accessible,
            engaging, and collaborative for everyone.
          </p>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Our Mission */}
          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#61dafb]/20 text-center">
            <img src={missionImage} alt="Mission" className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-lg" />
            <h2 className="text-2xl font-bold text-[#61dafb] mb-4">Our Mission</h2>
            <p className="text-gray-300">
              To create a vibrant community of learners and educators, fostering knowledge sharing
              and intellectual growth through high-quality educational content. We strive to make
              learning accessible to everyone, regardless of their background or location.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#61dafb]/20 text-center">
            <img src={visionImage} alt="Vision" className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-lg" />
            <h2 className="text-2xl font-bold text-[#61dafb] mb-4">Our Vision</h2>
            <p className="text-gray-300">
              To become the leading platform for educational content sharing, where experts and
              learners come together to create a global learning ecosystem. We envision a world
              where quality education knows no boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;