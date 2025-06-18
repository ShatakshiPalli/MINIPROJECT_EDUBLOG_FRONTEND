import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Await } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecommendedPosts from './RecommendedPosts';
import { marked } from 'marked';
import { AwardIcon } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [readingPoints, setReadingPoints] = useState(0);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSpokenLine, setLastSpokenLine] = useState(''); // To track the last spoken line
  
  
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
        return response.data;
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };
    
    const fetchUserLikedPosts = async (post) => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`http://localhost:8080/api/users/liked-list/${user.username}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
          if (response.status === 200) {
            setIsLiked(response.data.likedPostIds.indexOf(post.id) > -1);
            console.log(isLiked);
            setLoading(false);
            } else {
              console.error('Failed to fetch user liked posts:', response.statusText);
            }
          } catch (err) {
            console.error('Failed to fetch user liked posts', err);
          }
  };
    const serialise = async () => {
      let p = await fetchPost();
      setPost(p);
      await fetchUserLikedPosts(p);
    }
    serialise();
  }, [id]);
  const updateUserLikes = async () => {
    try {
        const token = localStorage.getItem('token');
        let res = await axios.post(`http://localhost:8080/api/users/liked-list/`, {
          "post_id": post.id, 
          "username": user.username
          }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if(res.data.isLiked && res.data[user.username]){
          setPost({ ...post, likes: post.likes + 1 });
          setIsLiked(true);
        }
      } catch (err) {
        console.error('Failed to like post', err);
      }
  }
  const handleLike = async () => {
    try {
        const token = localStorage.getItem('token');
        let y = await axios.post(`http://localhost:8080/api/posts/${post.id}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        await updateUserLikes();
      } catch (err) {
        console.error('Failed to like post', err);
      }
  };
      const updateUserDislike = async () => {
    try {
        const token = localStorage.getItem('token');
        let res = await axios.post(`http://localhost:8080/api/users/liked-list/dislike`, {
          "post_id": post.id, 
          "username": user.username
          }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if(res.data.isDisliked && res.data[user.username]){
          setPost({ ...post, likes: post.likes - 1 });
          setIsLiked(false);
        }
      } catch (err) {
        console.error('Failed to like post', err);
      }
  }
    const handleUnlike = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/posts/${post.id}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await updateUserDislike();
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

    // ... other state variables
    
    // ... other useEffect and functions
  
    const readMarkdown = (markdown) => {
      // Clean the markdown by removing lines with only '=' characters
      let cleanedMarkdown = markdown;
      cleanedMarkdown.replace(/!\[.*?\]\(data:image\/[^)]+\)/g, ""); // Remove image links
      cleanedMarkdown.replace(/\\*\\*.*?\\*\\*/g, "") // Remove bold text
      cleanedMarkdown.replace(/\\*.*?\\*/g, "") // Remove italic text
      cleanedMarkdown.replace(/~{1,2}.*?~{1,2}/g, "") // Remove strikethrough text
      cleanedMarkdown.replace(/^#{1,6}.*?(\n|$)/gm, "") // Remove headers
      cleanedMarkdown.replace(/_{1,2}.*?_{1,2}/g, "") // Remove underlined text
      cleanedMarkdown.replace(/\\n{2,}/g, "\n") // Normalize multiple newlines
      cleanedMarkdown.replace(/(?<=^[^\n]*\n)=+\s*$/gm, ""); // Remove lines that consist only of '=' characters
      console.log(cleanedMarkdown);
      const lines = cleanedMarkdown.split('\n');
      let index = 0;
  
      const speakNextLine = () => {
          if (index >= lines.length) {
              setReadingPoints(3);
              return; 
          }
  
          const line = lines[index].trim();
          index++;
  
          // Skip empty lines
          if (line === '') {
              speakNextLine(); 
              return;
          }
  
          // Check if the line has already been spoken
          if (line === lastSpokenLine) {
              speakNextLine();
              return;
          }
          function isLineFilledWithEquals(line) {
            return /^=+$/.test(line);
        }
          let speechText = '';
          const speech = new SpeechSynthesisUtterance();
          speech.pitch = 0.75; // Set pitch for headings
  
          if (line.startsWith('#')) {
              // Heading
              const headingText = line.replace(/^#+\s*/, ''); 
              speechText = headingText;
          } else if (line.startsWith('-') || line.startsWith('*')) {
              // Unordered list
              const listText = line.replace(/^[*-]\s*/, ''); // Remove list syntax
              speechText = `Next point: ${listText}`;
          } else if (line.match(/^\d+\./)) {
              // Ordered list
              const listText = line.replace(/^\d+\.\s*/, ''); // Remove list syntax
              speechText = `Point ${line.match(/^\d+/)[0]}: ${listText}`;
          } else if (line.startsWith('=') && isLineFilledWithEquals(line)) {
            speechText = '';
          } else if (line.startsWith('![')) {
              // Image
              const imageAltText = line.match(/!\[([^\]]*)\]/)[1]; 
              speechText = `Please see the image: ${imageAltText}. I'm continue reading the article.`;
              speech.onend = () => {
                  setTimeout(speakNextLine, 5000); // Wait for 5 seconds before continuing
                  return; // Exit the function to prevent further speaking
              };
          } else {
              // Regular text
              speechText = line;
          }
  
          // Set the speech text and speak it
          speech.text = speechText;
          speech.onend = () => {
              setLastSpokenLine(speechText); // Update last spoken line
              if (!isPaused) {
                  speakNextLine();
              }
          };
  
          // Store the current utterance to manage pause/resume
          setSpeechUtterance(speech);
          window.speechSynthesis.speak(speech);
        };
        
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          speakNextLine();
        }
      };
      
      const handlePause = () => {
        if (speechUtterance) {
          window.speechSynthesis.pause();
          setIsPaused(true);
        }
      };
  
    const handleResume = () => {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    };
    
    const handlePlayAgain = () => {
      if (speechUtterance) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
      }
      setLastSpokenLine(''); // Reset last spoken line
      readMarkdown(post.content || ' ');
    };
    window.addEventListener('beforeunload', () => {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
          window.speechSynthesis.cancel(); // Stop any ongoing speech
      }
    });
    
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
                className={`px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200 mb-4`} // Added mb-4 for margin-bottom
            >
                <span className="mr-2">
                    {isLiked ? '\u{1F44D}' : ''}
                </span>
                <span>{isLiked ? '' : 'like'}</span>
                <span className="ml-2">{post.likes}</span>
            </button>
            <button
        onClick={() => {
          if (readingPoints === 0) {
            readMarkdown(post.content || '');
            setReadingPoints(1);
          } else if (readingPoints === 1) {
            handlePause();
            setReadingPoints(2);
          } else if (readingPoints === 2) {
            handleResume();
            setReadingPoints(1);
          } else {
            handlePlayAgain();
            setReadingPoints(1);
          }
        }}
        className="px-6 py-2 m-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
      >
        {
          readingPoints === 0 ? "Read" : (readingPoints === 1 ? "pause" : (readingPoints === 2 ? "resume" : "play again"))
        }
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
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
            {/* Render Markdown using marked */}
            <div
              className="mt-6"
              dangerouslySetInnerHTML={renderMarkdown(post.content || '')}
            ></div>
          </div>
        </article>
        
        {/* recommend some new posts */}
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