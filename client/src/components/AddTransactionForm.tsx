import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addTransaction } from '@/api/financialService';
import { getSchoolNameById } from '@/api/schoolService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Transaction } from '@/types';
import { getIncomeCategories, getExpenseCategories } from '@/api/financialService';
import { findStudentByStudentId } from '@/api/studentService';
interface AddTransactionFormProps {
  schoolIdInSchoolFinance: string | null;
  onTransactionAdded: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ schoolIdInSchoolFinance, onTransactionAdded }) => {
  const { toast } = useToast();
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCentralFinance, setIsCentralFinance] = useState(false);
  const [schoolIdInCentralFinance, setSchoolIdInCentralFinance] = useState('');
  const [usePriceQuantity, setUsePriceQuantity] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    date: '',
    itemName: '',
    quantity: '',
    price: '',
    amount: '',
    description: '',
    studentId:undefined,
  });

  const categories = formData.type === 'income' ? getIncomeCategories() : getExpenseCategories();

  useEffect(() => {
    if (!schoolIdInSchoolFinance) {
      setIsCentralFinance(true);
      // console.log('central finance')
    }
  }, [schoolIdInSchoolFinance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsePriceQuantity(e.target.checked);
    // If unchecked, clear price and quantity
    if (!e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        price: '',
        quantity: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.type || !formData.category || !formData.date || !formData.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let schoolId: string | undefined=undefined;
      let schoolName: string | undefined=undefined;
      if (isCentralFinance && schoolIdInCentralFinance) {
        schoolId = schoolIdInCentralFinance || undefined;
        schoolName= await getSchoolNameById(schoolId)
      } else if (!isCentralFinance && schoolIdInSchoolFinance) {
        schoolId = schoolIdInSchoolFinance || undefined;
        schoolName= await getSchoolNameById(schoolId)
      }


      if(formData.studentId){
        console.log("here")
        const student= await findStudentByStudentId(formData.studentId,state.token || '')
        console.log(student)
        if(!student){
          console.log("snf")
          toast({
            title: 'Error',
            description: 'Student not found.',
            variant: 'destructive',
          });
          return;
        }
      }

      const transaction: Transaction = {
        schoolId,
        schoolName,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        date: formData.date,
        itemName: formData.itemName,
        amount: Number(formData.amount),
        description: formData.description,
        studentId: formData.studentId,
      };

      if (usePriceQuantity) {
        transaction.price = formData.price ? Number(formData.price) : undefined;
        transaction.quantity = formData.quantity ? Number(formData.quantity) : undefined;
      }

      await addTransaction(transaction,state.token || '');

      toast({
        title: 'Success',
        description: 'Transaction added successfully.',
      });

      setFormData({
        type: 'income',
        category: '',
        date: '',
        itemName: '',
        quantity: '',
        price: '',
        amount: '',
        description: '',
        studentId: '',
      });
      setSchoolIdInCentralFinance('');
      setUsePriceQuantity(false);
      onTransactionAdded();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add transaction.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const autoFetchSchoolId = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const studentId = e.target.value;
    if (!studentId) return;
  
    try {
      // You may need to pass a token if your API requires it
      const student = await findStudentByStudentId(studentId, state.token || '');
      if (student && student.schoolId) {
        setSchoolIdInCentralFinance(student.schoolId);
      } else {
        // Optionally clear the schoolId field if not found
        setSchoolIdInCentralFinance('');
      }
    } catch (error) {
      // Optionally clear the schoolId field if error
      setSchoolIdInCentralFinance('');
      // Optionally show a toast or error message
      toast({
        title: 'Student Not Found',
        description: 'No student found with this ID.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="bg-brand-blue text-white">
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
          <div className="grid gap-3">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(v) => handleSelectChange('type', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              {isCentralFinance && <SelectItem value="expense">Expense</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        </div>
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="itemName">Item Name (Optional)</Label>
            <Input
              id="itemName"
              name="itemName"
              type="text"
              placeholder="Enter item name"
              value={formData.itemName}
              onChange={handleChange}
            />
          </div>
          {/* Checkbox for using price and quantity */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePriceQuantity"
              checked={usePriceQuantity}
              onChange={handleCheckboxChange}
              className="h-4 w-4"
            />
            <Label htmlFor="usePriceQuantity">Use price and quantity</Label>
          </div>
          {/* Show price and quantity fields if checked */}
          {usePriceQuantity && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required={usePriceQuantity}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required={usePriceQuantity}
                />
              </div>
            </div>
          )}
          <div className="grid gap-3">
            <Label htmlFor="studentId">Student ID (Optional)</Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="Enter student ID (if applicable)"
              value={formData.studentId}
              onChange={(e) => {
                handleChange(e);
                autoFetchSchoolId(e);
              }}
            />
          </div>
          {isCentralFinance && (
            <div className="grid gap-3">
              <Label htmlFor="schoolId">School ID (Optional)</Label>
              <Input
                id="schoolId"
                name="schoolId"
                type="text"
                placeholder="Enter school ID (if applicable)"
                value={schoolIdInCentralFinance}
                onChange={(e) => setSchoolIdInCentralFinance(e.target.value)}
              />
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              required={!usePriceQuantity}
              disabled={usePriceQuantity}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;