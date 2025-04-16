import axios from 'axios';
import { School } from '@/types';

// const API_BASE_URL = `http://localhost:5000/api/school`; 
const API_BASE_URL = `${process.env.BACKEND_API_URL}/api/school`; 

export const getSchools = async (): Promise<School[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data.schools; // Assuming the backend returns { success: true, schools: [...] }
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch schools');
  }
};

export const getSchool = async (id: string): Promise<School> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.school; // Assuming the backend returns { success: true, school: {...} }
  } catch (error) {
    console.error('Error fetching school:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch school');
  }
};

export const createSchool = async (
  schoolData: Omit<School, '_id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<School> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add`,
      schoolData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
    );
    return response.data.school; // Assuming the backend returns { success: true, school: {...} }
  } catch (error) {
    console.error('Error creating school:', error);
    throw new Error(error.response?.data?.message || 'Failed to create school');
  }
};

export const deleteSchool = async (schoolId: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authentication
      },
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete school');
  }
};