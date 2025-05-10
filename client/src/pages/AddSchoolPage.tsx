import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { createSchool } from '@/api/schoolService'; // Import the createSchool function

const AddSchoolPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    studentCount: '',
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.contactEmail) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Call the createSchool function to add the school to the database
      await createSchool(
        {
          id:Date.now().toString(),
          name: formData.name,
          location: formData.location,
          contactEmail: formData.contactEmail,
          contactNumber: formData.contactPhone,
          numberOfStudents: Number(formData.studentCount) || 0,
        },
        state.token || '' // Pass the token from AuthContext
      );

      toast({
        title: 'Success',
        description: 'School added successfully',
      });

      navigate('/schools');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/schools')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-brand-indigo">Add New School</h1>
          </div>
          <p className="text-gray-600">Create a new school in the system</p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader className="bg-brand-blue text-white">
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@school.org"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCount">Number of Students</Label>
                  <Input
                    id="studentCount"
                    name="studentCount"
                    type="number"
                    value={formData.studentCount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/schools')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-blue hover:bg-brand-indigo text-white"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add School'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddSchoolPage;