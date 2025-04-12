import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/posts/my-posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61dafb]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#61dafb]">My Posts</h1>
        <Link
          to="/blogs/create"
          className="px-6 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
        >
          Create New Post
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-[#121212] border-l-4 border-red-500 text-red-500">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">You haven't created any posts yet.</p>
          <Link
            to="/blogs/create"
            className="text-[#61dafb] hover:text-[#61dafb]/80 transition-colors duration-200"
          >
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-[#61dafb] transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#121212] text-[#61dafb] border border-[#61dafb]/20 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <Link to={`/blogs/${post.id}`} className="block group">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#61dafb] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {post.description}
                  </p>
                </Link>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <span className="text-sm text-gray-400">
                    By {post.author?.username}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/blogs/edit/${post.id}`}
                      className="px-3 py-1 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 bg-[#121212] text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-[#121212] transition-colors duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts; 