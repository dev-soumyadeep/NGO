import axios from "axios";
import { School } from "@/types";

// const API_BASE_URL = `http://localhost:5000/api/school`;
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/school`;

export const getSchools = async (): Promise<School[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`);
    console.log("Fetched schools:", response.data.schools);
    return response.data.schools; // Assuming the backend returns { success: true, schools: [...] }
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch schools");
  }
};

export const updateSchool = async (
  id: string,
  updatedData: Partial<School>,
  token: string
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/update/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating school:", error);
    throw new Error(error.response?.data?.message || "Failed to update school");
  }
};

export const getSchool = async (id: string): Promise<School> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.school; // Assuming the backend returns { success: true, school: {...} }
  } catch (error) {
    console.error("Error fetching school:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch school");
  }
};

export const createSchool = async (
  schoolData: Omit<School, "createdAt" | "updatedAt" | "numberOfStudents">, // Exclude createdAt, updatedAt, and numberOfStudents from the input
  token: string
): Promise<School> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, schoolData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    return response.data.school; // Assuming the backend returns { success: true, school: {...} }
  } catch (error) {
    console.error("Error creating school:", error);
    throw new Error(error.response?.data?.message || "Failed to create school");
  }
};

export const deleteSchool = async (
  schoolId: string,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authentication
      },
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    throw new Error(error.response?.data?.message || "Failed to delete school");
  }
};

// Service to get a school by its ID
export const getSchoolById = async (id: string): Promise<School> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    // Assuming backend returns { message: "...", school: {...} }
    return response.data.school;
  } catch (error) {
    console.error("Error fetching school:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch school");
  }
};

export const getSchoolNameById = async (id: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/name/${id}`);
    return response.data.schoolName;
  } catch (error) {
    console.error("Error fetching school name:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch school name"
    );
  }
};
