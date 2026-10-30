const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Loader2, Search } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { logAudit } from '@/lib/cms/audit';

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export default function DashboardEnquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    let active = true;
    db.entities.Enquiry
      .filter({}, { sort: '-created_date', limit: 200 })
      .then((res) => { if (active) setItems(Array.isArray(res) ? res : res?.items || []); })
      .catch((err) => { if (active) setError(err.message || 'Could not load enquiries.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const changeStatus = async (enquiry, next) => {
    setWorkingId(enquiry.id);
    try {
      await db.entities.Enquiry.update(enquiry.id, { status: next });
      setItems((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, status: next } : e)));
      logAudit({ action: 'updated enquiry status', entity: 'Enquiry', title: enquiry.name, details: next });
    } catch (err) {
      setError(err.message || 'Could not update this enquiry.');
    } finally {
      setWorkingId(null);
    }
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((e) => {
      if (status !== 'all' && (e.status || 'new') !== status) return false;
      if (!term) return true;
      return `${e.name} ${e.email} ${e.project_type} ${e.message}`.toLowerCase().includes(term);
    });
  }, [items, search, status]);

  return (
    <DashboardShell eyebrow="Communication" title="Enquiries">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STATUSES.map((s) => {
          const count = items.filter((e) => (e.status || 'new') === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setStatus(status === s.value ? 'all' : s.value)}
              className={`bg-ecs-white border px-4 py-3 text-left transition-colors ${status === s.value ? 'border-ecs-gold' : 'border-ecs-black/10 hover:border-ecs-black/25'}`}
            >
              <p className="font-display text-2xl font-light">{count}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ecs-black/45 mt-1">{s.label}</p>
            </button>
          );
        })}
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ecs-black/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or message…"
          className="w-full bg-ecs-white border border-ecs-black/12 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? 'No enquiries yet' : 'Nothing matches'}
          description={items.length === 0 ? 'Submissions from the website contact form appear here automatically.' : 'Adjust the search or status filter.'}
        />
      ) : (
        <div className="space-y-4">
          {visible.map((e) => (
            <article key={e.id} className="bg-ecs-white border border-ecs-black/10 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-light">{e.name}</h3>
                    <StatusBadge status={e.status || 'new'} />
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5 text-xs text-ecs-black/55">
                    {e.email && <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-ecs-gold"><Mail size={12} /> {e.email}</a>}
                    {e.phone && <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 hover:text-ecs-gold"><Phone size={12} /> {e.phone}</a>}
                    {e.project_type && <span className="uppercase tracking-[0.16em]">{e.project_type}</span>}
                  </div>
                </div>
                <p className="text-xs text-ecs-black/40 whitespace-nowrap">
                  {e.created_date ? new Date(e.created_date).toLocaleString() : ''}
                </p>
              </div>
              <p className="text-sm text-ecs-black/70 font-light leading-relaxed whitespace-pre-line">{e.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => changeStatus(e, s.value)}
                    disabled={workingId === e.id || (e.status || 'new') === s.value}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] border transition-colors disabled:opacity-40 ${
                      (e.status || 'new') === s.value
                        ? 'bg-ecs-black text-ecs-white border-ecs-black'
                        : 'border-ecs-black/15 hover:border-ecs-gold'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}