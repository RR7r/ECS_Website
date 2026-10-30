const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/lib/AuthContext';
import { ROLE_LABELS, resolveRole, resolveStatus } from '@/lib/cms/roles';

export default function DashboardProfile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await db.auth.updateMe({ full_name: fullName });
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell eyebrow="Account" title="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={save} className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
          <h2 className="font-display text-xl font-light mb-5">Profile</h2>
          <label className="label-eyebrow-muted block mb-2">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent border-b border-ecs-black/25 py-2 text-base font-light focus:outline-none focus:border-ecs-gold"
          />
          <p className="mt-2 text-xs text-ecs-black/45">{user?.email}</p>
          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
          </button>
        </form>

        <div className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
          <h2 className="font-display text-xl font-light mb-5">Access</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><dt className="text-ecs-black/50">CMS role</dt><dd>{ROLE_LABELS[resolveRole(user)] || '—'}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ecs-black/50">Access status</dt><dd><StatusBadge status={resolveStatus(user)} /></dd></div>
            <div className="flex justify-between items-center"><dt className="text-ecs-black/50">Platform role</dt><dd className="capitalize">{user?.role || '—'}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ecs-black/50">Email</dt><dd className="text-xs">{user?.email}</dd></div>
          </dl>
        </div>
      </div>
    </DashboardShell>
  );
}