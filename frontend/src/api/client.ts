import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const response = await apiClient.get('/articles');
    console.log(response);
    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.error) {
      throw new Error(response.data.error);
    }
    return [];
  },

  getById: async (id: number): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  },
};

export default apiClient;
