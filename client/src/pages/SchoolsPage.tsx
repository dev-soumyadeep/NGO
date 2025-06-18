import React, { useEffect, useState } from "react";
import { School } from "@/types";
import { getSchools } from "@/api/schoolService";
import Navbar from "@/components/Navbar";
import SchoolCard from "@/components/SchoolCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state } = useAuth();
  const isAdmin = state.isAuthenticated && state.user?.role === "admin";
  useEffect(() => {
    getSchools()
      .then((fetchedSchools) => {
        setSchools(fetchedSchools);
        setFilteredSchools(fetchedSchools); // Use the fetched data directly
      })
      .catch(() => {
        setSchools([]);
        setFilteredSchools([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(
        (school) =>
          school.name.toLowerCase().includes(query) ||
          school.location.toLowerCase().includes(query)
      );
      setFilteredSchools(filtered);
    }
  };

  const handleSchoolDeleted = (deletedSchoolId: string) => {
    // Remove the deleted school from the state
    const updatedSchools = schools.filter(
      (school) => school.id !== deletedSchoolId
    );
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools);

    // Optionally, reset the search query if no schools match
    if (searchQuery.trim() !== "") {
      const filtered = updatedSchools.filter(
        (school) =>
          school.name.toLowerCase().includes(searchQuery) ||
          school.location.toLowerCase().includes(searchQuery)
      );
      setFilteredSchools(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-brand-indigo">All Schools</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search schools..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>

            {isAdmin && (
              <Button
                onClick={() => navigate("/add-school")}
                className="bg-brand-blue hover:bg-brand-indigo text-white whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add School
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              No schools found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery.trim() !== ""
                ? `No schools matching "${searchQuery}"`
                : "Get started by adding a new school."}
            </p>
            {isAdmin && searchQuery.trim() === "" && (
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/add-school")}
                  className="bg-brand-blue hover:bg-brand-indigo text-white"
                >
                  Add School
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onSchoolDeleted={() => handleSchoolDeleted(school.id)} // Pass the callback
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SchoolsPage;
