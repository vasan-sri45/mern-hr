import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  // Select the user object from your auth slice
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If the user object exists, they are authenticated. Render the nested route.
  // Otherwise, redirect to the login page, saving the intended destination.
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
