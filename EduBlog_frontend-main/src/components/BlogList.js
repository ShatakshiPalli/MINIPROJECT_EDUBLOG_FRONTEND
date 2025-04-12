import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecommendedPosts from './RecommendedPosts';

const BlogList = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [message, setMessage] = useState('');
  const [total, setTotal] = useState(0);
  const [showing, setShowing] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Mathematics', value: 'MATHEMATICS' },
    { name: 'Science', value: 'SCIENCE' },
    { name: 'Programming', value: 'PROGRAMMING' },
    { name: 'History', value: 'HISTORY' },
    { name: 'Literature', value: 'LITERATURE' }
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = user ? localStorage.getItem('token') : null;
      
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        params: {
          category: category === 'all' ? null : category
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { blogs, message, total, showing } = response.data;
      const postsArray = Array.isArray(blogs) ? blogs : [];
      setPosts(postsArray);
      setMessage(message || '');
      setTotal(total || 0);
      setShowing(showing || 0);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch posts. Please try again later.'
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedPosts = async () => {
    if (user) {
      try {
        const response = await axios.get('http://localhost:8080/api/posts/recommended', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data) {
          setRecommendedPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching recommended posts:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    try {
      setLoading(true);
      setError('');
      console.log(searchTerm);
      const token = user ? localStorage.getItem('token') : null;
      
      const response = await axios.get('http://localhost:8080/api/posts/search', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        params: {
          query: searchTerm,
          page: 0,
          size: 25
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
  
      const { blogs, total, showing } = response.data;
      setPosts(blogs || []);
      setTotal(total || 0);
      setShowing(showing || 0);
      setError('');
    } catch (err) {
      console.error('Error searching posts:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to search posts. Please try again later.'
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendedPosts();
    if (searchTerm) {
      handleSearchSubmit();
    } else {
      fetchPosts();
    }
  }, [category, user]);

  const handleCategoryChange = (e) => {
    fetchPosts(e.target.value);
  };

  useEffect(() => {
    fetchPosts();
    fetchRecommendedPosts();
  }, [category, user]);

  const renderPosts = (postsToRender, title) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#61dafb] mb-6">
        {title} {postsToRender.length > 0 && `(${postsToRender.length})`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsToRender.map((post) => (
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
                <Link
                  to={`/blogs/${post.id}`}
                  className="inline-flex items-center px-4 py-2 border border-[#61dafb] text-sm font-medium rounded-md text-[#61dafb] bg-[#121212] hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-[#61dafb] sm:text-3xl sm:truncate">
            Educational Blog Posts
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-300">
              {total} total posts • Showing {showing} posts
            </div>
          </div>
        </div>
        {user && (
          <Link
            to="/blogs/create"
            className="mt-4 md:mt-0 px-6 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200 whitespace-nowrap"
          >
            Create New Post
          </Link>
        )}
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            className="flex-1 px-4 py-2 rounded-md bg-[#121212] border border-[#61dafb]/20 text-gray-300 focus:outline-none focus:border-[#61dafb]"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
          >
            Search
          </button>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb]/20 rounded-md focus:outline-none focus:border-[#61dafb]"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Recommended Posts Section */}
      {user && recommendedPosts.length > 0 && renderPosts(recommendedPosts, "Recommended for You")}

      {!user && (
        <div className="bg-[#1a1a1a] border border-[#61dafb]/20 rounded-md p-4 mb-8 text-center">
          <p className="text-gray-300">
            Please{' '}
            <Link to="/login" className="text-[#61dafb] hover:text-[#61dafb]/80">
              log in
            </Link>{' '}
            to see all posts and get personalized recommendations
          </p>
        </div>
      )}

      {/* All Posts Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#61dafb] mb-6">All Posts</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61dafb]"></div>
          </div>
        ) : error ? (
          <div className="bg-[#1a1a1a] border-l-4 border-red-400 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No posts found.</p>
          </div>
        ) : (
          renderPosts(posts, "All Posts")
        )}
      </div>
    </div>
  );
};

export default BlogList; 