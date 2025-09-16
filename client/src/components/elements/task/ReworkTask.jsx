import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import TaskCard from './TaskCard';
import TaskEdit from './TaskEdit';
import TaskViewModal from './TaskViewModel';
import { getTasks, deleteTask } from '../../../store/slices/task/taskSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { matchesSearch, computeStatusCounts } from '../utility/taskFilters';

const Loader = React.memo(() => (
  <div className="flex justify-center items-center py-10">
    <p className="text-lg text-gray-700">Loading rework tasks...</p>
  </div>
));
Loader.displayName = 'Loader';

const ErrorDisplay = React.memo(({ error }) => (
  <div className="flex justify-center items-center py-10">
    <p className="text-lg text-red-600">Failed to load tasks: {error}</p>
  </div>
));
ErrorDisplay.displayName = 'ErrorDisplay';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const ReworkTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isViewOpen, setViewOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState(null);

  const { tasks, loading, error, deletingIds = {} } = useSelector((state) => state.tasks);
  const currentUser = useSelector(selectCurrentUser);
  const { searchQuery } = useOutletContext();

  useEffect(() => { dispatch(getTasks()); }, [dispatch]);

  // Only tasks with rework === true (and matching search); for employees, only own tasks
//   const reworkTasks = useMemo(() => {
//     if (!Array.isArray(tasks)) return [];
//     let filtered = tasks.filter((t) => t.rework === true); // optionally also: && t.checkList === 'approved'
//     filtered = filtered.filter((t) => matchesSearch(t, searchQuery));
//     if (currentUser?.user?.role === ROLES.EMPLOYEE) {
//       filtered = filtered.filter((t) => {
//         const assignedId = typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
//         return String(assignedId) === String(currentUser.user._id);
//       });
//     }
//     return filtered;
//   }, [tasks, currentUser, searchQuery]);

const reworkTasks = useMemo(() => {
  if (!Array.isArray(tasks)) return [];
  // Option A: exclude approved
  let filtered = tasks.filter((t) => t.rework === true && t.checkList !== 'approved');
  // Option B: explicitly require not_approved
  // let filtered = tasks.filter((t) => t.rework === true && t.checkList === 'not_approved');
  filtered = filtered.filter((t) => matchesSearch(t, searchQuery));
  if (currentUser?.user?.role === ROLES.EMPLOYEE) {
    filtered = filtered.filter((t) => {
      const assignedId = typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
      return String(assignedId) === String(currentUser.user._id);
    });
  }
  return filtered;
}, [tasks, currentUser, searchQuery]);


  const { completed, notCompleted } = useMemo(
    () => computeStatusCounts(reworkTasks),
    [reworkTasks]
  );

  const openView = useCallback((task) => { setTaskToView(task); setViewOpen(true); }, []);
  const closeView = useCallback(() => { setViewOpen(false); setTaskToView(null); }, []);
  const openEdit = useCallback((task) => { setCurrentTaskToEdit(task); setEditModalOpen(true); }, []);
  const closeEdit = useCallback(() => { setEditModalOpen(false); setCurrentTaskToEdit(null); }, []);

  const handleDeleteClick = useCallback(async (taskId) => {
    try { await dispatch(deleteTask(taskId)).unwrap(); }
    catch (e) { alert(e?.message || 'Failed to delete task.'); }
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay error={error} />;

  if (!loading && reworkTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No Rework Tasks</h2>
        <p className="text-gray-500 mt-2">There are currently no tasks marked for rework.</p>
      </div>
    );
  }

  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;
  const currentUserId = currentUser?.user?._id;

  return (
    <>
      <div className="mb-3 text-sm text-gray-700">
        <span className="mr-4">Completed: <strong>{completed}</strong></span>
        <span>Not Completed: <strong>{notCompleted}</strong></span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reworkTasks.map((task) => {
          const onViewHandler = () => openView(task);
          const onDeleteHandler = isAdmin ? () => handleDeleteClick(task._id) : undefined;
          const isDeleting = !!deletingIds[task._id];

          return (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              assignedTo={task.assignedTo?.name || 'Unassigned'}
              status={task.status}
              dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              onClick={() => navigate(`/task/${task._id}`)}
              onView={onViewHandler}
              onEditClick={undefined /* optionally: () => openEdit(task) */}
              onDelete={onDeleteHandler}
              deleting={isDeleting}
            />
          );
        })}
      </div>

      <TaskViewModal
        isOpen={isViewOpen}
        onClose={closeView}
        task={taskToView}
        canEdit={(() => {
          if (!taskToView) return false;
          const assignedId = typeof taskToView.assignedTo === 'object' ? taskToView.assignedTo._id : taskToView.assignedTo;
          const isOwner = currentUserId && String(assignedId) === String(currentUserId);
          return isAdmin || isOwner;
        })()}
        onEdit={() => { if (taskToView) { closeView(); openEdit(taskToView); } }}
      />

      {/* <TaskEdit isOpen={isEditModalOpen} onClose={closeEdit} taskToEdit={currentTaskToEdit} /> */}
      <TaskEdit
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        taskToEdit={currentTaskToEdit}
        showApproval={isAdmin}
        showRework={false}
      />
    </>
  );
};

export default ReworkTask;
