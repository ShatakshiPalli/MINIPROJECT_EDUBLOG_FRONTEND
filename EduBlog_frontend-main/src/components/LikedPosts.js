import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LikedPosts = () => {
    const { user } = useAuth();
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    
    
    useEffect(() => {
        const fetchPost = async (id) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return {
                    id: response.data.id,
                    title: response.data.title,
                    category: response.data.category,
                    description: response.data.description,
                    createdAt: response.data.createdAt,
                    author: response.data.author,
                };
            } catch (err) {
                return {
                    id: "error",
                    title: "not found",
                    author: "not found"
                };
            }
        };

        const fetchLikedPosts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/users/liked-list/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const likedPostIds = response.data.likedPostIds;

                // Fetch all liked posts
                const posts = await Promise.all(likedPostIds.map(id => fetchPost(id)));
                setLikedPosts(posts);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch liked posts', err);
                setError('Failed to fetch recommendations');
                setLoading(false);
            }
        };

        fetchLikedPosts();
    }, [user]);


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

    if (likedPosts.length === 0) {
        return null;
    }

    return (
<div className="bg-[#1a1a1a] p-6 rounded-lg shadow-sm mb-8 border border-[#61dafb]/20">
      <h2 className="text-xl font-semibold text-[#61dafb] mb-4">Posts liked By You</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {likedPosts.map((post) => (
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

export default LikedPosts;