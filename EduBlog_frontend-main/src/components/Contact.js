import React, { useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react"; // Importing icons

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-4xl font-bold text-[#61dafb] text-center mb-3">
        Contact Us
      </h1>
      <p className="text-gray-300 text-center text-lg mb-8">
        Have questions? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Get in Touch Section */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-[#61dafb] mb-4">
            Get in Touch
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="text-[#61dafb] w-6 h-6" />
              <div>
                <h3 className="text-[#61dafb] text-sm mb-1">Email</h3>
                <p className="text-gray-300">support@edublog.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3">
              <MapPin className="text-[#61dafb] w-6 h-6" />
              <div>
                <h3 className="text-[#61dafb] text-sm mb-1">Location</h3>
                <p className="text-gray-300">123 Learning Street</p>
                <p className="text-gray-300">Education City, ED 12345</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center space-x-3">
              <Clock className="text-[#61dafb] w-6 h-6" />
              <div>
                <h3 className="text-[#61dafb] text-sm mb-1">Hours</h3>
                <p className="text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send us a Message Section */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-[#61dafb] mb-4">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-[#61dafb] text-sm mb-1 block">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-[#61dafb] text-sm mb-1 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-[#61dafb] text-sm mb-1 block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
