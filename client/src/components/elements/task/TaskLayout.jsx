import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import TaskTabs from './TaskTabs';

const TaskLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Shared search across tabs
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-5">
        <header className="mb-8">
          <TaskTabs
            onAssignedTabClick={openModal}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </header>

        <div>
          <Outlet context={{ isModalOpen, openModal, closeModal, searchQuery, setSearchQuery }} />
        </div>
      </main>
    </div>
  );
};

export default TaskLayout;
