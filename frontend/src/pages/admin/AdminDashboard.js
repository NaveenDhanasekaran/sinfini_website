import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getDashboardStats } from '../../utils/api';
import { Package, FileText, Image, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    blog_posts: 0,
    gallery_items: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Package,
      label: 'Products',
      value: stats.products,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FileText,
      label: 'Blog Posts',
      value: stats.blog_posts,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Image,
      label: 'Gallery Items',
      value: stats.gallery_items,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Total Content',
      value: stats.products + stats.blog_posts + stats.gallery_items,
      color: 'from-gold-500 to-gold-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Sinfini Admin</h2>
          <p className="text-navy-300">Manage your website content from this dashboard</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${card.color} p-6`}>
                  <card.icon className="text-white" size={40} />
                </div>
                <div className="p-6">
                  <div className="text-3xl font-bold text-navy-900 mb-2">
                    {card.value}
                  </div>
                  <div className="text-navy-600">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/products"
              className="p-4 border-2 border-navy-200 rounded-lg hover:border-navy-900 hover:bg-navy-50 transition-all text-center"
            >
              <Package className="mx-auto mb-2 text-navy-700" size={32} />
              <div className="font-semibold text-navy-900">Manage Products</div>
            </a>
            <a
              href="/admin/blog"
              className="p-4 border-2 border-navy-200 rounded-lg hover:border-navy-900 hover:bg-navy-50 transition-all text-center"
            >
              <FileText className="mx-auto mb-2 text-navy-700" size={32} />
              <div className="font-semibold text-navy-900">Manage Blog</div>
            </a>
            <a
              href="/admin/gallery"
              className="p-4 border-2 border-navy-200 rounded-lg hover:border-navy-900 hover:bg-navy-50 transition-all text-center"
            >
              <Image className="mx-auto mb-2 text-navy-700" size={32} />
              <div className="font-semibold text-navy-900">Manage Gallery</div>
            </a>
            <a
              href="/admin/chatbot"
              className="p-4 border-2 border-navy-200 rounded-lg hover:border-navy-900 hover:bg-navy-50 transition-all text-center"
            >
              <TrendingUp className="mx-auto mb-2 text-navy-700" size={32} />
              <div className="font-semibold text-navy-900">Chatbot Settings</div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
