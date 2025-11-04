import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from '../../utils/api';
import { Plus, Trash2, X, Play } from 'lucide-react';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
  });

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const response = await getGalleryItems();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      file: null,
      title: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      file: null,
      title: '',
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    const data = new FormData();
    data.append('file', formData.file);
    data.append('title', formData.title);
    data.append('description', formData.description);

    try {
      await createGalleryItem(data);
      loadGalleryItems();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to upload gallery item:', error);
      alert('Failed to upload gallery item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteGalleryItem(id);
        loadGalleryItems();
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
        alert('Failed to delete gallery item');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy-900">Gallery Management</h2>
          <button
            onClick={handleOpenModal}
            className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Media</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    {item.media_type === 'image' ? (
                      <img
                        src={`http://localhost:5000${item.media_url}`}
                        alt={item.title || 'Gallery item'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={`http://localhost:5000${item.media_url}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play className="text-navy-900" size={24} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  {(item.title || item.description) && (
                    <div className="mt-2">
                      {item.title && <p className="font-semibold text-navy-900 text-sm">{item.title}</p>}
                      {item.description && <p className="text-navy-600 text-xs">{item.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-navy-600">No gallery items yet. Upload your first media!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="bg-white border-b border-navy-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold text-navy-900">Add Media</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Media File * (Image or Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  required
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
                <p className="text-xs text-navy-600 mt-1">
                  Supported: Images (jpg, png, gif, webp) and Videos (mp4, webm, ogg)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Upload
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

export default AdminGallery;
