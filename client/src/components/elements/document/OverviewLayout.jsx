// src/pages/TaskLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DocumentNavbar from './DocumentNavbar';

const OverviewLayout = () => {
  
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-5">
      <DocumentNavbar/>
      <div>
        {/* Child routes will be rendered here */}
        <Outlet/>
      </div>
      </main>
    </div>
  );
};

export default OverviewLayout;
