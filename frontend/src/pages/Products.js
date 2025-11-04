import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=1200"
            alt="Products"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-gold-300">
              Premium textiles for international markets
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="h-64 bg-navy-200 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
                        <span className="text-white text-4xl font-bold">{product.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-gold-600 text-sm font-semibold mb-2">{product.category}</div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{product.name}</h3>
                    <p className="text-navy-600 line-clamp-3">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-navy-600">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-navy-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy-900">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {selectedProduct.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost:5000${selectedProduct.image_url}`}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}
              <div className="mb-4">
                <span className="inline-block bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedProduct.category}
                </span>
              </div>
              <p className="text-navy-700 text-lg leading-relaxed whitespace-pre-line">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
