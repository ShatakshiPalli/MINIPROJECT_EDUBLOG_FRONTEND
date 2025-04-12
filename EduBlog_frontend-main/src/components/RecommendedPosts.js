import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RecommendedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/posts/recommended', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPosts(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching recommended posts:', err);
        setError('Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, [user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#61dafb]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] border-l-4 border-red-400 p-4 mb-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-sm mb-8 border border-[#61dafb]/20">
      <h2 className="text-xl font-semibold text-[#61dafb] mb-4">Recommended for You</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blogs/${post.id}`}
            className="bg-[#121212] p-4 rounded-lg border border-gray-700 hover:border-[#61dafb] transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#61dafb]">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 hover:text-[#61dafb]">
              {post.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2">
              {post.description}
            </p>
            <div className="mt-2 text-xs text-gray-400">
              By {post.author?.username || 'Anonymous'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPosts;