// TableLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TableNav from './TableNav';

const TABS = [
  { id: 'all', label: 'All Tables', path: '/table', exact: true },
  { id: 'add', label: 'Add Table', path: '/table/create' }
];

const TableLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold text-gray-800">Tables</h1> */}
          {/* Removed the View Filters button and drawer trigger */}
        </div>
        {/* Sub-navbar here */}
        <TableNav activePath={location.pathname} tabs={TABS} />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
        <Outlet />
      </main>
    </div>
  );
};

export default TableLayout;
