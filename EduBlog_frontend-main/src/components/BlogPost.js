import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecommendedPosts from './RecommendedPosts';
import { marked } from 'marked';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [isLiked, setIsLiked] = useState(likedPostIds.includes(post?.id));
  const [readingPoints, setReadingPoints] = useState(0);
  const [isReading, setIsReading] = useState(false); // New state for read aloud button

  useEffect(() => {
    if (!user) {
      navigate('/login'); 
      return;
    }

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };
    
    const fetchUserLikedPosts = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`http://localhost:8080/api/users/${user.username}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        if (response.status === 200) {
          setLikedPostIds(response.data.likedPostIds || []); 
          setIsLiked(likedPostIds.includes(post?.id));
        } else {
          console.error('Failed to fetch user liked posts:', response.statusText);
        }
      } catch (err) {
        console.error('Failed to fetch user liked posts', err);
      }
    };
    
    fetchUserLikedPosts();
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/posts/${post.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost({ ...post, likes: post.likes + 1 }); 
      setIsLiked(true);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };
    
  const handleUnlike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/posts/${post.id}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost({ ...post, likes: post.likes - 1 }); 
      setIsLiked(false);
    } catch (err) {
      console.error('Failed to unlike post', err);
    }
  };
    
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/blogs');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  const readMarkdown = (markdown) => {
    const lines = markdown.split('\n');
    let index = 0;

    const speakNextLine = () => {
      if (index >= lines.length) {
        setReadingPoints(3);
        setIsReading(false);
        return; 
      }

      const line = lines[index].trim();
      index++;

      if (line === '') {
        speakNextLine(); 
        return;
      }

      if (line.startsWith('#')) {
        const headingText = line.replace(/^#+\s*/, ''); 
        const speech = new SpeechSynthesisUtterance(headingText);
        speech.pitch = 0.75; 
        speech.onend = speakNextLine; 
        window.speechSynthesis.speak(speech);
      } else if (line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
        const listText = line.replace(/^[*-]\s*|^\d+\.\s*/, ''); 
        const speech = new SpeechSynthesisUtterance(`Point ${index}: ${listText}`);
        speech.onend = speakNextLine; 
        window.speechSynthesis.speak(speech);
      } else if (line.startsWith('![')) {
        const imageAltText = line.match(/!\[([^\]]*)\]/)[1]; 
        const speech = new SpeechSynthesisUtterance(`Please see the image: ${imageAltText}. I will pause for 5 seconds.`);
        speech.onend = () => {
          setTimeout(speakNextLine, 5000); 
        };
        window.speechSynthesis.speak(speech);
      } else {
        const speech = new SpeechSynthesisUtterance(line);
        speech.onend = speakNextLine; 
        window.speechSynthesis.speak(speech);
      }
    };

    speakNextLine(); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61dafb]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link to="/blogs" className="text-[#61dafb] hover:text-[#61dafb]/80 mt-4 inline-block">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = post.author.username === user?.username;

  // Parse Markdown into HTML
  const renderMarkdown = (markdownContent) => {
    return { __html: marked(markdownContent) };
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-[#121212] text-[#61dafb] border border-[#61dafb]/20 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <style>
              {`
                .clr{
                  color: #61dafb;
                  }
                  h1, h2, h3, h4, h5, h6, i, b, ul, ol, li{
                    all: revert;
                  }
              `}
            </style>
            <h1 className="text-3xl font-bold text-white mb-4 clr">
              {post.title}
            </h1>
            <div className="flex items-center mb-8">
              <span className="text-gray-400">By {post.author?.username}</span>
            </div>
            <button
              onClick={isLiked ? handleUnlike : handleLike}
              className="px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200 mb-4"
            >
              <span className="mr-2">
                {isLiked ? '\u{1F44D}' : ''}
              </span>
              <span>{isLiked ? '' : 'Likes:'}</span>
              <span className="ml-2">{post.likes}</span>
            </button>
            {/* <button
              onClick={() => {
                if (readingPoints === 0) {
                  readMarkdown(post.content || '');
                  setReadingPoints(1);
                } else if (readingPoints === 1) {
                  setReadingPoints(2);
                } else if (readingPoints === 2) {
                  setReadingPoints(3);
                } else {
                  setReadingPoints(1);
                  readMarkdown(post.content || ' ');
                }
              }}
              className="px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              {readingPoints === 0 ? "read" : (readingPoints === 1 ? "pause" : (readingPoints === 2 ? "continue" : "read again"))}
            </button> */}
            {/* <button
              onClick={() => {
                readMarkdown(post.content || ' ');
              }}
              className="px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              read all again
            </button> */}
            <button
              onClick={() => {
                if (isReading) {
                  stopReading();
                } else {
                  readMarkdown(post.content || '');
                  setIsReading(true);
                }
              }}
              className="px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              {isReading ? "Stop Reading" : "Read Aloud"}
            </button>
            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/blogs/edit/${post.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600EduBlog hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
            <div
              className="mt-6"
              dangerouslySetInnerHTML={renderMarkdown(post.content || '')}
            ></div>
          </div>
        </article>
        <RecommendedPosts />
        <div className="mt-6">
          <Link to="/blogs" className="text-[#61dafb] font-medium">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogPost;