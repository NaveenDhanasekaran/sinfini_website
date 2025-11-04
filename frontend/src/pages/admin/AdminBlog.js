import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../utils/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    image: null,
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

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

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        image: null,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        author: 'Admin',
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      author: 'Admin',
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('author', formData.author);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, data);
      } else {
        await createBlogPost(data);
      }
      loadBlogPosts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save blog post:', error);
      alert('Failed to save blog post');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id);
        loadBlogPosts();
      } catch (error) {
        console.error('Failed to delete blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy-900">Blog Management</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Post</span>
          </button>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Image</th>
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Author</th>
                    <th className="px-6 py-4 text-left">Content Preview</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-navy-50">
                      <td className="px-6 py-4">
                        {post.image_url ? (
                          <img
                            src={`http://localhost:5000${post.image_url}`}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-navy-200 rounded-lg flex items-center justify-center">
                            <span className="text-navy-600 font-bold">{post.title[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy-900 max-w-xs">{post.title}</td>
                      <td className="px-6 py-4 text-navy-600">{post.author}</td>
                      <td className="px-6 py-4 text-navy-600 max-w-md truncate">{stripHtml(post.content)}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(post)}
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-navy-600">No blog posts yet. Add your first post!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-navy-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-navy-900">
                {editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Content *</label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {editingPost ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-navy-200 hover:bg-navy-300 text-navy-900 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
