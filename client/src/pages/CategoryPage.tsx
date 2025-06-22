import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddItemForm from "@/components/AddItemForm";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Category, Item } from "../types/index";
import {
  getCategoryById,
  addItem,
  getItemsByCategoryId,
  updateItemStock,
  createSchoolItem,
  deleteItemStock,
} from "@/api/inventoryService";
import { addTransaction } from "@/api/financialService";
import { FiArrowLeft } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { FiTrash } from "react-icons/fi";
import LoginPage from "./LoginPage";
const CategoryPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
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
      setError(err.message || "An error occurred");
      setCategory(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (state.user?.role !== "admin") {
      navigate("/");
      return;
    }

    fetchCategoryDetails();
  }, [id, state.isAuthenticated, state.user, navigate, state.token]);

  const handleAddItem = async (newItem: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total_amount: number;
    description?: string;
  }) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      console.log(newItem);
      const addedItem = await addItem(
        {
          id: newItem.id,
          name: newItem.name,
          description: newItem.description,
          quantity: newItem.quantity,
          price: newItem.price,
          total_amount: newItem.total_amount,
          category_id: id,
        },
        state.token
      );
      await addTransaction(
        {
          date: new Date().toISOString().slice(0, 10),
          type: "expense",
          category: "consumables",
          itemName: newItem.name,
          quantity: Number(newItem.quantity),
          price: Number(newItem.price),
          amount: Number(newItem.total_amount),
          description: "Item added to Central Inventory",
        },
        state.token
      );

      setItems((prev) => [...prev, addedItem]);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (
    itemId: string,
    quantityChange: number,
    newprice: number,
    description: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Call the updateItemStock service
      const response = await updateItemStock(
        itemId,
        { quantityChange, newprice, description },
        state.token
      );
      if ("data" in response) {
        const updatedItem = response.data;
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? updatedItem : item))
        );
      } else if (
        "message" in response &&
        response.message.includes("deleted")
      ) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "info",
          description: "Quantity is zero. Item has been removed from the list.",
          variant: "default",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleSendItem = async (
    schoolId: string,
    itemId: string,
    name: string,
    quantity: number,
    price: number
  ) => {
    try {
      const res = await createSchoolItem(
        schoolId,
        itemId,
        name,
        quantity,
        price
      );
      console.log(res);
      const item = items.find((i) => i.id === itemId);
      if (!item) throw new Error("Item not found in inventory");
      const response = await updateItemStock(
        itemId,
        { quantityChange: -quantity, newprice: item.price },
        state.token
      );
      console.log(response);
      if ("data" in response) {
        const updatedItem = response.data;
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? updatedItem : item))
        );
      } else if (
        "message" in response &&
        response.message.includes("deleted")
      ) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "info",
          description: "Quantity is zero. Item has been removed from the list.",
          variant: "default",
        });
      }

      console.log("Item sent and stock updated successfully!");
    } catch (error) {
      console.log(error.message || "Failed to send item and update stock");
    }
  };

  // Add this handler in your CategoryPage component
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItemStock(itemId, state.token);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({
        title: "Deleted",
        description: "Item deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-red-500">{error}</div>
    );
  }
  function formatDateTime(dateStr?: string | Date) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        {/* Display Category Name and ID */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/inventory")}
              className="flex items-center text-gray-700 hover:text-brand-indigo"
            >
              <FiArrowLeft className="mr-2 w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold text-brand-indigo">
              {category?.name}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Category ID: {category?.id}</p>
          <p className="text-gray-600 text-lg">
            Description: {category?.description || "No description available"}
          </p>
          <p className="text-gray-600 text-lg">
            Created At:{" "}
            {category?.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="flex space-x-8">
          {/* Add Item Form */}
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Add or Update Items
            </h2>
            <AddItemForm
              onAddItem={handleAddItem}
              onUpdateStock={handleUpdateStock}
              onSendItem={handleSendItem}
              items={items}
            />
          </div>

          {/* Items Section */}
          <div className="flex-1">
            {/* Items List */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Items List
              </h2>
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
                        <th className="p-4 text-left">Total Amount</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-left">Last Updated</th>
                        <th className="p-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-4">
                            {formatDateTime(item.createdAt)}
                          </td>
                          <td className="p-4">{item.name}</td>
                          <td className="p-4">{item.quantity}</td>
                          <td className="p-4">₹{item.price}</td>
                          <td className="p-4">₹{item.total_amount}</td>
                          <td className="p-4">{item.description}</td>
                          <td className="p-4">
                            {formatDateTime(item.updatedAt)}
                          </td>
                          <td>
                            <button
                              className="p-2 rounded hover:bg-red-100"
                              onClick={() => handleDeleteItem(item.id)}
                              title="Delete"
                            >
                              <FiTrash className="text-red-500 w-5 h-5" />
                            </button>
                          </td>
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
