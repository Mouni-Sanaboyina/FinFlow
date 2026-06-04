import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const startSession = () => API.post('/chat/start');

export const sendMessage = (sessionId, message) =>
  API.post('/chat', { sessionId, message });