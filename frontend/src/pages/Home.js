import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Award, Users, TrendingUp } from 'lucide-react';
import { getProducts } from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Premium Textile Exports',
      subtitle: 'Quality fabrics for international markets',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=1200',
    },
    {
      title: 'Excellence in Quality',
      subtitle: 'Serving Asia, Africa, and Europe',
      image: 'https://images.unsplash.com/photo-1626497764552-8032d8d6e2f9?w=1200',
    },
    {
      title: 'Your Trusted Partner',
      subtitle: 'Cotton, Synthetic, Linens & More',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    },
  ];

  useEffect(() => {
    loadProducts();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Slider */}
      <div className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 to-navy-900/70"></div>
            </div>
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gold-300 mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-gold-500 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Company Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Welcome to Sinfini Marketing FZC
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-6"></div>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Leading textile export company based in Sharjah, UAE, specializing in premium cotton and synthetic fabrics, garments, linens, and terry toweling products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: 'Global Reach', desc: 'Exporting to Asia, Africa & Europe' },
              { icon: Award, title: 'Premium Quality', desc: 'Highest standards in textile manufacturing' },
              { icon: Users, title: 'Expert Team', desc: 'Experienced professionals serving you' },
              { icon: TrendingUp, title: 'Growing Network', desc: 'Expanding international partnerships' },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl mb-4">
                  <item.icon className="text-gold-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-navy-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Our Products</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-6"></div>
            <p className="text-xl text-navy-600">
              Discover our range of premium textile products
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-navy-200 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
                        <span className="text-white text-2xl font-bold">{product.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-gold-600 text-sm font-semibold mb-2">{product.category}</div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{product.name}</h3>
                    <p className="text-navy-600 mb-4 line-clamp-3">{product.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-navy-600">No products available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              <span>View All Products</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Order?</h2>
          <p className="text-xl text-navy-200 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your textile needs and discover how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              <span>Contact Us</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center space-x-2 bg-transparent border-2 border-white hover:bg-white hover:text-navy-900 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-6">Why Choose Sinfini Marketing?</h2>
              <div className="space-y-4">
                {[
                  'Premium quality cotton and synthetic fabrics',
                  'International export expertise',
                  'Competitive pricing and flexible terms',
                  'Reliable delivery to Asia, Africa, and Europe',
                  'Comprehensive product range',
                  'Dedicated customer support',
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-gold-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-navy-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=800"
                alt="Textile manufacturing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
