// src/components/PerformanceSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyMonthlyReport } from '../../../store/slices/taskReport/taskReportSlice';
import { selectPerformance, selectMyMonthlyReport } from '../../../store/slices/taskReport/taskSelector';
import {selectCurrentUser} from '../../../store/slices/authSlice'
// If using alias: import { getMyMonthlyReport } from '@/store/slices/taskReport/taskReportSlice';
// If using alias: import { selectPerformance, selectMyMonthlyReport } from '@/store/slices/taskReport/taskSelector';
import { ArrowRight } from 'lucide-react'; // icon component [lucide-react]
/* Lucide components accept props like size, color, and strokeWidth */ // [1]

const CircularProgress = ({ percentage, label }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative inline-block">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r="45" fill="none" stroke="#ff4444" strokeWidth="8" />
        <circle cx="60" cy="60" r="45" fill="none" stroke="#22c55e" strokeWidth="8"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-500 ease-in-out" />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-lg font-semibold text-slate-900">{label}</span>
      </div>
    </div>
  );
};

export default function PerformanceSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // programmatic navigation [6]
  const { isLoading, isError, message } = useSelector(selectMyMonthlyReport);
  const { month, total, completed, pending, pct, label } = useSelector(selectPerformance);
  const currentUser = useSelector(selectCurrentUser); // adjust to actual auth slice
  const role = currentUser?.user.role;
  
  useEffect(() => {
    const now = new Date();
    const monthStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    dispatch(getMyMonthlyReport({ month: monthStr, page: 1, limit: 10 }));
  }, [dispatch]);

  const goToAllEmployees = () => {
    navigate('/task/report'); // or your actual route [6]
  };

  return (
    <div className="bg-slate-200 rounded-2xl p-8 w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-8">Performance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-12 items-center">
        <div className="flex flex-row items-center gap-6">
          <CircularProgress percentage={pct} label={label} />
          <div className="benchmark text-center">
            <h4 className="text-base font-semibold mb-3 text-slate-900">Bench mark</h4>
            <div className="flex items-center gap-2 mb-2 font-medium">
              <span className="w-4 h-4 rounded-sm bg-red-500" /><span>20%</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="w-4 h-4 rounded-sm bg-green-500" /><span>80%</span>
            </div>
          </div>
        </div>

        <div className="text-slate-500 leading-relaxed break-words">
          <p>{isLoading ? 'Loading performance...' : isError ? (message || 'Failed to load performance') : `Monthly stats${month ? ` for ${month}` : ''}.`}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm min-w-[120px] w-full max-w-[140px]">
            <h3 className="text-[12px] md:text-sm font-medium text-slate-500 mb-2 leading-snug">Task Completed</h3>
            <div className="text-3xl font-bold text-slate-900">{completed}</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm min-w-[120px] w-full max-w-[140px]">
            <h3 className="text-[12px] md:text-sm font-medium text-slate-500 mb-2 leading-snug">Pending</h3>
            <div className="text-3xl font-bold text-slate-900">{pending}</div>
          </div>

          {role === 'admin' && (
            <button
              aria-label="View all employees"
              title="View all employees"
              onClick={goToAllEmployees}
              className="bg-slate-900 border-none w-12 h-12 rounded-full flex items-center justify-center text-white transition-all mt-4 flex-shrink-0 hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              <ArrowRight size={20} strokeWidth={2} /> 
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

