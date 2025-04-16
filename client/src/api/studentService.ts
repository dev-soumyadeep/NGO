import axios from 'axios';
import { Student } from '@/types';

// const API_BASE_URL = `http://localhost:5000/api/student`;
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/student`;

export const getStudentsBySchool = async (schoolId: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/${schoolId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  return response.data.data;
};

export const addStudent = async (schoolId: string, student: Student, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/${schoolId}/add`, student, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  return response.data.data;
};

export const getTotalStudents = async (): Promise<number> => {
    const response = await axios.get(`${API_BASE_URL}/total`);
    return response.data.total;
  };

export const deleteStudent = async (studentId: string, token: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const batchDeleteStudentsBySchool = async (schoolId: string, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/batch-delete/${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
  };