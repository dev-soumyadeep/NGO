import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddStudentForm } from '../components/AddStudentForm';
import { getStudentsBySchool, addStudent, deleteStudent, addAlumniFromStudentId } from '../api/studentService';
import { convertStudentIdToAlumniId } from '../api/financialService';
import { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FilterButton } from '@/components/FilterButton';
import { StudentCard } from '@/components/StudentCard';

const SchoolStudentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { state } = useAuth();

  // Filter options
  const[renderFirst, setRenderFirst] = useState(true);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('None');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    studentId: string | null;
    studentName: string | null;
  }>({ isOpen: false, studentId: null, studentName: null });

  useEffect(() => {
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
        setFilteredStudents(data);
        console.log(data) 
  
        // Generate filter options dynamically
        const classes = Array.from(new Set(data.map((student) => student.class))); // Unique classes
        const currentYear = new Date().getFullYear();
        const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
        const dobMonthOption = `DOB Month (${currentMonthName})`; // Default option
  
        setFilterOptions([
          'None',
          dobMonthOption, // Present month name
          ...classes.map((cls) => `Class (${cls})`),
          `Admission Year (${currentYear})`,
          `Admission Year (${currentYear - 1})`,
          `Admission Year (${currentYear - 2})`,
        ]);

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

  useEffect(() => {
    if (renderFirst && students.length > 0) {
      // Apply the default filter only after students are loaded
      const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
      const defaultFilter = `DOB Month (${currentMonthName})`;
      handleFilterChange(defaultFilter);
      console.log("Default filter applied:", defaultFilter);
      setRenderFirst(false); // Prevent re-rendering
    }
  },[students, renderFirst]);

  const handleAddStudent = async (student: Omit<Student, 'id'>) => {
    console.log(student)
    try {
      const newStudent = await addStudent(id || '', student, state.token || '');
      setStudents((prev) => [...prev, newStudent]);
      setFilteredStudents((prev) => [...prev, newStudent]); 
      toast({
        title: 'Success',
        description: `Student ID: ${newStudent.id},Student added successfully.`,
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
      console.log(state.token)
      await convertStudentIdToAlumniId(studentId, state.token || '');
      await addAlumniFromStudentId(studentId, state.token || '');
      await deleteStudent(studentId, state.token || '');
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
      setFilteredStudents((prev) => prev.filter((student) => student.id !== studentId)); // Update filtered list
      toast({
        title: 'Success',
        description: `Student with ID ${studentId} removed successfully and added to alumni list with ID ${studentId.replace(/^STU-/, 'ALU-')}`,
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

  const confirmRemoveStudent = (studentId: string, studentName: string) => {
    setConfirmDialog({ isOpen: true, studentId, studentName });
  };

  const handleConfirmDialogClose = (confirmed: boolean) => {
    if (confirmed && confirmDialog.studentId) {
      handleRemoveStudent(confirmDialog.studentId);
    }
    setConfirmDialog({ isOpen: false, studentId: null,studentName: null });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  
    if (filter === 'None') {
      console.log('Showing all students'); // Debugging
      setFilteredStudents(students); // Show all students
    } else if (filter.startsWith('DOB Month')) {
      const currentMonth = new Date().getMonth(); // Get current month index (0-11)
      setFilteredStudents(
        students.filter((student) => {
          if (!student.dateOfBirth) {
            console.warn('Missing dateOfBirth for student:', student);
            return false;
          }
          const dob= new Date(student.dateOfBirth).toISOString().split('T')[0]
          // Parse the `dd/mm/yyyy` format into a valid Date object
          const [year, month, day] = dob.split('-').map(Number);
          const studentDate = new Date(year, month - 1, day);
          const studentMonth = studentDate.getMonth(); // Get the month (0-11)
          return studentMonth === currentMonth;
        })
      );
    } else if (filter.startsWith('Class')) {
      const className = filter.match(/\(([^)]+)\)/)?.[1]; // Extract class name
      setFilteredStudents(students.filter((student) => student.class === className));
    } else if (filter.startsWith('Admission Year')) {
      const year = filter.match(/\(([^)]+)\)/)?.[1]; // Extract year from filter
      setFilteredStudents(
      students.filter((student) => {
        if (!student.dateOfAdmission) return false;

        // Extract year from `dd/mm/yyyy` format
        const doa = new Date(student.dateOfAdmission).toISOString().split('T')[0]
        const admissionYear = doa.split('-')[0]; // Get the year part
        return admissionYear === year; // Compare with the extracted year
      })
    );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       

      <div className="mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-brand-indigo">Students</h1>
        <div className="ml-auto">
          <FilterButton
            options={filterOptions}
            selectedOption={selectedFilter}
            onFilterChange={handleFilterChange}
            labelExtractor={(option) => option}
            defaultOption={`DOB Month (${new Date().toLocaleString('default', { month: 'long' })})`} // Default to current month
          />
        </div>
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
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">No students match the selected filter.</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Student List</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {filteredStudents.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onRemove={() =>  confirmRemoveStudent(student.id || '', student.name)}
                      />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          {confirmDialog.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Confirm Removal</h2>
                <p>
                  Are you sure you want to remove <strong>{confirmDialog.studentName}</strong> and make an alumni? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    onClick={() => handleConfirmDialogClose(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={() => handleConfirmDialogClose(true)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SchoolStudentsPage;