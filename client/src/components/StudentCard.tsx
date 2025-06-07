import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { updateStudentDetails } from '@/api/studentService';

interface StudentCardProps {
  student: Student;
  onRemove: () => void;
  onDelete: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onRemove, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>({ ...student });

  function formatDateTime(dateStr?: string | Date) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try{
      
      const dob=new Date(editedStudent.dateOfBirth).toISOString().split('T')[0]
      const doa=new Date(editedStudent.dateOfAdmission).toISOString().split('T')[0]
      const updatedStudent = {
        ...editedStudent,
        dateOfBirth: dob,
        dateOfAdmission: doa,
      };
      await updateStudentDetails(student.id, updatedStudent);
      setIsEditing(false);
    }catch(error){
      console.log("Error editing student details:"+error);
    }
  };

  const handleCancel = () => {
    setEditedStudent({ ...student });
    setIsEditing(false);
  };

  return (
    <li className="border p-4 rounded flex items-start space-x-4">
      {/* Image Section */}
      {student.imageUrl && (
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={student.imageUrl}
            alt={`${student.name}'s image`}
            className="w-full h-full object-cover rounded border"
          />
        </div>
      )}

      {/* Student Details Section */}
      <div className="flex-1">
        {isEditing ? (
          <form className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={editedStudent.name}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">ID</label>
              <input
                type="text"
                name="id"
                value={editedStudent.id}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Class</label>
              <input
                type="text"
                name="class"
                value={editedStudent.class}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={
                  editedStudent.dateOfBirth
                    ? new Date(editedStudent.dateOfBirth).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact</label>
              <input
                type="text"
                name="contact"
                value={editedStudent.contact}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="emailId"
                value={editedStudent.emailId || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={editedStudent.address || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Admission</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={
                  editedStudent.dateOfAdmission
                    ? new Date(editedStudent.dateOfAdmission).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={editedStudent.fatherName || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={editedStudent.motherName || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Father's Phone</label>
              <input
                type="text"
                name="fatherPhone"
                value={editedStudent.fatherPhone || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mother's Phone</label>
              <input
                type="text"
                name="motherPhone"
                value={editedStudent.motherPhone || ''}
                onChange={handleChange}
                className="block border rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        ) : (
          <>
            <p className="font-bold">
              {student.name} <span className="text-gray-500 text-sm">({student.id})</span>
            </p>
            <p className="text-sm text-gray-600">Class: {student.class}</p>
            <p className="text-sm text-gray-600">Date of Birth: {formatDateTime(student.dateOfBirth)}</p>
            <p className="text-sm text-gray-600">Contact: {student.contact}</p>
            {student.emailId && <p className="text-sm text-gray-600">Email: {student.emailId}</p>}
            {!expanded && (
              <button
                className="text-blue-500 text-sm mt-2"
                onClick={() => setExpanded(true)}
              >
                See More
              </button>
            )}
            {expanded && (
              <>
                {student.address && (
                  <p className="text-sm text-gray-600">Address: {student.address}</p>
                )}
                {student.dateOfAdmission && (
                  <p className="text-sm text-gray-600">
                    Date of Admission: {formatDateTime(student.dateOfAdmission)}
                  </p>
                )}
                {student.fatherName && (
                  <p className="text-sm text-gray-600">Father's Name: {student.fatherName}</p>
                )}
                {student.motherName && (
                  <p className="text-sm text-gray-600">Mother's Name: {student.motherName}</p>
                )}
                {student.fatherPhone && (
                  <p className="text-sm text-gray-600">Father's Phone: {student.fatherPhone}</p>
                )}
                {student.motherPhone && (
                  <p className="text-sm text-gray-600">Mother's Phone: {student.motherPhone}</p>
                )}
                <button
                  className="text-blue-500 text-sm mt-2"
                  onClick={() => setExpanded(false)}
                >
                  See Less
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-2 items-start">
      {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full px-4 py-1.5 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          className="w-full px-4 py-1.5 text-sm"
          onClick={onDelete}
        >
          Delete Student
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-full px-4 py-1.5 text-sm"
          onClick={onRemove}
        >
          Remove & Add to Alumni
        </Button>

    </div>
    </li>
  );
};
