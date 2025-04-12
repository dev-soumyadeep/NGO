import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button
import { AddStudentForm } from '../components/AddStudentForm';
import { getStudentsBySchool, addStudent, deleteStudent } from '../api/studentService';
import { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext'; // Import AuthContext to get the token
import { useNavigate } from 'react-router-dom';
const SchoolStudentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { state } = useAuth(); // Get the token from AuthContext
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
    
        if (!id) {
          navigate('/schools');
          return;
        }
    
        const fetchStudents = async () => {
          try {
            setLoading(true);
            const data = await getStudentsBySchool(id, state.token || '');
            setStudents(data);
          } catch (error) {
            console.error('Error fetching students:', error);
            toast({
              title: 'Error',
              description: 'Failed to fetch students. Please try again.',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchStudents();
      }, [id, state.isAuthenticated, state.user, state.token, navigate, toast]);
    

  const handleAddStudent = async (student: Omit<Student, '_id'>) => {
    try {
      const newStudent = await addStudent(id || '', student, state.token || ''); // Pass token
      setStudents((prev) => [...prev, newStudent]);
      toast({
        title: 'Success',
        description: 'Student added successfully.',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: 'Failed to add student. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId, state.token || ''); // Pass token
      setStudents((prev) => prev.filter((student) => student._id !== studentId)); // Update state
      toast({
        title: 'Success',
        description: 'Student removed successfully.',
      });
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove student. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-indigo">Students</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <AddStudentForm onAddStudent={handleAddStudent} />
          </div>

          <div className="col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Student List</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {students.map((student) => (
                      <li
                        key={student._id}
                        className="flex justify-between items-center border p-4 rounded"
                      >
                        <div>
                          <p className="font-bold">{student.name}</p>
                          <p className="text-sm text-gray-600">Contact: {student.contact}</p>
                          {student.emailId && (
                            <p className="text-sm text-gray-600">Email: {student.emailId}</p>
                          )}
                          {student.address && (
                            <p className="text-sm text-gray-600">Address: {student.address}</p>
                          )}
                          {student.details && (
                            <p className="text-sm text-gray-600">Details: {student.details}</p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveStudent(student._id || '')}
                        >
                          Remove
                        </Button>
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

export default SchoolStudentsPage;