import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableEntries } from '../../../store/slices/table/tableSlice';
import HeadingCard from './HeadingCard';
import { useNavigate } from 'react-router-dom';

const normalize = (s) => (s || '').toString().trim();

const TabContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { entries, status, error } = useSelector((state) => state.table);
  const tasks = Array.isArray(entries) ? entries : [];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTableEntries());
    }
  }, [status, dispatch]);

  const groupedTasks = useMemo(() => {
    if (!tasks.length) return {};
    return tasks.reduce((acc, task) => {
      const key = normalize(task.heading) || 'Uncategorized';
      (acc[key] ||= []).push(task);
      return acc;
    }, {});
  }, [tasks]);

  const handleHeadingClick = useCallback((heading) => {
    const encoded = encodeURIComponent(heading);
    navigate(`/table/${encoded}`);
  }, [navigate]);

  if (status === 'loading') {
    return <div className="text-center p-10 font-semibold text-slate-500">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  const headings = Object.keys(groupedTasks);

  return (
    <div className="w-full py-8">
      {headings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {headings.map((heading) => (
            <HeadingCard
              key={heading}
              heading={heading}
              taskCount={groupedTasks[heading].length}
              onClick={() => handleHeadingClick(heading)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-slate-50 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-700">No Tables Found</h3>
          <p className="text-slate-500 mt-2">Get started by creating a new table entry.</p>
        </div>
      )}
    </div>
  );
};

export default TabContainer;
