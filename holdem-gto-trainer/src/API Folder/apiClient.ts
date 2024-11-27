// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.openai.com/v1', // OpenAI's base URL
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Accessing the key here
  },
});

export default apiClient;
