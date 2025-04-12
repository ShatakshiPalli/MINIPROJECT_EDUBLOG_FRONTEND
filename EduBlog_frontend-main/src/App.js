import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import UserPosts from './components/UserPosts';
import LikedPosts from './components/LikedPosts';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#121212]">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] bg-[#121212]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route
              path="/blogs/create"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route
              path="/blogs/edit/:id"
              element={
                <PrivateRoute>
                  <EditPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/posts"
              element={
                <PrivateRoute>
                  <UserPosts />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/LikedPosts"
              element={
                <PrivateRoute>
                  <LikedPosts />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App; 