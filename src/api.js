import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

console.log("API base URL:", process.env.REACT_APP_API_URL);

export const uploadDocument = (formData) =>
  API.post("/upload", formData);

export const askQuestion = (question) =>
  API.post("/query", { question });

export const getStatus = (trialId) =>
  API.get(`/status/${trialId}`);

export default API; 