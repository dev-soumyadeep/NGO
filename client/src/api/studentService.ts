import axios from 'axios';
import { Student } from '@/types';

// const API_BASE_URL = `http://localhost:5000/api/student`;
// const ALUMNI_BASE_URL = `http://localhost:5000/api/alumni`;
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/student`;
const ALUMNI_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/alumni`;

export const getStudentsBySchool = async (schoolId: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/${schoolId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  return response.data.data;
};

export const addStudent = async (schoolId: string, student: Omit<Student, 'id'>, token: string) => {
  try{
    const response = await axios.post(`${API_BASE_URL}/${schoolId}/add`, student, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }catch(error){
    throw new Error(error.response?.data?.message || 'Failed to add student');
  }

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

  export const checkStudentIdExists = async (studentId: string, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/exists/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  };



export const findStudentByStudentId = async (studentId: string, token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  try {
    const response = await axios.get(`${API_BASE_URL}/get-student/${studentId}`, config);
    return response.data.data || response.data.student || response.data;
  } catch (error) {
    console.error('Error fetching student by studentId:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch student');
  }
};

export const updateStudentDetails = async (studentId: string, updateStudent: Student) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${studentId}`, updateStudent);
    return response.data;
  } catch (error) {
    // Optionally handle or rethrow error for UI to display
    throw error.response?.data || { success: false, message: 'Network or server error' };
  }
};

export const getAlumniList = async (token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  try {
    const response = await axios.get(`${ALUMNI_BASE_URL}/list`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching alumni list:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch alumni list');
  }
};

export const deleteAlumni = async (alumniId: string, token: string): Promise<void> => {
  await axios.delete(`${ALUMNI_BASE_URL}/${alumniId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const addAlumniFromStudentId = async (studentId: string, token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;

  // 1. Fetch student by ID
  let student;
  try {
    const response = await axios.get(`${API_BASE_URL}/get-student/${studentId}`, config);
    student = response.data.data || response.data.student || response.data;
  } catch (error) {
    console.error('Error fetching student by studentId:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch student');
  }

  // 2. Transform ID
  console.log(student)
  if (!student.id.startsWith('STU-')) {
    throw new Error('Student ID does not start with STU-');
  }
  const alumni = {
    ...student,
    id: student.id.replace(/^STU-/, 'ALU-'),
    dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
    dateOfAdmission: new Date(student.dateOfAdmission).toISOString().split('T')[0]
  };

  // 3. Add alumni via backend controller
  try {
    const response = await axios.post(`${ALUMNI_BASE_URL}/add`, alumni, config);
    return response.data;
  } catch (error) {
    console.error('Error adding alumni:', error);
    throw new Error(error.response?.data?.message || 'Failed to add alumni');
  }
};





