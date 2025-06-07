import { Category,Item,PurchaseHistory } from '@/types'; // Import the Category type
import axios from 'axios';
// const API_BASE_URL = `http://localhost:5000/api/inventory`; 
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/inventory`;  

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
    category: { id: string; name: string; description?: string },
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
  
      if (response.ok) {
        const result = await response.json(); // Assuming the backend returns { success: true, data: {...} }
        return result.data as Category; // Extract and return the `data` field as a `Category`
      }
    } catch (error) {
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
    item: { id: string; name: string; description?: string; quantity: number; price: number; total_amount: number; category_id: string },
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
      const result = await response.json(); 
      if (response.ok) {
        if(result.success){ 
          return result.data as Item; // Extract and return the `data` field as an `Item`
        }
        else{
          throw new Error(result.message);
        }
      }
      else{
        throw new Error(result.message);
      }
    } catch (error) {
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
    updates: { quantityChange: number; newprice: number;description?: string },
    authToken: string
  ): Promise<{ data?: Item; message?: string }>=> {
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
      if(result.data){
        return {data:result.data}
      }
      else{
        return {message:result.message}
      }
    } catch (error) {
      console.error('Error updating item stock:', error.message);
      throw new Error(error.message || 'Failed to update item stock');
    }
  };


  export const deleteItemStock = async(id:string,authToken:string)=>{
    try {
      const response = await fetch(`${API_BASE_URL}/items/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete item stock');
      }
      const result = await response.json(); // Assuming the backend returns { success: true, message: '...' }
      return result.message; // Extract and return the `message` field
    } catch (error) {
      console.error('Error deleting item stock:', error.message);
      throw new Error(error.message || 'Failed to delete item stock');
    }
  };
  
  export const createSchoolItem = async (
    schoolId: string,
    itemId: string,
    name: string,
    quantity: number,
    price: number
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/school-item/add`, {
        schoolId,
        itemId,
        name,
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
    name: string,
    quantity: number,
    price: number
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/school-item/update/${name}`,
        { quantity, price }
      );
      return response.data.data; // returns the updated SchoolItem
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update school item stock'
      );
    }
  };


  
export interface PurchaseHistoryFilters {
  startDate?: string;
  endDate?: string;
  studentId?: string;
  itemName?: string;
  schoolId?: string;
}

export async function fetchFilteredPurchaseHistory(filters: PurchaseHistoryFilters): Promise<PurchaseHistory[]> {
  const params: Record<string, string> = {};

  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.studentId) params.studentId = filters.studentId;
  if (filters.itemName) params.itemName = filters.itemName;
  if (filters.schoolId) params.schoolId = filters.schoolId;

  const response = await axios.get<PurchaseHistory[]>(`${API_BASE_URL}/purchase-history/filter`, { params });
  return response.data;
}