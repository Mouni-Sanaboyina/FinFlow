import axios from 'axios';

const API = axios.create({
  baseURL: 'https://finflow-production-0ead.up.railway.app/api',
});

export const startSession = () => API.post('/chat/start');

export const sendMessage = (sessionId, message) =>
  API.post('/chat', { sessionId, message });
