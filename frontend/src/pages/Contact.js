import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitContactForm } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
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
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gold-300">
              Get in touch with our team
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Send us a Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Thank you for contacting us! We'll get back to you soon.
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="+971 XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-navy-100 p-3 rounded-lg">
                    <MapPin className="text-navy-900" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Address</h3>
                    <p className="text-navy-600">
                      Sinfini Marketing FZC<br />
                      Sharjah, United Arab Emirates
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-navy-100 p-3 rounded-lg">
                    <Phone className="text-navy-900" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Phone</h3>
                    <p className="text-navy-600">+971 XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-navy-100 p-3 rounded-lg">
                    <Mail className="text-navy-900" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Email</h3>
                    <p className="text-navy-600">info@sinfinimarketing.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-navy-100 p-3 rounded-lg">
                    <Clock className="text-navy-900" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Business Hours</h3>
                    <p className="text-navy-600">
                      Sunday - Thursday: 9:00 AM - 6:00 PM<br />
                      Friday - Saturday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-xl overflow-hidden shadow-lg h-64">
                <iframe
                  title="Sinfini Marketing Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115681.01917494753!2d55.28834835!3d25.3462784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5fc9c1b7c46f%3A0xb9b77b3c9c7ff01b!2sSharjah%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
