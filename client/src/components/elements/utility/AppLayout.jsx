// AppLayout.jsx
import { Outlet, ScrollRestoration, useNavigationType, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { selectCurrentUser } from '../../../store/slices/authSlice';

function ScrollToTop() {
  const navType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'
  const { pathname } = useLocation();
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, navType]);
  return null;
}

export default function AppLayout() {
  const user = useSelector(selectCurrentUser);
  return (
    <>
      {user ? <Navbar /> : null}
      <ScrollToTop />
      <Outlet />
      <ScrollRestoration getKey={(location) => location.key} />
    </>
  );
}
