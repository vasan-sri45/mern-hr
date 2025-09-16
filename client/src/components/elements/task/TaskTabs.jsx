import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Menu, X } from 'lucide-react';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { useSelector } from 'react-redux';

const TABS_CONFIG = [
  { id: 'assigned', label: 'Assigned', path: '/task', is_admin_only: false },
  { id: 'approved', label: 'Approved', path: '/task/approved', is_admin_only: false },
  { id: 'rework',   label: 'Rework',   path: '/task/rework', is_admin_only: false },
  { id: 'status',   label: 'Status',   path: '/task/status', is_admin_only: true },
];

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const TaskTabs = ({ onAssignedTabClick, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;

  const visibleTabs = useMemo(
    () => (isAdmin ? TABS_CONFIG : TABS_CONFIG.filter(tab => !tab.is_admin_only)),
    [isAdmin]
  );

  const activeTabId = useMemo(
    () => visibleTabs.find(tab => location.pathname === tab.path)?.id,
    [location.pathname, visibleTabs]
  );

  const handleTabClick = useCallback((tab) => {
    navigate(tab.path);
    setIsMenuOpen(false);
  }, [navigate]);

  return (
    <>
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 sm:hidden rounded-md hover:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          <div className="hidden sm:flex overflow-x-auto gap-2 sm:gap-4">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                  activeTabId === tab.id ? 'bg-orange-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-controls="task-content-panel"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop search */}
        <div className="flex-1 mx-4 hidden sm:block">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            aria-label="Search tasks"
          />
        </div>

        {isAdmin && (
          <button
            onClick={onAssignedTabClick}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm rounded-md font-medium bg-orange-600 text-white shadow hover:bg-orange-700"
            aria-label="Add new task"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        )}
      </div>

      {/* Mobile off-canvas */}
      <div className={`fixed inset-0 z-40 sm:hidden transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className={`relative flex flex-col h-full w-64 max-w-[80vw] bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform-none' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close menu">
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3"
              aria-label="Search tasks"
            />
          </div>

          <nav className="flex flex-col gap-2 p-4 pt-0">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-4 py-3 text-base rounded-md font-medium transition-colors ${
                  activeTabId === tab.id ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-controls="task-content-panel"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div id="task-content-panel" />
    </>
  );
};

export default TaskTabs;


