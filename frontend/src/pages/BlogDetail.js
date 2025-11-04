import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../utils/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPost();
  }, [id]);

  const loadBlogPost = async () => {
    try {
      const response = await getBlogPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to load blog post:', error);
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-gold-600 hover:text-gold-700">
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-navy-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-navy-600 hover:text-navy-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-navy-600">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image_url && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={`http://localhost:5000${post.image_url}`}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none text-navy-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Back to Blog CTA */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>View All Posts</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
