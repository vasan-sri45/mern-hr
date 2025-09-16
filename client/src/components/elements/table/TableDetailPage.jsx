// TableDetailPage.jsx
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTableEntries, fetchEntryById } from '../../../store/slices/table/tableSlice';
import { ArrowLeft, User, Calendar, FileText, Type } from 'lucide-react';

const DetailItem = React.memo(({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon size={18} className="text-slate-400 mt-0.5" />
    <div>
      <strong className="block text-sm text-slate-500">{label}</strong>
      <span className="text-base font-medium">{value}</span>
    </div>
  </div>
));
DetailItem.displayName = 'DetailItem';

const Section = ({ icon: Icon, title, children }) => (
  <div className="border-t border-gray-200 pt-6">
    <div className="flex items-center gap-3 mb-2">
      <Icon size={18} className="text-slate-400" />
      <strong className="text-lg font-semibold">{title}</strong>
    </div>
    <div className="sm:pl-9 text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const TableDetailPage = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entries, currentEntry, status, error } = useSelector((s) => s.table);

  const list = Array.isArray(entries) ? entries : [];

  // If landed directly, fetch list; optionally fetch detail as well (see next effect)
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTableEntries());
    }
  }, [status, dispatch]);

  const task = useMemo(() => {
    if (currentEntry && currentEntry._id === taskId) return currentEntry;
    return list.find((t) => t._id === taskId);
  }, [list, currentEntry, taskId]);

  // Deep link handling: if list is loaded and item isn’t found, fetch the detail
  useEffect(() => {
    if (status === 'succeeded' && !task && taskId) {
      dispatch(fetchEntryById(taskId));
    }
  }, [status, task, taskId, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-semibold">Loading task details...</p>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  if (status === 'succeeded' && !task) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800">Task Not Found</h2>
        <p className="text-slate-500 mt-2">The task ID is invalid or the item may have been deleted.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }
  if (!task) return null;

  const createdOn =
    task.createdAt && !Number.isNaN(new Date(task.createdAt).getTime())
      ? new Date(task.createdAt).toLocaleDateString()
      : '';

  return (
    <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:py-12 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to List
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden block">
        <div className="p-6 sm:p-8">
          <div className="border-b border-slate-200 pb-5 mb-6">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              {task.heading || 'Uncategorized'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{task.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-slate-700">
            <DetailItem icon={User} label="Assigned To:" value={task.employee_id?.name || 'Unassigned'} />
            <DetailItem icon={Calendar} label="Created On:" value={createdOn} />
            <DetailItem icon={User} label="Last Updated By:" value={task.lastUpdatedBy?.name || 'N/A'} />
          </div>

          <div className="mt-8 space-y-8">
            <Section icon={FileText} title="Description">
              {task.description || 'No description provided.'}
            </Section>
            <Section icon={Type} title="Content">
              {task.content || 'No content provided.'}
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TableDetailPage;
