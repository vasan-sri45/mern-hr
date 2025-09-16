import React, { useEffect } from 'react';
import TaskModal from './elements/task/TaskModel';
import TaskList from './elements/task/TaskList';
import { getTasks } from '../store/slices/task/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

const Loader = React.memo(() => (
  <div className="flex justify-center items-center min-h-screen">
    <p className="text-lg text-gray-700">Loading tasks...</p>
  </div>
));
Loader.displayName = 'Loader';

const ErrorDisplay = React.memo(({ error }) => (
  <div className="flex justify-center items-center min-h-screen text-center p-4">
    <p className="text-lg text-red-600">
      Failed to load tasks. Please try again later.
      {error && <span className="block text-sm mt-2">{error}</span>}
    </p>
  </div>
));
ErrorDisplay.displayName = 'ErrorDisplay';

const Task = () => {
  const dispatch = useDispatch();
  const { isModalOpen, closeModal, searchQuery } = useOutletContext();
  const { tasks = [], loading, error } = useSelector(state => state.tasks);

  useEffect(() => { dispatch(getTasks()); }, [dispatch]);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Tasks</h1>
        <p className="text-gray-600 text-sm sm:text-base">Here is a list of your current tasks.</p>
      </div>

      <TaskList tasks={safeTasks} searchQuery={searchQuery} />

      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Task;
