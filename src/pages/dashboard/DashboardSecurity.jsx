const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck, KeyRound } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/lib/AuthContext';
import { ROLE_LABELS, resolveRole } from '@/lib/cms/roles';

export default function DashboardSecurity() {
  const { user } = useAuth();

  return (
    <DashboardShell eyebrow="Account" title="Security">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-ecs-gold" />
            <h2 className="font-display text-xl font-light">Session</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ecs-black/50">Signed in as</dt><dd>{user?.full_name || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-ecs-black/50">Email</dt><dd className="text-xs">{user?.email}</dd></div>
            <div className="flex justify-between"><dt className="text-ecs-black/50">Role</dt><dd>{ROLE_LABELS[resolveRole(user)] || '—'}</dd></div>
          </dl>
          <button
            onClick={() => db.auth.logout('/dashboard/login')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-ecs-black/20 text-[11px] uppercase tracking-[0.2em] hover:border-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={13} /> Sign out of this device
          </button>
        </section>

        <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound size={16} className="text-ecs-gold" />
            <h2 className="font-display text-xl font-light">Account protection</h2>
          </div>
          <p className="text-sm text-ecs-black/55 font-light leading-relaxed">
            Google sign-in uses the security and multi-factor authentication of your Google account. For email and password
            accounts, passwords are managed by the platform's authentication service.
          </p>
          <Link
            to="/forgot-password"
            className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ecs-gold link-underline"
          >
            Send a password reset
          </Link>
          <p className="mt-4 text-xs text-ecs-black/40 font-light leading-relaxed">
            Sessions expire automatically. Signing out ends this session immediately; revoked accounts lose dashboard access at their next request.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}