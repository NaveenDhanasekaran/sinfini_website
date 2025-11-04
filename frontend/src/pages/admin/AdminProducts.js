import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        image: null,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy-900">Products Management</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Image</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-navy-50">
                      <td className="px-6 py-4">
                        {product.image_url ? (
                          <img
                            src={`http://localhost:5000${product.image_url}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-navy-200 rounded-lg flex items-center justify-center">
                            <span className="text-navy-600 font-bold">{product.name[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy-900">{product.name}</td>
                      <td className="px-6 py-4 text-navy-600">{product.category}</td>
                      <td className="px-6 py-4 text-navy-600 max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
              <p className="text-navy-600">No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-navy-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-navy-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                >
                  <option value="">Select category</option>
                  <option value="Cotton Fabrics">Cotton Fabrics</option>
                  <option value="Synthetic Fabrics">Synthetic Fabrics</option>
                  <option value="Garments">Garments</option>
                  <option value="Linens">Linens</option>
                  <option value="Terry Toweling">Terry Toweling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Image</label>
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
                  {editingProduct ? 'Update' : 'Create'}
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

export default AdminProducts;
