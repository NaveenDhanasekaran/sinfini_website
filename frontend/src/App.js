import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBlog from './pages/admin/AdminBlog';
import AdminGallery from './pages/admin/AdminGallery';
import AdminChatbot from './pages/admin/AdminChatbot';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/products" element={
              <>
                <Navbar />
                <Products />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/gallery" element={
              <>
                <Navbar />
                <Gallery />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/blog" element={
              <>
                <Navbar />
                <Blog />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/blog/:id" element={
              <>
                <Navbar />
                <BlogDetail />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
                <Footer />
                <Chatbot />
              </>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute>
                <AdminBlog />
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            } />
            <Route path="/admin/chatbot" element={
              <ProtectedRoute>
                <AdminChatbot />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
