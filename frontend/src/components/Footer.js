import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 px-3 py-2 rounded-lg inline-block mb-4">
              <span className="text-xl font-bold">SINFINI</span>
            </div>
            <p className="text-navy-300 text-sm mb-4">
              Premium textile exports from UAE to international markets across Asia, Africa, and Europe.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-navy-800 rounded-lg hover:bg-gold-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-navy-800 rounded-lg hover:bg-gold-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-navy-800 rounded-lg hover:bg-gold-600 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-navy-800 rounded-lg hover:bg-gold-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-navy-300 hover:text-gold-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-navy-300 hover:text-gold-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="text-navy-300 hover:text-gold-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-navy-300 hover:text-gold-400 transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/blog" className="text-navy-300 hover:text-gold-400 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-navy-300 hover:text-gold-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-gold-400 font-semibold text-lg mb-4">Our Products</h3>
            <ul className="space-y-2 text-navy-300">
              <li>Cotton Fabrics</li>
              <li>Synthetic Fabrics</li>
              <li>Ladies' Garments</li>
              <li>Linens</li>
              <li>Terry Toweling</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold-400 font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gold-400 mt-1 flex-shrink-0" />
                <span className="text-navy-300 text-sm">
                  Sinfini Marketing FZC<br />
                  Sharjah, United Arab Emirates
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gold-400 flex-shrink-0" />
                <span className="text-navy-300 text-sm">+971 XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gold-400 flex-shrink-0" />
                <span className="text-navy-300 text-sm">info@sinfinimarketing.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-8 pt-8 text-center">
          <p className="text-navy-400 text-sm">
            © {currentYear} Sinfini Marketing FZC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
