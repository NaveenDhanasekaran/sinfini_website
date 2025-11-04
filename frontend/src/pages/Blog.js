import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../utils/api';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const response = await getBlogPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
            alt="Blog"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-gold-300">
              Latest news and insights from the textile industry
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="h-48 bg-navy-200 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={`http://localhost:5000${post.image_url}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
                        <span className="text-white text-4xl font-bold">{post.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-navy-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-navy-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-navy-600 mb-4 line-clamp-3">
                      {stripHtml(post.content)}
                    </p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-semibold transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-navy-600">No blog posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
