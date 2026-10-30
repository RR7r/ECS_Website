import { Navigate, useLocation } from 'react-router-dom';

/**
 * Shown by ProtectedRoute when the visitor is not authenticated.
 * Redirects to /login preserving the originally requested dashboard path
 * so the user returns to it after signing in.
 */
export default function AuthRedirect() {
  const loc = useLocation();
  const returnTo = loc.pathname + loc.search;
  return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
}