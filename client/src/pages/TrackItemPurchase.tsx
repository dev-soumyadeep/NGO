import React, { useState,useEffect } from "react";
import { PurchaseHistory } from "../types";
import {fetchFilteredPurchaseHistory } from "../api/inventoryService";
import { getSchools } from "@/api/schoolService";
import Navbar from "../components/Navbar";
const TrackItemPurchase: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [history, setHistory] = useState<PurchaseHistory[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [itemName, setItemName] = useState<string>("");
    const [isSearched,setIsSearched] = useState(false);
  useEffect(() => {
    getSchools().then(setSchools).catch(() => setSchools([]));
  }, []);

  

const handleSearch = async () => {
  setLoading(true);
  setError(null);
  setIsSearched(true);
  console.log(startDate,endDate)
  try {
    const data = await fetchFilteredPurchaseHistory({
      startDate,
      endDate,
      schoolId,
      studentId,
      itemName
    });
    setHistory(data);
  } catch (e) {
    setError("Failed to fetch purchase history.");
  }
  setLoading(false);
};


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
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold text-brand-indigo mb-6">Track Item Purchase</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">School</label>
          <select
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select School</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter Student ID"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter Item Name"
          />
        </div>
      </div>
      <button
        className="bg-brand-indigo text-white px-6 py-2 rounded font-semibold mb-6 hover:bg-indigo-700"
        onClick={handleSearch}
        disabled={loading}
        >
        {loading ? "Searching..." : "Search"}
        </button>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!isSearched ? (
        <div className="text-gray-500 text-lg mt-8">Please enter a filter and press the search button.</div>
      ) : (
        <div>
          {history.length === 0 && !loading ? (
            <div className="text-gray-500 text-lg mt-8">No purchase history found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">School ID</th>
                    <th className="px-4 py-2 border">Student ID</th>
                    <th className="px-4 py-2 border">Item Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{formatDateTime(row.date)}</td>
                      <td className="px-4 py-2 border">{row.schoolId}</td>
                      <td className="px-4 py-2 border">{row.studentId}</td>
                      <td className="px-4 py-2 border">{row.itemName}</td>
                      <td className="px-4 py-2 border">{row.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default TrackItemPurchase;