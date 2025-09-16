import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style/calander.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Import all necessary async thunks
import { fetchAttendanceHistory, fetchMonthlyStats, fetchOverallReport } from '../../../store/slices/attendence/attendenceSlice';

// Import the admin-only component
import AdminAttendanceReport from './AdminAttendanceReport';

// Register Chart.js elements required for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Helper Functions ---
const toYmd = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toYymm = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const startOfMonthLocal = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonthLocal = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const CustomAttendanceCalendar = () => {
  const dispatch = useDispatch();

  // --- Redux State Selectors ---
  const { items: history = [], status: historyStatus } = useSelector((state) => state.attendance.history);
  const { data: stats, status: statsStatus } = useSelector((state) => state.attendance.monthlyStats);
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.user.role === 'admin';

  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const debounceRef = useRef(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const month = toYymm(activeStartDate);
    const historyPayload = {
      startDate: toYmd(startOfMonthLocal(activeStartDate)),
      endDate: toYmd(endOfMonthLocal(activeStartDate))
    };

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(fetchAttendanceHistory(historyPayload));
      dispatch(fetchMonthlyStats({ month }));
      if (isAdmin) {
        dispatch(fetchOverallReport({ month }));
      }
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [activeStartDate, dispatch, isAdmin]);

  // --- Memoized Data for Calendar and Charts ---
  const presentDays = useMemo(() => {
    const set = new Set();
    history.forEach(rec => {
      const d = rec?.punchInTime ? new Date(rec.punchInTime) : null;
      if (d && !Number.isNaN(d.getTime())) set.add(d.toDateString());
    });
    return set;
  }, [history]);

  const pieChartData = useMemo(() => {
    const totalWorkdays = (stats?.totalWorkingDays || 0) + (stats?.totalAbsentDays || 0);
    const remainingDays = totalWorkdays - (stats?.totalWorkingDays || 0);
    
    return {
      labels: ['Present', 'Absent', 'Remaining'],
      datasets: [
        {
          label: 'Days',
          data: [stats?.totalWorkingDays || 0, stats?.totalAbsentDays || 0, Math.max(0, remainingDays)],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(209, 213, 219, 0.7)',
          ],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);
  
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    if (activeStartDate) setActiveStartDate(activeStartDate);
  };

  const getTileClassName = ({ date, view }) => {
      if (view !== 'month') return null;
      const dow = date.getDay();
      if (dow === 0) return 'cal-sun';
      if (dow === 6) return 'cal-sat';
      return null;
  };

  const renderTileContent = ({ date, view }) => {
      if (view === 'month' && presentDays.has(date.toDateString())) {
          return <span className="cal-badge cal-badge--present">Present</span>;
      }
      return null;
  };

  return (
    <div className="cal-card p-4 bg-white rounded-lg shadow-md mt-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">My Attendance</h2>
      </div>

      <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
        <div className="stat-item p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-500">Present Days</p>
            <p className="text-2xl font-bold text-blue-800">{statsStatus === 'loading' ? '...' : stats.totalWorkingDays}</p>
        </div>
        <div className="stat-item p-4 bg-red-50 rounded-lg border-red-200">
            <p className="text-sm font-semibold text-red-500">Absent Days</p>
            <p className="text-2xl font-bold text-red-800">{statsStatus === 'loading' ? '...' : stats.totalAbsentDays}</p>
        </div>
        <div className="stat-item p-4 bg-green-50 rounded-lg border-green-200">
            <p className="text-sm font-semibold text-green-500">Total Hours</p>
            <p className="text-2xl font-bold text-green-800">{statsStatus === 'loading' ? '...' : stats.totalWorkingHours}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
        <div className="flex-1 calendar-container relative">
            {historyStatus === 'loading' && (
              <div className="cal-loading absolute inset-0 grid place-items-center bg-white/50 rounded-md z-10">
                <div className="cal-spinner" />
              </div>
            )}
            <Calendar
                onActiveStartDateChange={handleActiveStartDateChange}
                tileContent={renderTileContent}
                tileClassName={getTileClassName}
                locale="en-US"
                className="custom-react-calendar"
                showNeighboringMonth={false}
                prev2Label={null}
                next2Label={null}
            />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Monthly Summary</h3>
          {statsStatus === 'loading' ? (
            <div className="cal-spinner" />
          ) : (
            <div className="relative w-full h-[350px]">
              <Pie 
                data={pieChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { position: 'top' } } 
                }} 
              />
            </div>
          )}
        </div>
      </div>

      {isAdmin && <AdminAttendanceReport />}
    </div>
  );
};

export default CustomAttendanceCalendar;

