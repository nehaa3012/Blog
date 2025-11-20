// frontend/src/config/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-backend-njkp.onrender.com", 
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
});

// For file uploads (don't manually set content-type)
API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export default API;
