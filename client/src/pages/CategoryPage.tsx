import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddItemForm from '@/components/AddItemForm';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Category, Item } from '../types/index'; 
import { getCategoryById, addItem,getItemsByCategoryId,updateItemStock,createSchoolItem } from '@/api/inventoryService'; 
import { FiArrowLeft } from 'react-icons/fi';

const CategoryPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Extract categoryId from the URL
  const [category, setCategory] = useState<Category | null>(null); // Use Category interface for category details
  const [items, setItems] = useState<Item[]>([]); // Use Item interface for items
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
  
      if (id) {
        const fetchedCategory = await getCategoryById(id, state.token);
        setCategory(fetchedCategory);
  
        const fetchedItems = await getItemsByCategoryId(id, state.token);
        setItems(fetchedItems);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      setCategory(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
  
    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }
  
    fetchCategoryDetails();
  }, [id, state.isAuthenticated, state.user, navigate, state.token]);

  const handleAddItem = async (newItem: { name: string; quantity: number; price: number; description?: string }) => {
    if (!id) return; // Ensure category ID is available
    try {
      setLoading(true);
      setError(null);

      // Call the addItem service
      const addedItem = await addItem(
        {
          name: newItem.name,
          description: newItem.description,
          quantity: newItem.quantity,
          price: newItem.price,
          category_id: id, // Use the current category ID
        },
        state.token
      );

      // Add the new item to the items state
      setItems((prev) => [...prev, addedItem]);

      // Update total investment in the category
      if (category) {
        setCategory((prev) => ({
          ...prev!,
          totalInvestment: prev!.totalInvestment! + addedItem.price * addedItem.quantity,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId: string, quantityChange: number, upgradedPrice: number) => {
    try {
      setLoading(true);
      setError(null);

      // Call the updateItemStock service
      const updatedItem = await updateItemStock(
        itemId,
        { quantity: quantityChange, price: upgradedPrice },
        state.token
      );

      // Update the items state with the updated item
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? {
                ...item,
                quantity: updatedItem.quantity,
                price: updatedItem.price,
                updatedAt: updatedItem.updatedAt, // Update the last updated timestamp
              }
            : item
        )
      );

      // Optionally, update the total investment in the category
      if (category) {
        const totalInvestment = items.reduce(
          (sum, item) =>
            item._id === itemId
              ? sum + updatedItem.price * updatedItem.quantity
              : sum + item.price * item.quantity,
          0
        );
        setCategory((prev) => ({
          ...prev!,
          totalInvestment,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleSendItem = async (
    schoolId: string,
    itemId: string,
    quantity: number,
    price: number
  ) => {
    try {
      await createSchoolItem(schoolId, itemId, quantity, price);
      const item = items.find((i) => i._id === itemId);
      if (!item) throw new Error('Item not found in inventory');
      const leftoverQuantity = item.quantity - quantity;
      const leftoverPrice = item.price - price;
      await updateItemStock(itemId, { quantity: leftoverQuantity, price: leftoverPrice }, state.token);
  
      // Refresh the list after update
      await fetchCategoryDetails();
  
      console.log('Item sent and stock updated successfully!');
    } catch (error) {
      console.log(error.message || 'Failed to send item and update stock');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        {/* Display Category Name and ID */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/inventory')}
              className="flex items-center text-gray-700 hover:text-brand-indigo"
            >
              <FiArrowLeft className="mr-2 w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold text-brand-indigo">{category?.name}</h1>
          </div>
          <p className="text-gray-600 text-lg">Category ID: {category?._id}</p>
          <p className="text-gray-600 text-lg">Description: {category?.description || 'No description available'}</p>
          <p className="text-gray-600 text-lg">
            Created At: {category?.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="flex space-x-8">
          {/* Add Item Form */}
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add or Update Items</h2>
            <AddItemForm onAddItem={handleAddItem} onUpdateStock={handleUpdateStock} onSendItem={handleSendItem} items={items} />
          </div>

          {/* Items Section */}
          <div className="flex-1">
            {/* Items List */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Items List</h2>
              {items.length === 0 ? (
                <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
                  No items available. Add items to see them here.
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="p-4 text-left">Date Added</th>
                        <th className="p-4 text-left">Item Name</th>
                        <th className="p-4 text-left">Quantity</th>
                        <th className="p-4 text-left">Price</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-left">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id} className="border-t">
                          <td className="p-4">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                          <td className="p-4">{item.name}</td>
                          <td className="p-4">{item.quantity}</td>
                          <td className="p-4">₹{item.price}</td>
                          <td className="p-4">{item.description}</td>
                          <td className="p-4">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Not updated yet'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;