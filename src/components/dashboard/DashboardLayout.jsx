const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/lib/AuthContext';
import { canAccess, resolveRole, resolveStatus, ROLE_LABELS } from '@/lib/cms/roles';
import {
  LayoutDashboard, Camera, FolderKanban, Clapperboard, Layers, Home, Images,
  Mail, Calendar, Users, UserCheck, ShieldCheck, ScrollText, Settings,
  User as UserIcon, Lock, LogOut, ArrowLeft, Menu, X, Loader2,
} from 'lucide-react';

const GROUPS = [
  {
    title: 'Main',
    items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true, section: 'overview' }],
  },
  {
    title: 'Content Management',
    items: [
      { to: '/dashboard/photography', label: 'Photography', icon: Camera, section: 'photography' },
      { to: '/dashboard/projects', label: 'Projects / Work', icon: FolderKanban, section: 'projects' },
      { to: '/dashboard/productions', label: 'Productions', icon: Clapperboard, section: 'productions' },
      { to: '/dashboard/services', label: 'Services', icon: Layers, section: 'services' },
      { to: '/dashboard/homepage', label: 'Homepage Content', icon: Home, section: 'homepage' },
    ],
  },
  {
    title: 'Media',
    items: [{ to: '/dashboard/media', label: 'Media Library', icon: Images, section: 'media' }],
  },
  {
    title: 'Communication',
    items: [
      { to: '/dashboard/enquiries', label: 'Enquiries', icon: Mail, section: 'enquiries' },
      { to: '/dashboard/calendar', label: 'Calendar', icon: Calendar, section: 'calendar' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/dashboard/users', label: 'User Management', icon: Users, section: 'users' },
      { to: '/dashboard/access-requests', label: 'Access Requests', icon: UserCheck, section: 'access_requests' },
      { to: '/dashboard/roles', label: 'Roles & Permissions', icon: ShieldCheck, section: 'roles' },
      { to: '/dashboard/audit-logs', label: 'Audit Logs', icon: ScrollText, section: 'audit' },
      { to: '/dashboard/settings', label: 'Website Settings', icon: Settings, section: 'settings' },
    ],
  },
];

const ROUTE_SECTIONS = [
  ['/dashboard/photography', 'photography'],
  ['/dashboard/projects', 'projects'],
  ['/dashboard/productions', 'productions'],
  ['/dashboard/services', 'services'],
  ['/dashboard/homepage', 'homepage'],
  ['/dashboard/media', 'media'],
  ['/dashboard/files', 'media'],
  ['/dashboard/enquiries', 'enquiries'],
  ['/dashboard/messages', 'enquiries'],
  ['/dashboard/calendar', 'calendar'],
  ['/dashboard/users', 'users'],
  ['/dashboard/access-requests', 'access_requests'],
  ['/dashboard/roles', 'roles'],
  ['/dashboard/audit-logs', 'audit'],
  ['/dashboard/settings', 'settings'],
];

export default function DashboardLayout() {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => { meta.setAttribute('content', 'index, follow'); };
  }, []);

  useEffect(() => { setOpen(false); }, [user?.id]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-ecs-cream flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-ecs-gold" />
      </div>
    );
  }
  if (!user) return <Navigate to="/dashboard/login" replace />;

  const status = resolveStatus(user);
  if (status === 'pending') return <Navigate to="/dashboard/access-pending" replace />;
  if (status === 'rejected') return <Navigate to="/dashboard/access-denied" replace />;

  const role = resolveRole(user);
  const groups = GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => canAccess(user, i.section)) }))
    .filter((g) => g.items.length > 0);

  const routeSection = ROUTE_SECTIONS.find(([path]) => location.pathname.startsWith(path))?.[1];
  const sectionAllowed = !routeSection || canAccess(user, routeSection);

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-[13px] transition-colors ${
      isActive ? 'text-ecs-gold bg-ecs-white/5' : 'text-ecs-white/60 hover:text-ecs-white'
    }`;

  const Sidebar = ({ onNavigate }) => (
    <>
      <div className="px-6 py-6 border-b border-ecs-white/10">
        <Link to="/dashboard" onClick={onNavigate} className="font-display text-xl font-light tracking-tight">
          ECS <span className="text-ecs-gold">Workspace</span>
        </Link>
        <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-ecs-white/35">Eternal Creative Studio</p>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.22em] text-ecs-white/30">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={itemClass}>
                  <item.icon size={15} /> {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-5 pt-4 border-t border-ecs-white/10">
          <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.22em] text-ecs-white/30">Account</p>
          <div className="space-y-0.5">
            <NavLink to="/dashboard/profile" onClick={onNavigate} className={itemClass}><UserIcon size={15} /> My Profile</NavLink>
            <NavLink to="/dashboard/security" onClick={onNavigate} className={itemClass}><Lock size={15} /> Security</NavLink>
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-ecs-white/10">
        <div className="px-3 pb-3">
          <p className="text-[12px] text-ecs-white/80 truncate">{user.full_name || user.email}</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-ecs-gold mt-0.5">{ROLE_LABELS[role] || 'Team'}</p>
        </div>
        <Link to="/" className="flex items-center gap-3 px-3 py-2 text-[12px] text-ecs-white/50 hover:text-ecs-gold transition-colors">
          <ArrowLeft size={14} /> Back to website
        </Link>
        <button onClick={() => db.auth.logout('/dashboard/login')} className="w-full flex items-center gap-3 px-3 py-2 text-[12px] text-ecs-white/50 hover:text-ecs-gold transition-colors">
          <LogOut size={14} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ecs-cream">
      <aside className="fixed inset-y-0 left-0 w-64 bg-ecs-black text-ecs-white flex-col z-30 hidden md:flex">
        <Sidebar onNavigate={() => {}} />
      </aside>

      <header className="md:hidden sticky top-0 z-30 bg-ecs-black text-ecs-white px-5 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-display text-lg">ECS <span className="text-ecs-gold">Workspace</span></Link>
        <button onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </header>
      {open && (
        <div className="md:hidden fixed inset-0 top-[60px] z-20 bg-ecs-black text-ecs-white overflow-y-auto flex flex-col">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className="md:ml-64 min-w-0">
        {sectionAllowed ? (
          <Outlet />
        ) : (
          <div className="px-6 md:px-10 py-24 max-w-xl">
            <p className="label-eyebrow mb-3">Restricted</p>
            <h1 className="font-display text-3xl font-light">This section is outside your role.</h1>
            <p className="mt-4 text-sm text-ecs-black/55 font-light">
              Your account is signed in, but it does not have permission for this part of the workspace. Ask the studio administrator to change your role.
            </p>
            <Link to="/dashboard" className="mt-8 inline-block px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors">
              Back to overview
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}