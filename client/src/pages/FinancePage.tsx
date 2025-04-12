
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { School } from '@/types';
import { getSchools } from '@/api/schoolService';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School as SchoolIcon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FinancePage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
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
    
    const fetchSchools = async () => {
      try {
        const data = await getSchools();
        setSchools(data);
        setFilteredSchools(data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, [state.isAuthenticated, state.user, navigate]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(
        school => 
          school.name.toLowerCase().includes(query) || 
          school.location.toLowerCase().includes(query)
      );
      setFilteredSchools(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-indigo mb-2">Financial Management</h1>
          <p className="text-gray-600">
            Select a school to view and manage its financial records
          </p>
        </div>
        
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search schools..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">No schools found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery.trim() !== '' 
                ? `No schools matching "${searchQuery}"` 
                : 'No schools available for financial management.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <Link key={school._id} to={`/finance/${school._id}`} className="block">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="bg-brand-blue text-white">
                    <CardTitle className="flex items-center">
                      <SchoolIcon className="h-5 w-5 mr-2" />
                      {school.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">{school.location}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {school.numberOfStudents} students
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancePage;
