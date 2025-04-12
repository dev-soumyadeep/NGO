import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Replace with your backend URL

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
}

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data; // Assuming the backend returns { success: true, token, user: {...} }
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Failed to log in');
  }
};