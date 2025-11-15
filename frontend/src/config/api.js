// frontend/src/config/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    // Don't set Content-Type here - let the browser set it with the correct boundary
  }
});

// Add request interceptor to handle file uploads
API.interceptors.request.use((config) => {
  // Don't set content type for FormData - let the browser set it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default API;