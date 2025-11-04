import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (username, password) => 
  api.post('/auth/login', { username, password });

export const verifyToken = () => 
  api.get('/auth/verify');

// Products APIs
export const getProducts = () => 
  api.get('/products');

export const getProduct = (id) => 
  api.get(`/products/${id}`);

export const createProduct = (formData) => 
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateProduct = (id, formData) => 
  api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteProduct = (id) => 
  api.delete(`/products/${id}`);

// Blog APIs
export const getBlogPosts = () => 
  api.get('/blog');

export const getBlogPost = (id) => 
  api.get(`/blog/${id}`);

export const createBlogPost = (formData) => 
  api.post('/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateBlogPost = (id, formData) => 
  api.put(`/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteBlogPost = (id) => 
  api.delete(`/blog/${id}`);

// Gallery APIs
export const getGalleryItems = () => 
  api.get('/gallery');

export const createGalleryItem = (formData) => 
  api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteGalleryItem = (id) => 
  api.delete(`/gallery/${id}`);

// Chatbot APIs
export const getChatbotSettings = () => 
  api.get('/chatbot/settings');

export const updateChatbotSettings = (data) => 
  api.put('/chatbot/settings', data);

export const sendChatMessage = (message) => 
  api.post('/chatbot/message', { message });

// Dashboard APIs
export const getDashboardStats = () => 
  api.get('/dashboard/stats');

// Contact Form API
export const submitContactForm = (data) => 
  api.post('/contact', data);

export default api;
