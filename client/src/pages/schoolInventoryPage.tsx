import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSchoolItemsBySchoolId, updateSchoolItemStock } from '@/api/inventoryService';
import { addTransaction } from '@/api/financialService'; // Ensure this exists
import { SchoolItem, Item } from '@/types';

type SchoolItemPopulated = Omit<SchoolItem, 'itemId'> & { _id?: string; itemId: string | Item };

const SchoolInventoryPage: React.FC = () => {
  const { id: schoolId } = useParams<{ id: string }>();
  const { state } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [schoolItems, setSchoolItems] = useState<SchoolItemPopulated[]>([]);
  const [loading, setLoading] = useState(true);

  // Selling form state
  const [studentId, setStudentId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }
    if (!schoolId) {
      navigate('/schools');
      return;
    }

    const fetchSchoolItems = async () => {
      try {
        setLoading(true);
        const data = await getSchoolItemsBySchoolId(schoolId);
        setSchoolItems(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch school items. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolItems();
  }, [schoolId, state.isAuthenticated, state.user, navigate, toast]);

  // Selling handler
  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedItemId || !sellQuantity || !sellPrice) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }
    const item = schoolItems.find((i) =>
      (typeof i.itemId === 'string' ? i.itemId : i.itemId._id) === selectedItemId
    );
    if (!item) {
      toast({
        title: 'Error',
        description: 'Selected item not found.',
        variant: 'destructive',
      });
      return;
    }
    if (Number(sellQuantity) > item.quantity) {
      toast({
        title: 'Error',
        description: 'Not enough quantity in stock.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // 1. Add transaction
      await addTransaction({
        schoolId: schoolId!,
        studentId,
        type: 'income',
        category: 'Item Sale',
        amount: Number(sellPrice),
        date: new Date().toISOString(),
        description: `Sold ${sellQuantity} of ${typeof item.itemId === 'string' ? item.itemId : item.itemId.name} to student ${studentId}`,
      }, state.token);

      // 2. Update school stock item
      const leftoverQuantity = item.quantity - Number(sellQuantity);
      const leftoverPrice = item.price - Number(sellPrice);
      const itemIdForUpdate = typeof item.itemId === 'string' ? item.itemId : item.itemId._id!;
      await updateSchoolItemStock(itemIdForUpdate, leftoverQuantity, leftoverPrice);

      toast({
        title: 'Success',
        description: 'Item sold and stock updated.',
      });

      // Refresh the school items list
      const updatedItems = await getSchoolItemsBySchoolId(schoolId!);
      setSchoolItems(updatedItems);

      // Reset form
      setStudentId('');
      setSelectedItemId('');
      setSellQuantity('');
      setSellPrice('');
    } catch (error) {
      console.error('Error selling item:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete transaction.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selling Form */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Sell Item to Student</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSell} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <Input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      required
                    >
                      <option value="">Select item</option>
                      {schoolItems.map((item) => (
                        <option
                          key={item._id}
                          value={typeof item.itemId === 'string' ? item.itemId : item.itemId._id}
                        >
                          {typeof item.itemId === 'string' ? item.itemId : item.itemId.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <Input
                      type="number"
                      min={1}
                      value={sellQuantity}
                      onChange={(e) => setSellQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <Input
                      type="number"
                      min={1}
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sell Item
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* School Items List */}
          <div className="col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
              </div>
            ) : schoolItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                <p className="mt-1 text-sm text-gray-500">No items assigned to this school.</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">School Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {schoolItems.map((item) => (
                      <li key={item._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {typeof item.itemId === 'string' ? item.itemId : item.itemId.name}
                          </div>
                          <div className="text-gray-600 text-sm">Quantity: {item.quantity}</div>
                          <div className="text-gray-600 text-sm">Price: ₹{item.price}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolInventoryPage;