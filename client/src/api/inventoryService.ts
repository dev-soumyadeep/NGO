import { Category,Item } from '@/types'; // Import the Category type
import axios from 'axios';
const API_BASE_URL = `http://localhost:5000/api/inventory`; 
// const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/inventory`;  

export const getCategoryList = async (authToken: string): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/list`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: [...] }
      return result.data as Category[]; // Extract and return the `data` field as a list of categories
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw new Error(error.message || 'Failed to fetch categories');
    }
};

export const addInventory = async (
    category: { name: string; description?: string },
    authToken: string
  ): Promise<Category> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(category), // Send the category object in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to add inventory');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: {...} }
      return result.data as Category; // Extract and return the `data` field as a `Category`
    } catch (error) {
      console.error('Error adding inventory:', error.message);
      throw new Error(error.message || 'Failed to add inventory');
    }
  };



export const getCategoryById = async (id: string, authToken: string): Promise<Category> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch category by ID');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: {...} }
      return result.data as Category; // Extract and return the `data` field as a `Category`
    } catch (error) {
      console.error('Error fetching category by ID:', error.message);
      throw new Error(error.message || 'Failed to fetch category by ID');
    }
  };

  export const removeCategory = async (id: string, authToken: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove category');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, message: '...' }
      return result.message; // Extract and return the `message` field
    } catch (error) {
      console.error('Error removing category:', error.message);
      throw new Error(error.message || 'Failed to remove category');
    }
  };



  export const addItem = async (
    item: { name: string; description?: string; quantity: number; price: number; category_id: string },
    authToken: string
  ): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(item), // Send the item object in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: {...} }
      return result.data as Item; // Extract and return the `data` field as an `Item`
    } catch (error) {
      console.error('Error adding item:', error.message);
      throw new Error(error.message || 'Failed to add item');
    }
  };

  export const getItemsByCategoryId = async (categoryId: string, authToken: string): Promise<Item[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/category/${categoryId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch items for the category');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: [...] }
      return result.data as Item[]; // Extract and return the `data` field as a list of items
    } catch (error) {
      console.error('Error fetching items by category:', error);
      throw new Error(error.message || 'Failed to fetch items for the category');
    }
  };

  export const updateItemStock = async (
    id: string,
    updates: { quantity: number; price: number },
    authToken: string
  ): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(updates), // Send the updates object in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update item stock');
      }
  
      const result = await response.json(); // Assuming the backend returns { success: true, data: {...} }
      return result.data as Item; // Extract and return the `data` field as an `Item`
    } catch (error) {
      console.error('Error updating item stock:', error.message);
      throw new Error(error.message || 'Failed to update item stock');
    }
  };


  export const createSchoolItem = async (
    schoolId: string,
    itemId: string,
    quantity: number,
    price: number
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/school-item/add`, {
        schoolId,
        itemId,
        quantity,
        price,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create school item'
      );
    }
  };

  export const getSchoolItemsBySchoolId = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/school-item/${id}`);
      return response.data.data; // assuming the backend returns { success, data }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch school items'
      );
    }
  };

  export const updateSchoolItemStock = async (
    id: string,
    quantity: number,
    price: number
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/school-item/update/${id}`,
        { quantity, price }
      );
      return response.data.data; // returns the updated SchoolItem
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update school item stock'
      );
    }
  };