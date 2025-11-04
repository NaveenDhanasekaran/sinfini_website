import React from 'react';
import { Target, Eye, Heart, Award, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200"
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-gold-300">
              Excellence in Textile Exports Since Inception
            </p>
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Sinfini Marketing FZC
              </h2>
              <div className="w-24 h-1 bg-gold-500 mb-6"></div>
              <p className="text-lg text-navy-700 mb-4">
                Based in Sharjah, United Arab Emirates, Sinfini Marketing FZC is a leading textile export company specializing in premium cotton and synthetic ladies' fabrics, garments, linens, and terry toweling products.
              </p>
              <p className="text-lg text-navy-700 mb-4">
                We serve international markets across Asia, Africa, and Europe, delivering excellence in quality and service. Our commitment to customer satisfaction and product excellence has made us a trusted partner in the global textile industry.
              </p>
              <p className="text-lg text-navy-700">
                With a focus on innovation and sustainability, we continue to expand our product range and market reach, ensuring our clients receive the best textiles at competitive prices.
              </p>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800"
                alt="Company"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl mb-6">
                <Target className="text-gold-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Mission</h3>
              <p className="text-navy-700">
                To provide premium quality textiles to our global partners while maintaining the highest standards of service, reliability, and innovation in the industry.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl mb-6">
                <Eye className="text-gold-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Vision</h3>
              <p className="text-navy-700">
                To be the leading textile export company in the Middle East, recognized globally for quality, innovation, and sustainable business practices.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl mb-6">
                <Heart className="text-gold-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Values</h3>
              <p className="text-navy-700">
                Integrity, quality, customer satisfaction, innovation, and sustainability guide every decision we make and every product we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What Sets Us Apart</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Quality Assurance',
                description: 'Every product undergoes rigorous quality checks to ensure excellence.',
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Our experienced professionals are dedicated to serving your needs.',
              },
              {
                icon: Globe,
                title: 'Global Network',
                description: 'Strong presence across Asia, Africa, and Europe with reliable logistics.',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full mb-6">
                  <feature.icon className="text-white" size={36} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                <p className="text-navy-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '50+', label: 'Countries Served' },
              { number: '1000+', label: 'Happy Clients' },
              { number: '100%', label: 'Quality Products' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold text-gold-400 mb-2">{stat.number}</div>
                <div className="text-navy-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
