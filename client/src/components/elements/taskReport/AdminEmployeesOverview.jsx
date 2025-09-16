// src/pages/AdminEmployeesOverview.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminMonthlySummary } from '../../../store/slices/taskReport/taskReportSlice';
import { selectAdminMonthlySummary } from '../../../store//slices//taskReport/taskSelector';

export default function AdminEmployeesOverview() {
  const dispatch = useDispatch();
  const { month, stats, isLoading, isError, message } = useSelector(selectAdminMonthlySummary);

  useEffect(() => {
    const now = new Date();
    const monthStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    dispatch(getAdminMonthlySummary({ month: monthStr }));
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">{message || 'Failed to load'}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Employees — Monthly Overview {month ? `(${month})` : ''}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left">Emp ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-right">Completed</th>
              <th className="px-4 py-2 text-right">Not Completed</th>
            </tr>
          </thead>
          <tbody>
            {(stats || []).map(r => (
              <tr key={r.employeeId}>
                <td className="px-4 py-2">{r.empId}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2 text-right">{r.totalTasks}</td>
                <td className="px-4 py-2 text-right">{r.completed}</td>
                <td className="px-4 py-2 text-right">{r.notCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
