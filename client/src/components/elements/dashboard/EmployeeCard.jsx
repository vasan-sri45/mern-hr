import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodaysAttendance, punchIn, punchOut } from '../../../store/slices/attendence/attendenceSlice';

const EmployeeCard = () => {
  const dispatch = useDispatch();

  // Auth user
  const user = useSelector((state) => state.auth?.user);
  const name = user?.user?.name ? user.user.name.toUpperCase() : '';
  const empId = user?.user?.empId ?? '';
  const designation = user?.user?.desigination ? user.user.desigination.toUpperCase() : '';

  // Today attendance sub-state
  const { data: todaysAttendance, status } = useSelector((state) => state.attendance.today);

  // Initial fetch guarded by status
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodaysAttendance());
    }
  }, [status, dispatch]);

  const {
    isLoading,
    hasPunchedIn,
    hasCompletedDay,
    buttonLabel,
    canClick,
  } = useMemo(() => {
    const loading = status === 'loading';
    const inTime = todaysAttendance?.punchInTime ?? null;
    const outTime = todaysAttendance?.punchOutTime ?? null;

    const completed = Boolean(outTime);
    const inButNotOut = Boolean(inTime) && !outTime;

    return {
      isLoading: loading,
      hasPunchedIn: inButNotOut,
      hasCompletedDay: completed,
      buttonLabel: inButNotOut ? 'PUNCH OUT →' : 'PUNCH IN →',
      canClick: !loading && !completed,
    };
  }, [status, todaysAttendance]);

  const handlePunchAction = () => {
    if (!canClick) return;
    if (hasPunchedIn) dispatch(punchOut());
    else dispatch(punchIn());
  };

  return (
    <div className="flex justify-between items-start mb-8 gap-4 w-full md:flex-row flex-col md:text-left text-center md:items-center">
      <div className="welcome-info">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2 leading-tight">
          Welcome {name}!
        </h1>
        <p className="text-slate-500 text-base">
          {empId}
          {empId && designation ? ' | ' : ''}
          {designation}
        </p>
      </div>

      <button
        type="button"
        onClick={handlePunchAction}
        disabled={!canClick}
        aria-busy={isLoading ? 'true' : 'false'}
        aria-label={hasPunchedIn ? 'Punch out' : 'Punch in'}
        className="px-8 py-4 bg-white border border-slate-200 rounded-xl cursor-pointer font-semibold text-base text-slate-900 shadow-md transition-all whitespace-nowrap min-h-[44px] flex items-center justify-center flex-shrink-0 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 md:w-auto w-full md:max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed gap-2"
      >
        {isLoading && (
          <span
            className="inline-block w-4 h-4 rounded-full border-2 border-orange-300 border-top-color border-t-orange-600 animate-spin"
            aria-hidden="true"
          />
        )}
        {buttonLabel}
      </button>
    </div>
  );
};

export default EmployeeCard;


