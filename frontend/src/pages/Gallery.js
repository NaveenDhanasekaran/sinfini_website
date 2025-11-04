import React, { useState, useEffect } from 'react';
import { getGalleryItems } from '../utils/api';
import { X, Play } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1626497764552-8032d8d6e2f9?w=1200"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-gold-300">
              Explore our collection of products and facilities
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64"
                >
                  {item.media_type === 'image' ? (
                    <img
                      src={`http://localhost:5000${item.media_url}`}
                      alt={item.title || 'Gallery item'}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={`http://localhost:5000${item.media_url}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="text-navy-900" size={32} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      {item.title && <h3 className="font-semibold text-lg">{item.title}</h3>}
                      {item.description && <p className="text-sm opacity-90">{item.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-navy-600">No gallery items available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={32} />
          </button>
          <div className="max-w-5xl w-full">
            {selectedItem.media_type === 'image' ? (
              <img
                src={`http://localhost:5000${selectedItem.media_url}`}
                alt={selectedItem.title || 'Gallery item'}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={`http://localhost:5000${selectedItem.media_url}`}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] rounded-lg"
              />
            )}
            {(selectedItem.title || selectedItem.description) && (
              <div className="mt-4 text-white text-center">
                {selectedItem.title && <h3 className="text-2xl font-semibold mb-2">{selectedItem.title}</h3>}
                {selectedItem.description && <p className="text-navy-300">{selectedItem.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
