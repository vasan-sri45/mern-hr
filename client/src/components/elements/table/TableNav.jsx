import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { NavLink } from 'react-router-dom';

const TabLink = React.memo(function TabLink({ to, label, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        [
          'relative inline-flex items-center justify-center px-1.5 py-2 text-sm font-medium transition-colors duration-150',
          isActive ? 'text-orange-600' : 'text-gray-700 hover:text-gray-900',
          'border-b-2',
          isActive ? 'border-orange-600' : 'border-transparent hover:border-gray-300',
        ].join(' ')
      }
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      {label}
    </NavLink>
  );
});

TabLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

const TableNav = React.memo(function TableNav({ tabs = [] }) {
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === 'admin';

  const visibleTabs = useMemo(
    () => tabs.filter((t) => (t.id === 'add' ? isAdmin : true)),
    [tabs, isAdmin]
  );

  return (
    <nav aria-label="Tables sub navigation" className="w-full border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4">
          {visibleTabs.map((tab) => (
            <TabLink
              key={tab.id}
              to={tab.path}
              label={tab.label}
              exact={!!tab.exact || tab.path === '/table'}
            />
          ))}
        </div>
      </div>
    </nav>
  );
});

TableNav.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      exact: PropTypes.bool,
    })
  ).isRequired,
};

TableNav.displayName = 'TableNav';
export default TableNav;
