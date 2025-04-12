import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Student } from '@/types';
interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, '_id'>) => void; // Accepts a student object without `_id`
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onAddStudent }) => {
  const [formData, setFormData] = useState<Omit<Student, '_id'>>({
    name: '',
    contact: '',
    emailId: '',
    address: '',
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      alert('Name and Contact are required fields.');
      return;
    }
    onAddStudent(formData);
    setFormData({ name: '', contact: '', emailId: '', address: '', details: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Add Student</h2>
      <Input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="contact"
        placeholder="Contact Number"
        value={formData.contact}
        onChange={handleChange}
        required
      />
      <Input
        name="emailId"
        placeholder="Email ID (Optional)"
        value={formData.emailId}
        onChange={handleChange}
      />
      <Input
        name="address"
        placeholder="Address (Optional)"
        value={formData.address}
        onChange={handleChange}
      />
      <textarea
        name="details"
        placeholder="Additional Details (Optional)"
        value={formData.details}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <Button type="submit" className="w-full">
        Add Student
      </Button>
    </form>
  );
};