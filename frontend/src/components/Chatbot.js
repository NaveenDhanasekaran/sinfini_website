import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getChatbotSettings, sendChatMessage } from '../utils/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatbotSettings();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatbotSettings = async () => {
    try {
      const response = await getChatbotSettings();
      setGreeting(response.data.greeting || 'Hello! How can I help you today?');
      if (response.data.greeting) {
        setMessages([{
          type: 'bot',
          text: response.data.greeting,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to load chatbot settings:', error);
      setGreeting('Hello! How can I help you today?');
      setMessages([{
        type: 'bot',
        text: 'Hello! How can I help you today?',
        timestamp: new Date()
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(input);
      const botMessage = {
        type: 'bot',
        text: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-navy-900 to-navy-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-navy-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-700 text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold text-lg">Sinfini Support</h3>
            <p className="text-sm text-navy-200">We're here to help!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-navy-900 text-white rounded-br-none'
                      : 'bg-white text-navy-900 border border-navy-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-navy-200 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-navy-900 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-navy-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-navy-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-navy-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-navy-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-navy-900 text-white p-2 rounded-lg hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
