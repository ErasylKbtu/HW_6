import { Navigate, Outlet, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth.js';
import { Loading } from '../components/StateViews.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading text="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}
