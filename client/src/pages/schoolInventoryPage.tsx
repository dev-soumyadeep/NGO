import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSchoolItemsBySchoolId, updateSchoolItemStock } from '@/api/inventoryService';
import { addTransaction } from '@/api/financialService';
import { checkStudentIdExists } from '@/api/studentService';
import { SchoolItem } from '@/types';

const SchoolInventoryPage: React.FC = () => {
  const { id: schoolId } = useParams<{ id: string }>();
  const { state } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [schoolItems, setSchoolItems] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [studentId, setStudentId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [isValidStudent, setIsValidStudent] = useState(true);

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
        console.log(error);
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

  const validateStudentId = async () => {
    if (!studentId) return;
  
    try {
      const exists = await checkStudentIdExists(studentId, state.token);
      setIsValidStudent(exists);
      if (!exists) {
        toast({
          title: 'Invalid Student ID',
          description: 'This student does not exist. Please check the ID.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking student ID:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify student ID.',
        variant: 'destructive',
      });
      setIsValidStudent(false);
    }
  };
  

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

    const item = schoolItems.find((i) => i.itemId === selectedItemId);

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
      await addTransaction({
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        schoolId: schoolId!,
        studentId,
        type: 'income',
        category: 'Item Sale',
        quantity: Number(sellQuantity),
        price: Number(sellPrice),
        amount: Number(sellQuantity)*Number(sellPrice),
        itemName: item.name || '',
        description: `Sold ${sellQuantity} of ${item.name} to student ${studentId}`,
      }, state.token);

      const leftoverQuantity = item.quantity - Number(sellQuantity);
      await updateSchoolItemStock(item.name, leftoverQuantity, item.price);

      toast({
        title: 'Success',
        description: 'Item sold, transaction added and stock updated.',
        variant: 'default',
      });

      const updatedItems = await getSchoolItemsBySchoolId(schoolId!);
      setSchoolItems(updatedItems);

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
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        setIsValidStudent(true); 
                      }}
                      onBlur={validateStudentId}
                      className={!isValidStudent ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedItemId}
                      onChange={(e) => {
                        setSelectedItemId(e.target.value);
                        const selected = schoolItems.find(item => item.itemId === e.target.value);
                        setSellPrice(selected?.price.toString() || '');
                      }}
                      required
                    >
                      <option value="">Select item</option>
                      {schoolItems.map((item) => (
                        <option key={item.itemId} value={item.itemId}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <Input
                      type="number"
                      min={1}
                      max={schoolItems.find((i) => i.itemId === selectedItemId)?.quantity || 0}
                      value={sellQuantity}
                      onChange={(e) => setSellQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      min={schoolItems.find((i) => i.itemId === selectedItemId)?.price || 0}
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <Input
                      type="number"
                      value={Number(sellQuantity) * Number(sellPrice)}
                      readOnly
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
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">School Inventory</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="p-4 text-left">Item Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Price</th>
                      <th className="p-4 text-left">Total Amount</th>
                      <th className="p-4 text-left">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolItems.map((item) => (
                      <tr key={item.itemId} className="border-t">
                        <td className="p-4">{item.name}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">₹{item.price}</td>
                        <td className="p-4">₹{item.total_amount}</td>
                        <td className="p-4">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolInventoryPage;
