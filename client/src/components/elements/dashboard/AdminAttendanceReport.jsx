import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

// A simple, inline SVG component for the search icon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const AdminAttendanceReport = () => {
  const { data: reportData, status } = useSelector((state) => state.attendance.adminReport);
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReportData = useMemo(() => {
    if (!searchQuery) {
      return reportData;
    }
    
    return reportData.filter(item => {
      const query = searchQuery.toLowerCase();
      const name = item.employeeName.toLowerCase();
      const id = String(item.employeeId).toLowerCase();

      return name.includes(query) || id.includes(query);
    });
  }, [reportData, searchQuery]);

  if (status === 'loading') {
    return <p className="text-center text-slate-500 mt-8">Loading attendance report...</p>;
  }

  return (
    <div className="mt-12">
      {/* UPDATED: Responsive header container */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4 sm:gap-0">
        <h3 className="text-xl font-semibold text-slate-800 whitespace-nowrap">
          Monthly Employee Report
        </h3>
        
        {/* Search Input with Icon */}
        <div className="relative" style={{ width: '250px' }}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReportData.length > 0 ? (
              filteredReportData.map((item) => (
                <tr key={item.employeeId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.employeeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.presentDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.absentDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalHours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No matching employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendanceReport;
