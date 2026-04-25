import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const uploadDocument = (formData) => {
  return API.post("/upload", formData);
};

export const askQuestion = ({ question, chatId }) => {
  const requestData = { question, chatId };
  console.log("Sending request:", requestData);
  return API.post("/query", requestData);
};

export const loginUser = (payload) => API.post("/auth/login", payload);
export const registerUser = (payload) => API.post("/auth/register", payload);

export const getStatus = (trialId) =>
  API.get(`/status/${trialId}`);

export default API;