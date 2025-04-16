import React, { useEffect, useState } from 'react';
import { getSchools } from '@/api/schoolService';
import { getTotalStudents } from '@/api/studentService';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { School } from '@/types';

const Index: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();
  const navigate = useNavigate();

  // Array of image paths (updated to include only 5 images)
  const images = [
    '/school1.jpg',
    '/school2.jpg',
    '/school3.jpg',
    '/school4.jpg',
    '/school5.jpg',
    '/school6.jpg',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const schoolsData = await getSchools();
        // const totalStudentsData = await getTotalStudents();
        // setSchools(schoolsData);
        // setTotalStudents(totalStudentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

    

      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="relative h-96 overflow-hidden">
          <motion.div
            className="absolute inset-0 flex"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`School ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="bg-gray-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Empowering Education</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-600">
          Our mission is to provide quality education to underprivileged children and create a brighter future for them.
        </p>
      </section>

      {/* Statistics Section
      <section className="py-16 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h2 className="text-5xl font-bold">
                {loading ? '...' : `${schools.length}+`}
              </h2>
              <p className="mt-2 text-lg">Schools Supported</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold">
                {loading ? '...' : `${totalStudents}+`}
              </h2>
              <p className="mt-2 text-lg">Students Enrolled</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;