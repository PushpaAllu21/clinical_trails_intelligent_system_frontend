import axios from "axios";

// Get the API URL from environment or use a fallback
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log("🔌 API Configuration:", {
  baseURL: API_URL,
  environment: process.env.NODE_ENV,
  withCredentials: true
});

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // 15 second timeout
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`, {
    headers: config.headers,
    timeout: config.timeout
  });
  
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/';
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network Error Details:', {
        message: error.message,
        type: error.code,
        isTimeout: error.code === 'ECONNABORTED',
        isNetworkError: !error.response && error.message === 'Network Error'
      });
    }

    return Promise.reject(error);
  }
);

export const uploadDocument = (formData) => {
  return API.post("/upload", formData);
};

export const askQuestion = ({ question, chatId }) => {
  const requestData = { question, chatId };
  console.log("Sending request:", requestData);
  return API.post("/query", requestData);
};

export const loginUser = (payload) => {
  console.log("🔐 Logging in user:", payload.email);
  return API.post("/auth/login", payload);
};

export const registerUser = (payload) => {
  console.log("📝 Registering user:", payload.email);
  return API.post("/auth/register", payload);
};

export const getStatus = (trialId) =>
  API.get(`/status/${trialId}`);

export default API;