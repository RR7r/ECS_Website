const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, ShieldCheck, Check, Ban } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { logAudit } from '@/lib/cms/audit';
import { ROLE_LABELS, isSuperAdmin, resolveRole, resolveStatus } from '@/lib/cms/roles';
import { useAuth } from '@/lib/AuthContext';

const ROLE_OPTIONS = ['admin', 'editor', 'photographer'];

export default function DashboardUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    let active = true;
    db.entities.User.list()
      .then((res) => { if (active) setUsers(Array.isArray(res) ? res : res?.items || []); })
      .catch((err) => { if (active) setError(err.message || 'Only administrators can view all accounts.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const updateUser = async (target, patch, action) => {
    setWorkingId(target.id);
    setError('');
    try {
      await db.entities.User.update(target.id, patch);
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, ...patch } : u)));
      logAudit({ action, entity: 'User', title: target.email });
    } catch (err) {
      setError(err.message || 'Could not update this account.');
    } finally {
      setWorkingId(null);
    }
  };

  const changeRole = (target, cmsRole) => {
    if (isSuperAdmin(target)) return;
    updateUser(target, {
      cms_role: cmsRole,
      role: cmsRole === 'admin' ? 'admin' : 'user',
    }, `role changed to ${cmsRole}`);
  };

  const setAccess = (target, status) => {
    if (isSuperAdmin(target)) return;
    updateUser(target, { cms_status: status }, status === 'approved' ? 'access approved' : 'access revoked');
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => `${u.full_name} ${u.email}`.toLowerCase().includes(term));
  }, [users, search]);

  const admin = me?.role === 'admin';

  return (
    <DashboardShell eyebrow="Administration" title="User Management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div className="relative max-w-md w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ecs-black/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full bg-ecs-white border border-ecs-black/12 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
          />
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-ecs-black/40">{users.length} account{users.length === 1 ? '' : 's'}</p>
      </div>

      {!admin && (
        <p className="mb-4 text-sm text-ecs-black/55">Only platform administrators can list and change accounts.</p>
      )}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : visible.length === 0 ? (
        <EmptyState title="No accounts found" description="Users appear here once they sign in or are invited." />
      ) : (
        <div className="bg-ecs-white border border-ecs-black/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-ecs-black/45 border-b border-ecs-black/10">
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">CMS role</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => {
                const superAdmin = isSuperAdmin(u);
                const status = resolveStatus(u);
                return (
                  <tr key={u.id} className="border-b border-ecs-black/5">
                    <td className="px-4 py-3">
                      <p className="font-medium flex items-center gap-2">
                        {u.full_name || u.email}
                        {superAdmin && <ShieldCheck size={14} className="text-ecs-gold" />}
                      </p>
                      <p className="text-xs text-ecs-black/45">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {superAdmin ? (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-ecs-gold">Super Admin</span>
                      ) : (
                        <select
                          value={resolveRole(u)}
                          onChange={(e) => changeRole(u, e.target.value)}
                          disabled={!admin || workingId === u.id}
                          className="bg-transparent border border-ecs-black/15 px-2 py-1.5 text-xs focus:outline-none focus:border-ecs-gold disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3 text-xs text-ecs-black/45">
                      {u.created_date ? new Date(u.created_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!superAdmin && status !== 'approved' && (
                          <button
                            onClick={() => setAccess(u, 'approved')}
                            disabled={!admin || workingId === u.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-emerald-600/30 text-emerald-700 text-[10px] uppercase tracking-[0.12em] hover:bg-emerald-50 disabled:opacity-40"
                          >
                            <Check size={11} /> Approve
                          </button>
                        )}
                        {!superAdmin && status === 'approved' && (
                          <button
                            onClick={() => setAccess(u, 'rejected')}
                            disabled={!admin || workingId === u.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-500/30 text-red-600 text-[10px] uppercase tracking-[0.12em] hover:bg-red-50 disabled:opacity-40"
                          >
                            <Ban size={11} /> Revoke
                          </button>
                        )}
                        {superAdmin && <span className="text-[10px] text-ecs-black/30">Protected</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}