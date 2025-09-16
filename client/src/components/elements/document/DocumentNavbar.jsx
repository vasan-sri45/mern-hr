import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react';
import {useNavigate, useLocation} from 'react-router-dom';

const tabs = [
  { id: 'Overview', label: 'Overview', path: '/overview' },
  { id: 'Documents', label: 'Documents', path: '/overview/document' },
  { id: 'Tickets',   label: 'Tickets',   path: '/overview/ticket' },
  { id: 'Awareness & Training',   label: 'Awareness & Training',   path: '/overview/awarness' }
];
const DocumentNavbar = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

     const handleTabClick = (tab) => {
      navigate(tab.path);
      setIsMenuOpen(false); // Close menu on navigation
    };

    const activeTab = tabs.find(tab => location.pathname === tab.path);
    const activeTabId = activeTab ? activeTab.id : null;

  return (
    <div>
        <div className="mb-6">
          <button className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors" onClick={()=>navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>  
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Documents</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTabId === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
    </div>
  )
}

export default DocumentNavbar
