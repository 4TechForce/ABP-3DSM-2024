import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Substitua pelo endereço do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateUser = async (userData, userId) => {
  try {
    const response = await api.put(`/profile/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro de conexão');
  }
};
