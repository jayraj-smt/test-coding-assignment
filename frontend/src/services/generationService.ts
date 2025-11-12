import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Generation {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: string;
  status: string;
}

export const generationService = {
  async createGeneration(
    prompt: string,
    style: string,
    imageFile: File,
    signal?: AbortSignal
  ): Promise<Generation> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    formData.append('image', imageFile);

    const response = await axios.post(`${API_URL}/generations`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });

    return response.data;
  },

  async getRecentGenerations(limit: number = 5): Promise<Generation[]> {
    const response = await axios.get(`${API_URL}/generations`, {
      params: { limit },
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
