import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Quill from "quill";
import TurndownService from "turndown";
import "quill/dist/quill.snow.css"; // Import Quill CSS
import { marked } from "marked"; // Import marked for Markdown-to-HTML conversion

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null); // Reference to hold the editor instance
  const [formData, setFormData] = useState({
    title: "",
    category: "GENERAL",
    content: "", // This will hold the Markdown string
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["GENERAL", "MATHEMATICS", "SCIENCE", "PROGRAMMING", "HISTORY", "LITERATURE"];
  
  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const post = response.data;

        // Update formData
        setFormData({
          title: post.title,
          category: post.category,
          content: post.content, // Markdown string
        });

        // Convert Markdown to HTML and set it in Quill editor
        const htmlContent = marked(post.content); // Convert Markdown to HTML
        if (quillRef.current && quillRef.current.__quill) {
          const editor = quillRef.current.__quill; // Access Quill instance
          editor.clipboard.dangerouslyPasteHTML(htmlContent); // Set HTML content
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to fetch post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const initializeQuill = (ref) => {
    if (ref && !ref.__quill) { // Check if Quill is not already initialized
      const editor = new Quill(ref, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"], // Formatting buttons
            [{ header: [1, 2, 3, false] }],  // Header options
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            ["image"], // Image uploader
          ],
        },
      });

      // Store the Quill instance in the ref
      ref.__quill = editor;

      // Handle image uploads
      editor.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = async () => {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result;
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", base64); // Insert base64 image
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
const editor = quillRef.current.__quill; // Access the Quill instance
      const htmlContent = editor.root.innerHTML; // Extract HTML content from Quill
      console.log(editor.getContents());
      // Convert HTML content to Markdown using Turndown
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);

      const token = localStorage.getItem("token");

      // Combine formData with Markdown content
      const postData = {
        ...formData,
        content: markdownContent, // Send Markdown content as a string
      };

      await axios.put(`http://localhost:8080/api/posts/${id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <style>
      {`
        .ql-toolbar {
          background-color: #333; /* Dark background */
          color: #fff; /* Light text */
        }

        .ql-toolbar .ql-stroke {
          stroke: #fff; /* Light icons */
        }

        .ql-toolbar .ql-fill {
          fill: #fff; /* Light fill for icons */
        }

        .ql-toolbar .ql-picker .ql-expanded{
          color: #fff; /* Light text for dropdowns */
        }
          .ql-picker-label{
            color: #fff;
          }
        .ql-toolbar .ql-picker-label:hover,
        .ql-toolbar button:hover {
          background-color: rgb(51, 51, 51); /* Set the desired hover background color */
          /*color: #61dafb !important; /* Optional: change the text/icon color on hover */
        }
        .ql-toolbar button:hover .ql-stroke {
          stroke: rgb(51, 51, 51); /* Optional: change the icon stroke color on hover */
        }
        .ql-picker-options{
          background-color: rgb(51, 51, 51) !important;
          color: #fff;
        }
      `}
    </style>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 border border-gray-700">
          <h2 className="text-3xl font-bold text-[#61dafb] mb-6">Create New Post</h2>

          {error && (
            <div className="mb-6 p-4 bg-[#121212] border-l-4 border-red-500 text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#61dafb] mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter post title"
                className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#61dafb] mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-[#121212]">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#61dafb] mb-2">Content</label>
              <div
                ref={(ref) => {
                  quillRef.current = ref;
                  initializeQuill(ref);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              ></div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="px-6 py-2 bg-[#121212] text-[#EF4444] border border-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-[#121212] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
              >
                {loading ? "Editing..." : "Edit Post"}
              </button>
            </div>
          </form>
      </div>
    </div>
    </>
  );
};

export default EditPost;
