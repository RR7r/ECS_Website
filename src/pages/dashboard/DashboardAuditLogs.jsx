const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import EmptyState from '@/components/dashboard/EmptyState';

export default function DashboardAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    db.entities.AuditLog
      .filter({}, { sort: '-created_date', limit: 200 })
      .then((res) => { if (active) setLogs(Array.isArray(res) ? res : res?.items || []); })
      .catch((err) => { if (active) setError(err.message || 'Only administrators can read the audit log.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter((l) => `${l.actor_email} ${l.action} ${l.record_title} ${l.entity_name}`.toLowerCase().includes(term));
  }, [logs, search]);

  return (
    <DashboardShell eyebrow="Administration" title="Audit Log">
      <div className="relative mb-5 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ecs-black/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activity…"
          className="w-full bg-ecs-white border border-ecs-black/12 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : visible.length === 0 ? (
        <EmptyState title="No recorded activity" description="Publishing, edits, deletions and access decisions are recorded here." />
      ) : (
        <div className="bg-ecs-white border border-ecs-black/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-ecs-black/45 border-b border-ecs-black/10">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Record</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} className="border-b border-ecs-black/5 align-top">
                  <td className="px-4 py-3 text-xs text-ecs-black/50 whitespace-nowrap">
                    {l.created_date ? new Date(l.created_date).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{l.actor_name || l.actor_email || '—'}</p>
                    <p className="text-[10px] text-ecs-black/35">{l.actor_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-ecs-gold capitalize">{l.action}</span>
                    {l.details && <p className="text-[10px] text-ecs-black/40 mt-0.5">{l.details}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-ecs-black/60">
                    {l.record_title || '—'}
                    {l.entity_name && <p className="text-[10px] text-ecs-black/35">{l.entity_name}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}