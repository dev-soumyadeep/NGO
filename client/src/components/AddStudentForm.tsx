import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Student } from '@/types';
import { uploadImageToCloudinary } from '@/api/uploadImageService';
import { useToast } from '@/components/ui/use-toast';
interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onAddStudent }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    class: '',
    contact: '',
    emailId: '',
    address: '',
    details: '',
    dateOfBirth: '',
    dateOfAdmission: '',
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    imageUrl: '', // Added imageUrl field
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the uploaded image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image preview URL
  const [uploading, setUploading] = useState<boolean>(false); // State to track upload status
  const {toast}=useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const formattedValue =
    name === 'name' || name === 'fatherName' || name === 'motherName'
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 500KB)
      if (file.size > 500 * 1024) {
        toast({
          title: 'Error',
          description: 'File size exceeds 500KB. Please upload a smaller image.',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
};

const handleSubmit = async (e: React.FormEvent) => {
  try{

  e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.class || !formData.contact || !formData.dateOfBirth || !formData.dateOfAdmission) {
      toast({
        title: 'Error',
        description: 'Name, Class, Contact, Date of Birth, and Date of Admission are required fields.',
        variant: 'destructive',
      });
      return;
    }
    let imageUrl = '';
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImageToCloudinary(imageFile); 
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Send the processed data
    onAddStudent({ ...formData, imageUrl});

    // Reset the form
    setFormData({
      name: '',
      class: '',
      contact: '',
      emailId: '',
      address: '',
      details: '',
      dateOfBirth: '',
      dateOfAdmission: '',
      fatherName: '',
      motherName: '',
      fatherPhone: '',
      motherPhone: '',
      imageUrl: '',
    });
    setImageFile(null); // Reset the image file
    setImagePreview(null); // Reset the image preview
  }catch(error){
    toast({
      title: 'Error',
      description: error?.message || 'Failed to add student',
      variant: 'destructive',
    });
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Add Student</h2>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image (Optional, Max: 500KB)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Other Form Fields */}
      <Input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="class"
        placeholder="Class"
        value={formData.class}
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
      <Input
        name="dateOfBirth"
        placeholder="Date of Birth (DD/MM/YYYY)"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />
      <Input
        name="dateOfAdmission"
        placeholder="Date of Admission (DD/MM/YYYY)"
        value={formData.dateOfAdmission}
        onChange={handleChange}
        required
      />
      <Input
        name="fatherName"
        placeholder="Father's Name (Optional)"
        value={formData.fatherName}
        onChange={handleChange}
      />
      <Input
        name="motherName"
        placeholder="Mother's Name (Optional)"
        value={formData.motherName}
        onChange={handleChange}
      />
      <Input
        name="fatherPhone"
        placeholder="Father's Phone Number (Optional)"
        value={formData.fatherPhone}
        onChange={handleChange}
      />
      <Input
        name="motherPhone"
        placeholder="Mother's Phone Number (Optional)"
        value={formData.motherPhone}
        onChange={handleChange}
      />
      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Add Student'}
      </Button>
    </form>
  );
};