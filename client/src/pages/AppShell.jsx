// src/AppShell.jsx (or main layout/root)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppShell({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => navigate('/login', { replace: true });
    window.addEventListener('app:unauthorized', handler);
    return () => window.removeEventListener('app:unauthorized', handler);
  }, [navigate]);

  return children;
}
