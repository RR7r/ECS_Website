import { Navigate, useLocation } from 'react-router-dom';

export default function DashboardAuthRedirect() {
  const loc = useLocation();
  const returnTo = loc.pathname + loc.search;
  return <Navigate to={`/dashboard/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
}