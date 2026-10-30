import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import LogoIntro from '@/components/LogoIntro';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Work from '@/pages/Work';
import WorkDetail from '@/pages/WorkDetail';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Photography from '@/pages/Photography';
import PhotographyDetail from '@/pages/PhotographyDetail';
import Production from '@/pages/Production';
import ProductionDetail from '@/pages/ProductionDetail';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardAuthRedirect from '@/components/dashboard/DashboardAuthRedirect';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardContent from '@/pages/dashboard/DashboardContent';
import DashboardContentEditor from '@/pages/dashboard/DashboardContentEditor';
import DashboardHomepage from '@/pages/dashboard/DashboardHomepage';
import DashboardMedia from '@/pages/dashboard/DashboardMedia';
import DashboardEnquiries from '@/pages/dashboard/DashboardEnquiries';
import DashboardCalendar from '@/pages/dashboard/DashboardCalendar';
import DashboardUsers from '@/pages/dashboard/DashboardUsers';
import DashboardAccessRequests from '@/pages/dashboard/DashboardAccessRequests';
import DashboardRoles from '@/pages/dashboard/DashboardRoles';
import DashboardAuditLogs from '@/pages/dashboard/DashboardAuditLogs';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';
import DashboardProfile from '@/pages/dashboard/DashboardProfile';
import DashboardSecurity from '@/pages/dashboard/DashboardSecurity';
import DashboardLogin from '@/pages/dashboard/DashboardLogin';
import AccessPending from '@/pages/dashboard/AccessPending';
import AccessDenied from '@/pages/dashboard/AccessDenied';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [introDone, setIntroDone] = useState(false);

  // Handle authentication errors (after loading completes)
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  const appReady = !isLoadingPublicSettings && !isLoadingAuth;

  return (
    <>
      {!introDone && <LogoIntro onComplete={() => setIntroDone(true)} appReady={appReady} />}
      {appReady && (
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Public website */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/photography/:slug" element={<PhotographyDetail />} />
            <Route path="/production" element={<Production />} />
            <Route path="/production/:slug" element={<ProductionDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enquiry" element={<Contact />} />
          </Route>

          {/* Private workspace */}
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route element={<ProtectedRoute unauthenticatedElement={<DashboardAuthRedirect />} />}>
            <Route path="/dashboard/access-pending" element={<AccessPending />} />
            <Route path="/dashboard/access-denied" element={<AccessDenied />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />

              <Route path="/dashboard/photography" element={<DashboardContent typeKey="photography" />} />
              <Route path="/dashboard/photography/new" element={<DashboardContentEditor typeKey="photography" />} />
              <Route path="/dashboard/photography/:id" element={<DashboardContentEditor typeKey="photography" />} />

              <Route path="/dashboard/projects" element={<DashboardContent typeKey="projects" />} />
              <Route path="/dashboard/projects/new" element={<DashboardContentEditor typeKey="projects" />} />
              <Route path="/dashboard/projects/:id" element={<DashboardContentEditor typeKey="projects" />} />

              <Route path="/dashboard/productions" element={<DashboardContent typeKey="productions" />} />
              <Route path="/dashboard/productions/new" element={<DashboardContentEditor typeKey="productions" />} />
              <Route path="/dashboard/productions/:id" element={<DashboardContentEditor typeKey="productions" />} />

              <Route path="/dashboard/services" element={<DashboardContent typeKey="services" />} />
              <Route path="/dashboard/services/new" element={<DashboardContentEditor typeKey="services" />} />
              <Route path="/dashboard/services/:id" element={<DashboardContentEditor typeKey="services" />} />

              <Route path="/dashboard/homepage" element={<DashboardHomepage />} />
              <Route path="/dashboard/media" element={<DashboardMedia />} />
              <Route path="/dashboard/enquiries" element={<DashboardEnquiries />} />
              <Route path="/dashboard/calendar" element={<DashboardCalendar />} />
              <Route path="/dashboard/users" element={<DashboardUsers />} />
              <Route path="/dashboard/access-requests" element={<DashboardAccessRequests />} />
              <Route path="/dashboard/roles" element={<DashboardRoles />} />
              <Route path="/dashboard/audit-logs" element={<DashboardAuditLogs />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/security" element={<DashboardSecurity />} />

              <Route path="/dashboard/messages" element={<DashboardEnquiries />} />
              <Route path="/dashboard/files" element={<DashboardMedia />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App