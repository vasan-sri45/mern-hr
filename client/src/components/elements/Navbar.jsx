import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logout, reset } from '../../store/slices/authSlice';
import Logo from '../../assets/logo.jpeg';

const navigationItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Task', path: '/task' },
  { name: 'Tables', path: '/table' },
  { name: 'Folder', path: '/folder' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!user) {
      dispatch(reset());
      navigate('/login', { replace: true });
    }
  }, [user, dispatch, navigate]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const linkBase = 'px-4 py-2 text-base font-medium rounded-lg transition-colors';
  const linkInactive = 'text-slate-700 hover:bg-slate-100 hover:text-slate-900';
  const linkActive = 'text-orange-600 bg-orange-50';

  return (
    <header className="bg-white border-b border-slate-200 px-4 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {/* {user?.name ? user.name[0]?.toUpperCase() : ''} */}
            <img src={Logo} alt='pic'/>
          </div>
          {/* <span className="font-semibold text-slate-800 hidden sm:block">{user?.name}</span> */}
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 z-50"
          onClick={toggleMobileMenu}
        >
          {/* Animated Hamburger/Close Icon */}
          <div className="w-6 h-5 flex flex-col justify-between items-center">
            <span className={`block h-0.5 w-full bg-slate-800 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block h-0.5 w-full bg-slate-800 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-slate-800 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
              end={item.path === '/'}
              viewTransition // Enable smooth transition
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Actions (Logout and SOS) */}
        <div className="hidden md:flex items-center gap-3">
            <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-slate-300 bg-white rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                Logout
            </button>
            <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
            >
                SOS
            </button>
        </div>
      </div>

      {/* Off-Canvas Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
      <nav
        className={`fixed top-0 left-0 h-full w-2/3 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 pt-20">
          <ul className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `block w-full text-left ${linkBase} ${isActive ? linkActive : linkInactive}`}
                  end={item.path === '/'}
                  onClick={toggleMobileMenu}
                  viewTransition
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4 flex flex-col gap-3">
            <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 border border-slate-300 bg-white rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                Logout
            </button>
            <button
                type="button"
                className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
            >
                SOS
            </button>
        </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;


