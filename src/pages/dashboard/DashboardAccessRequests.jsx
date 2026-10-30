const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Loader2, Check, X, ShieldAlert } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { logAudit } from '@/lib/cms/audit';
import { ROLE_LABELS } from '@/lib/cms/roles';

export default function DashboardAccessRequests() {
  const [requests, setRequests] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState(null);

  const load = () => {
    setLoading(true);
    db.entities.AccessRequest
      .filter({}, { sort: '-created_date', limit: 200 })
      .then((res) => setRequests(Array.isArray(res) ? res : res?.items || []))
      .catch((err) => setError(err.message || 'Could not load access requests.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const review = async (request, approved) => {
    setWorkingId(request.id);
    setError('');
    try {
      const me = await db.auth.me();
      const role = roles[request.id] || request.requested_role || 'editor';
      await db.entities.AccessRequest.update(request.id, {
        status: approved ? 'approved' : 'rejected',
        reviewed_by: me?.email || '',
        reviewed_date: new Date().toISOString(),
        requested_role: role,
      });

      let linkedUser = null;
      try {
        const all = await db.entities.User.list();
        const list = Array.isArray(all) ? all : all?.items || [];
        linkedUser = list.find((u) => u.email?.toLowerCase() === request.email?.toLowerCase());
        if (linkedUser) {
          await db.entities.User.update(linkedUser.id, {
            cms_role: role,
            cms_status: approved ? 'approved' : 'rejected',
            role: role === 'admin' ? 'admin' : 'user',
          });
        }
      } catch {
        // the request itself is still recorded even if the account lookup fails
      }

      if (approved) {
        try {
          await db.integrations.Core.SendEmail({
            to: request.email,
            subject: 'Your Eternal Creative Studio dashboard access has been approved',
            body: 'Your access to the Eternal Creative Studio administrative dashboard has been approved. You can now sign in using your authorised Google account.',
          });
        } catch {
          // email delivery depends on the app's email configuration
        }
      }

      setRequests((prev) => prev.map((r) => (r.id === request.id
        ? { ...r, status: approved ? 'approved' : 'rejected', requested_role: role }
        : r)));
      logAudit({
        action: approved ? 'approved access request' : 'rejected access request',
        entity: 'AccessRequest',
        title: request.email,
        details: ROLE_LABELS[role],
      });
    } catch (err) {
      setError(err.message || 'Could not review this request.');
    } finally {
      setWorkingId(null);
    }
  };

  const pending = requests.filter((r) => r.status === 'pending');

  return (
    <DashboardShell eyebrow="Administration" title="Access Requests">
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Pending', value: pending.length },
          { label: 'Approved', value: requests.filter((r) => r.status === 'approved').length },
          { label: 'Rejected', value: requests.filter((r) => r.status === 'rejected').length },
        ].map((s) => (
          <div key={s.label} className="bg-ecs-white border border-ecs-black/10 px-4 py-3">
            <p className="font-display text-2xl font-light">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ecs-black/45 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No access requests"
          description="When an unapproved account signs in to the dashboard, its request appears here for review."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-ecs-white border border-ecs-black/10 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-medium truncate">{r.full_name || r.email}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-ecs-black/50 mt-1">{r.email}</p>
                <p className="text-[11px] text-ecs-black/40 mt-1">
                  Requested {r.created_date ? new Date(r.created_date).toLocaleString() : ''}
                  {r.reviewed_by ? ` · Reviewed by ${r.reviewed_by}` : ''}
                </p>
              </div>
              {r.status === 'pending' ? (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={roles[r.id] || r.requested_role || 'editor'}
                    onChange={(e) => setRoles((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    className="bg-transparent border border-ecs-black/15 px-2 py-1.5 text-xs focus:outline-none focus:border-ecs-gold"
                  >
                    {['admin', 'editor', 'photographer'].map((role) => (
                      <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => review(r, true)}
                    disabled={workingId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-ecs-black text-ecs-white text-[10px] uppercase tracking-[0.14em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
                  >
                    {workingId === r.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Approve
                  </button>
                  <button
                    onClick={() => review(r, false)}
                    disabled={workingId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-ecs-black/20 text-[10px] uppercase tracking-[0.14em] hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <X size={11} /> Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-ecs-black/40">
                  <ShieldAlert size={13} />
                  {r.status === 'approved' ? `Approved as ${ROLE_LABELS[r.requested_role] || 'Editor'}` : 'Access rejected'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}