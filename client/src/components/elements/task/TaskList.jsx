// export default TaskList;
import TaskViewModal from './TaskViewModel';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import TaskEdit from './TaskEdit';
import { getEmployees } from '../../../store/slices/employee/employeeSlice';
import { deleteTask } from '../../../store/slices/task/taskSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { matchesSearch, computeStatusCounts } from '../utility/taskFilters';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };
const emptyDeletingIds = {};

const TaskList = ({ tasks, searchQuery = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // View modal state
  const [isViewOpen, setViewOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  // Edit modal state
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState(null);

  // Admin filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Store
  const currentUser = useSelector(selectCurrentUser);
  const { employees } = useSelector(state => state.employees);
  const { deletingIds = emptyDeletingIds } = useSelector(state => state.tasks) || {};

  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;
  const isEmployee = currentUser?.user?.role === ROLES.EMPLOYEE;
  const currentUserId = currentUser?.user?._id;

  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]); [11]
  const employeeOptions = useMemo(() => (Array.isArray(employees) ? employees : []), [employees]); [11]

  // const filteredTasks = useMemo(() => {
  //   let filtered = safeTasks.filter(task => task.checkList !== 'approved');
  //   filtered = filtered.filter(t => matchesSearch(t, searchQuery));
  //   if (isEmployee && currentUserId) {
  //     filtered = filtered.filter(task => {
  //       const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
  //       return String(assignedId) === String(currentUserId);
  //     });
  //   } else if (isAdmin && selectedEmployee) {
  //     filtered = filtered.filter(task => {
  //       const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
  //       return String(assignedId) === String(selectedEmployee);
  //     });
  //   }
  //   return filtered;
  // }, [safeTasks, searchQuery, isEmployee, isAdmin, selectedEmployee, currentUserId]); [11]

  const filteredTasks = useMemo(() => {
  let filtered = safeTasks
    // Exclude approved tasks and any rework tasks
    .filter((task) => task.checkList !== 'approved' && !(task.rework === true || task.rework === 'true')); // NEW
  filtered = filtered.filter((t) => matchesSearch(t, searchQuery));
  if (isEmployee && currentUserId) {
    filtered = filtered.filter((task) => {
      const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
      return String(assignedId) === String(currentUserId);
    });
  } else if (isAdmin && selectedEmployee) {
    filtered = filtered.filter((task) => {
      const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
      return String(assignedId) === String(selectedEmployee);
    });
  }
  return filtered;
}, [safeTasks, searchQuery, isEmployee, isAdmin, selectedEmployee, currentUserId]);


  const { completed, notCompleted } = useMemo(
    () => computeStatusCounts(filteredTasks),
    [filteredTasks]
  ); [11]

  useEffect(() => {
    if (filterOpen && isAdmin) dispatch(getEmployees());
  }, [dispatch, filterOpen, isAdmin]); [8]

  // View handlers
  const openView = useCallback((task) => {
    setTaskToView(task);
    setViewOpen(true);
  }, []); [8]

  const closeView = useCallback(() => {
    setViewOpen(false);
    setTaskToView(null);
  }, []); [8]

  // Edit handlers
  const openEdit = useCallback((task) => {
    setCurrentTaskToEdit(task);
    setEditModalOpen(true);
  }, []); [8]

  const closeEdit = useCallback(() => {
    setEditModalOpen(false);
    setCurrentTaskToEdit(null);
  }, []); [8]

  // Delete handler
  const handleDelete = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (e) {
      alert(e?.message || 'Failed to delete task.');
    }
  }, [dispatch]); [8]

  const getAssignedToName = useCallback((task, emps) => {
    if (!task.assignedTo) return 'Unassigned';
    if (typeof task.assignedTo === 'object') return task.assignedTo.name || 'Unknown';
    const emp = emps.find(e => e._id === task.assignedTo);
    return emp ? emp.name : 'Unknown Employee';
  }, []); [8]

  return (
    <div className="max-w-7xl mx-auto">
      {isAdmin && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <label className="font-medium text-gray-700 text-sm">Filter by Employee:</label>
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            onClick={() => setFilterOpen(true)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-orange-500 focus:border-orange-500 w-full sm:w-auto"
          >
            <option value="">All Employees</option>
            {employeeOptions.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
          {selectedEmployee && (
            <button
              type="button"
              onClick={() => setSelectedEmployee('')}
              className="ml-2 flex-shrink-0 px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      )} 

      <div className="mb-3 text-sm text-gray-700">
        <span className="mr-4">Completed: <strong>{completed}</strong></span>
        <span>Not Completed: <strong>{notCompleted}</strong></span>
      </div> 

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500 py-8 text-center text-sm col-span-full">No tasks found.</div>
        ) : (
          filteredTasks.map((task) => {
            const id = task._id || task.id;
            const isDeleting = !!deletingIds[id];

            const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
            const isOwner = isEmployee && currentUserId && String(assignedId) === String(currentUserId);

            // View always opens the view modal for everyone
            const viewHandler = () => openView(task);

            // Edit allowed for admin/owner only; Delete admin only
            // const editHandler = (isAdmin || isOwner) ? () => openEdit(task) : undefined;
            const deleteHandler = isAdmin ? () => handleDelete(id) : undefined;

            return (
              <TaskCard
                key={id}
                title={task.title}
                description={task.description}
                status={task.status}
                assignedTo={getAssignedToName(task, employeeOptions)}
                dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                checkList={task.checkList}
                deleting={isDeleting}
                onClick={() => navigate(`/task/${id}`)}  // Body click navigates to full page
                onView={viewHandler}                      // View shows read-only modal
                // onEditClick={editHandler}
                onDelete={deleteHandler}
              />
            );
          })
        )}
      </div>

      {/* View modal (read-only) */}
      <TaskViewModal
        isOpen={isViewOpen}
        onClose={closeView}
        task={taskToView}
        canEdit={(() => {
          if (!taskToView) return false;
          const assignedId = typeof taskToView.assignedTo === 'object' ? taskToView.assignedTo._id : taskToView.assignedTo;
          const isOwner = isEmployee && currentUserId && String(assignedId) === String(currentUserId);
          return isAdmin || isOwner;
        })()}
        onEdit={() => {
          // Transition from view -> edit
          if (taskToView) {
            closeView();
            openEdit(taskToView);
          }
        }}
      />

      {/* Edit modal */}
      <TaskEdit
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        taskToEdit={currentTaskToEdit}
      />
    </div>
  );
};

export default TaskList;
