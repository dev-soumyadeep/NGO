import React, { useState } from 'react';
import { Alumni } from '@/types';

interface AlumniCardProps {
  alumni: Alumni;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  const [expanded, setExpanded] = useState(false);

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

  return (
    <li className="border p-4 rounded flex items-start space-x-4 bg-white shadow">
      {alumni.imageUrl && (
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={alumni.imageUrl}
            alt={`${alumni.name}'s image`}
            className="w-full h-full object-cover rounded border"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold">
              {alumni.name}{' '}
              <span className="text-gray-500 text-sm">({alumni.id})</span>
            </p>
            <p className="text-sm text-gray-600">Class: {alumni.class}</p>
            <p className="text-sm text-gray-600">Date of Birth: {formatDateTime(alumni.dateOfBirth)}</p>
            <p className="text-sm text-gray-600">Contact: {alumni.contact}</p>
            {alumni.emailId && <p className="text-sm text-gray-600">Email: {alumni.emailId}</p>}
          </div>
        </div>

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
            {alumni.address && <p className="text-sm text-gray-600">Address: {alumni.address}</p>}
            {alumni.dateOfAdmission && (
              <p className="text-sm text-gray-600">
                Date of Admission: {formatDateTime(alumni.dateOfAdmission)}
              </p>
            )}
            {alumni.fatherName && <p className="text-sm text-gray-600">Father's Name: {alumni.fatherName}</p>}
            {alumni.motherName && <p className="text-sm text-gray-600">Mother's Name: {alumni.motherName}</p>}
            {alumni.fatherPhone && <p className="text-sm text-gray-600">Father's Phone: {alumni.fatherPhone}</p>}
            {alumni.motherPhone && <p className="text-sm text-gray-600">Mother's Phone: {alumni.motherPhone}</p>}

            <button
              className="text-blue-500 text-sm mt-2"
              onClick={() => setExpanded(false)}
            >
              See Less
            </button>
          </>
        )}
      </div>
    </li>
  );
};
