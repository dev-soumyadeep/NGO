import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiPlus, FiTrash2 } from 'react-icons/fi'; // Import icons
import { Category } from '@/types'; // Import the updated Category type
import { addInventory, getCategoryList,removeCategory } from '@/api/inventoryService';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

const CentralInventory: React.FC = () => {
  const { state } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]); // Use Category type for categories state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState(''); // New state for description
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to handle loading for API calls
  const navigate = useNavigate();

  useEffect(() => {
    console.log(state.token); // Log the token to check if it's available
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getCategoryList(state.token); // Call the service with the token
        setCategories(fetchedCategories); // Update the categories state
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [state.isAuthenticated, state.user, navigate, state.token]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      setLoading(true);
      const newCategory = await addInventory(
        {name:categoryName.trim().toUpperCase(),description: categoryDescription},
        state.token
      );
      setCategories((prev) => [...prev, newCategory]); // Add the new category to the state
      setCategoryName(''); // Clear the input field
      setCategoryDescription(''); // Clear the description field
    } catch (error) {
      console.error('Error adding category:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (id: string | undefined) => {
    if (id) {
      navigate(`/central-inventory/${id}`);
    }
  };

  const handleRemoveCategory = (id: string | undefined) => {
    if (id) {
      setSelectedCategoryId(id);
      setShowConfirmation(true); // Show the confirmation dialog
    }
  };


  const confirmRemoveCategory = async () => {
    if (selectedCategoryId) {
      try {
        setLoading(true);
        await removeCategory(selectedCategoryId, state.token); // Call the removeCategory service
        setCategories((prev) => prev.filter((category) => category._id !== selectedCategoryId)); // Remove the category from the state
        setSelectedCategoryId(null);
        setShowConfirmation(false); // Hide the confirmation dialog
      } catch (error) {
        console.error('Error removing category:', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelRemoveCategory = () => {
    setSelectedCategoryId(null);
    setShowConfirmation(false); // Hide the confirmation dialog
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-brand-indigo mb-6">Central Inventory</h1>

        {/* Add Category Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Categories</h2>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1"
              disabled={loading} // Disable input while loading
            />
            <Input
              type="text"
              placeholder="Enter category description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="flex-1"
              disabled={loading} // Disable input while loading
            />
            <Button
              onClick={handleAddCategory}
              className="bg-brand-indigo text-white flex items-center space-x-2"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <span>Loading...</span> // Show loading text while API call is in progress
              ) : (
                <>
                  <FiPlus className="w-5 h-5" /> {/* Plus icon */}
                  <span>Add Category</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <span className="text-gray-500">Category-ID: {category._id}</span>
                <span className="text-gray-500">
                  Created At: {new Date(category.createdAt || '').toLocaleDateString()}
                </span>
                <div className="flex justify-between items-center">
                  <FiTrash2
                    className="text-red-500 w-6 h-6 cursor-pointer"
                    onClick={() => handleRemoveCategory(category._id)}
                  />
                  <FiArrowRight
                    className="text-brand-indigo w-6 h-6 cursor-pointer"
                    onClick={() => handleNavigate(category._id)} // Navigate to /inventory/{categoryId}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <p className="text-gray-700 text-center mb-6">
                Removing this category will remove all the items from the central inventory. Are you sure you want to
                proceed?
              </p>
              <div className="flex justify-end space-x-4">
                <Button onClick={cancelRemoveCategory} className="bg-gray-300 text-gray-700">
                  Cancel
                </Button>
                <Button onClick={confirmRemoveCategory} className="bg-red-500 text-white">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CentralInventory;