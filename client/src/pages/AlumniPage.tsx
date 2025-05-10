import React, { useEffect, useState } from 'react';
import { getAlumniList, deleteAlumni } from '../api/studentService';
import { getSchools } from '@/api/schoolService';
import { AlumniCard } from '@/components/AlumniCard';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [state.isAuthenticated, state.user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const alumniData = await getAlumniList();
      const schoolsData = await getSchools();
      setAlumni(alumniData);
      setSchools(schoolsData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredAlumni(
      selectedSchool === 'all'
        ? alumni
        : alumni.filter(a => a.schoolId === selectedSchool)
    );
  }, [alumni, selectedSchool]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Alumni List</h1>
          <div>
            <label className="mr-2 font-medium">Filter by School:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
            >
              <option value="all">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlumni.length === 0 ? (
            <li className="text-gray-500 col-span-full">No alumni found.</li>
          ) : (
            filteredAlumni.map(alum => (
              <AlumniCard key={alum.id} alumni={alum}/>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default AlumniPage;
