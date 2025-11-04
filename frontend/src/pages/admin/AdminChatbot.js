import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getChatbotSettings, updateChatbotSettings } from '../../utils/api';
import { Plus, Trash2, Save } from 'lucide-react';

const AdminChatbot = () => {
  const [settings, setSettings] = useState({
    greeting: '',
    faqs: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await getChatbotSettings();
      const faqs = JSON.parse(response.data.faqs || '[]');
      setSettings({
        greeting: response.data.greeting || '',
        faqs: faqs,
      });
    } catch (error) {
      console.error('Failed to load chatbot settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = () => {
    setSettings({
      ...settings,
      faqs: [
        ...settings.faqs,
        {
          question: '',
          answer: '',
          keywords: [],
        },
      ],
    });
  };

  const handleRemoveFAQ = (index) => {
    const newFaqs = settings.faqs.filter((_, i) => i !== index);
    setSettings({ ...settings, faqs: newFaqs });
  };

  const handleFAQChange = (index, field, value) => {
    const newFaqs = [...settings.faqs];
    if (field === 'keywords') {
      newFaqs[index][field] = value.split(',').map(k => k.trim()).filter(k => k);
    } else {
      newFaqs[index][field] = value;
    }
    setSettings({ ...settings, faqs: newFaqs });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateChatbotSettings({
        greeting: settings.greeting,
        faqs: settings.faqs,
      });
      alert('Chatbot settings saved successfully!');
    } catch (error) {
      console.error('Failed to save chatbot settings:', error);
      alert('Failed to save chatbot settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy-900">Chatbot Settings</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
          </div>
        ) : (
          <>
            {/* Greeting Message */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Greeting Message</h3>
              <textarea
                value={settings.greeting}
                onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                placeholder="Enter the chatbot greeting message..."
              />
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy-900">Frequently Asked Questions</h3>
                <button
                  onClick={handleAddFAQ}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  <span>Add FAQ</span>
                </button>
              </div>

              {settings.faqs.length > 0 ? (
                <div className="space-y-6">
                  {settings.faqs.map((faq, index) => (
                    <div key={index} className="border border-navy-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-navy-900">FAQ #{index + 1}</h4>
                        <button
                          onClick={() => handleRemoveFAQ(index)}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Question
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                            className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                            placeholder="What is your question?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                            placeholder="Enter the answer..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Keywords (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={faq.keywords.join(', ')}
                            onChange={(e) => handleFAQChange(index, 'keywords', e.target.value)}
                            className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-900"
                            placeholder="products, fabrics, textile"
                          />
                          <p className="text-xs text-navy-600 mt-1">
                            These keywords help the chatbot match user questions
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-navy-600">No FAQs yet. Add your first FAQ to help users!</p>
                </div>
              )}
            </div>

            {/* Save Button (bottom) */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChatbot;
