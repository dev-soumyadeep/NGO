import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  onRemove: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

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
        <p className="font-bold">
          {student.name} <span className="text-gray-500 text-sm">({student._id})</span>
        </p>
        <p className="text-sm text-gray-600">Class: {student.class}</p>
        <p className="text-sm text-gray-600">Date of Birth: {student.dateOfBirth}</p>
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
                Date of Admission: {student.dateOfAdmission}
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
      </div>

      {/* Remove Button */}
      <Button variant="destructive" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </li>
  );
};