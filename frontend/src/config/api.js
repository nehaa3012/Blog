// frontend/src/config/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
});

// For file uploads (don't manually set content-type)
API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if(config.headers && config.headers["Content-Type"]){
    delete config.headers["Content-Type"];
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
