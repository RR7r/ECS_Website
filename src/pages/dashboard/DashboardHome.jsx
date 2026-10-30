const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, FolderKanban, Clapperboard, Layers, Plus, ArrowUpRight, Mail,
  Users, FileText, ShieldAlert, Image as ImageIcon, Loader2,
} from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/lib/AuthContext';
import { canAccess } from '@/lib/cms/roles';

async function safeCount(entity, query = {}) {
  try { return await db.entities[entity].count(query); } catch { return 0; }
}
async function safeList(entity, options) {
  try {
    const res = await db.entities[entity].filter({}, options);
    return Array.isArray(res) ? res : res?.items || [];
  } catch { return []; }
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [
          photoPub, photoAll, projectPub, projectAll, prodPub, prodAll,
          servicePub, serviceAll, pendingRequests, newEnquiries, users,
          recentPhotos, recentProjects, recentProductions, enquiries, audit,
        ] = await Promise.all([
          safeCount('PhotographyEvent', { published: true }),
          safeCount('PhotographyEvent'),
          safeCount('Project', { published: true }),
          safeCount('Project'),
          safeCount('Production', { published: true }),
          safeCount('Production'),
          safeCount('Service', { published: true }),
          safeCount('Service'),
          safeCount('AccessRequest', { status: 'pending' }),
          safeCount('Enquiry', { status: 'new' }),
          safeList('User', { limit: 100 }),
          safeList('PhotographyEvent', { sort: '-updated_date', limit: 3 }),
          safeList('Project', { sort: '-updated_date', limit: 3 }),
          safeList('Production', { sort: '-updated_date', limit: 3 }),
          safeList('Enquiry', { sort: '-created_date', limit: 5 }),
          safeList('AuditLog', { sort: '-created_date', limit: 8 }),
        ]);
        if (!active) return;

        const recentContent = [
          ...recentPhotos.map((r) => ({ id: r.id, title: r.event_title, type: 'Photography', published: r.published, updated: r.updated_date, href: `/dashboard/photography/${r.id}` })),
          ...recentProjects.map((r) => ({ id: r.id, title: r.title, type: 'Project', published: r.published, updated: r.updated_date, href: `/dashboard/projects/${r.id}` })),
          ...recentProductions.map((r) => ({ id: r.id, title: r.title, type: 'Production', published: r.published, updated: r.updated_date, href: `/dashboard/productions/${r.id}` })),
        ]
          .sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0))
          .slice(0, 6);

        setData({
          photoPub, photoDraft: photoAll - photoPub,
          projectPub, projectDraft: projectAll - projectPub,
          prodPub, prodDraft: prodAll - prodPub,
          servicePub, serviceDraft: serviceAll - servicePub,
          pendingRequests, newEnquiries,
          users: users.length,
          recentContent, enquiries, audit,
        });
      } catch (err) {
        if (active) setError(err.message || 'Could not load dashboard data.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const primary = data ? [
    { label: 'Photography events', value: data.photoPub, sub: `${data.photoDraft} draft`, to: '/dashboard/photography', icon: Camera },
    { label: 'Published projects', value: data.projectPub, sub: `${data.projectDraft} draft`, to: '/dashboard/projects', icon: FolderKanban },
    { label: 'Productions', value: data.prodPub, sub: `${data.prodDraft} draft`, to: '/dashboard/productions', icon: Clapperboard },
    { label: 'Services', value: data.servicePub, sub: `${data.serviceDraft} draft`, to: '/dashboard/services', icon: Layers },
  ] : [];

  const totalDrafts = data ? data.photoDraft + data.projectDraft + data.prodDraft + data.serviceDraft : 0;

  const quickActions = [
    { label: 'New Photography Event', to: '/dashboard/photography/new', icon: Camera, section: 'photography' },
    { label: 'New Project', to: '/dashboard/projects/new', icon: FolderKanban, section: 'projects' },
    { label: 'New Production', to: '/dashboard/productions/new', icon: Clapperboard, section: 'productions' },
    { label: 'Upload Media', to: '/dashboard/media', icon: ImageIcon, section: 'media' },
    { label: 'Manage Users', to: '/dashboard/users', icon: Users, section: 'users' },
  ].filter((a) => canAccess(user, a.section));

  return (
    <DashboardShell
      eyebrow={`Workspace · ${user?.full_name || user?.email || ''}`}
      title="Overview"
      actions={
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 border border-ecs-black/20 text-[11px] uppercase tracking-[0.2em] hover:border-ecs-gold transition-colors">
          View website <ArrowUpRight size={13} />
        </Link>
      }
    >
      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 size={22} className="animate-spin text-ecs-gold" /></div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {primary.map((s) => (
              <Link key={s.label} to={s.to} className="group bg-ecs-white p-5 border border-ecs-black/10 hover:border-ecs-gold transition-colors">
                <div className="flex items-start justify-between">
                  <s.icon size={16} className="text-ecs-gold" />
                  <ArrowUpRight size={13} className="text-ecs-black/20 group-hover:text-ecs-gold transition-colors" />
                </div>
                <p className="font-display text-4xl font-light mt-5">{s.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ecs-black/50">{s.label}</p>
                <p className="mt-2 text-[11px] text-ecs-black/35">{s.sub}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
            {[
              { label: 'Drafts awaiting publication', value: totalDrafts, to: '/dashboard/photography', icon: FileText },
              { label: 'Pending access requests', value: data.pendingRequests, to: '/dashboard/access-requests', icon: ShieldAlert },
              { label: 'Authorised users', value: data.users, to: '/dashboard/users', icon: Users },
              { label: 'New enquiries', value: data.newEnquiries, to: '/dashboard/enquiries', icon: Mail },
            ].map((s) => (
              <Link key={s.label} to={s.to} className="bg-ecs-cream/70 p-4 border border-ecs-black/8 hover:border-ecs-gold/60 transition-colors">
                <s.icon size={14} className="text-ecs-black/40" />
                <p className="font-display text-2xl font-light mt-3">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-ecs-black/45 mt-1 leading-tight">{s.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-light">Recently modified content</h2>
                <Link to="/dashboard/photography" className="text-[10px] uppercase tracking-[0.18em] text-ecs-gold link-underline">Content</Link>
              </div>
              {data.recentContent.length === 0 ? (
                <p className="text-sm text-ecs-black/45 py-6">No content yet.</p>
              ) : (
                <ul className="divide-y divide-ecs-black/8">
                  {data.recentContent.map((r) => (
                    <li key={`${r.type}-${r.id}`}>
                      <Link to={r.href} className="flex items-center justify-between gap-4 py-3 group">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-ecs-gold transition-colors">{r.title || 'Untitled'}</p>
                          <p className="text-[11px] text-ecs-black/40">{r.type}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <StatusBadge status={r.published ? 'published' : 'draft'} />
                          <span className="text-[11px] text-ecs-black/35">{r.updated ? new Date(r.updated).toLocaleDateString() : '—'}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <h2 className="font-display text-xl font-light mb-4">Quick actions</h2>
              <div className="space-y-2">
                {quickActions.map((a) => (
                  <Link key={a.to} to={a.to} className="flex items-center justify-between px-4 py-3 bg-ecs-cream hover:bg-ecs-black hover:text-ecs-white transition-colors text-sm group">
                    <span className="flex items-center gap-2.5"><a.icon size={14} className="text-ecs-gold" /> {a.label}</span>
                    <Plus size={13} className="opacity-40 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-light">Recent enquiries</h2>
                <Link to="/dashboard/enquiries" className="text-[10px] uppercase tracking-[0.18em] text-ecs-gold link-underline">View all</Link>
              </div>
              {data.enquiries.length === 0 ? (
                <p className="text-sm text-ecs-black/45 py-6">No enquiries yet. Submissions from the website will appear here.</p>
              ) : (
                <ul className="divide-y divide-ecs-black/8">
                  {data.enquiries.map((e) => (
                    <li key={e.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{e.name}</p>
                        <p className="text-[11px] text-ecs-black/45 truncate">{e.project_type || e.email}</p>
                      </div>
                      <StatusBadge status={e.status || 'new'} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-light">Recent administrative activity</h2>
                {canAccess(user, 'audit') && (
                  <Link to="/dashboard/audit-logs" className="text-[10px] uppercase tracking-[0.18em] text-ecs-gold link-underline">Audit log</Link>
                )}
              </div>
              {data.audit.length === 0 ? (
                <p className="text-sm text-ecs-black/45 py-6">No recorded activity yet.</p>
              ) : (
                <ul className="divide-y divide-ecs-black/8">
                  {data.audit.map((a) => (
                    <li key={a.id} className="py-3">
                      <p className="text-sm">
                        <span className="text-ecs-gold">{a.action}</span>
                        {a.record_title ? ` — ${a.record_title}` : ''}
                      </p>
                      <p className="text-[11px] text-ecs-black/40 mt-0.5">
                        {a.actor_name || a.actor_email || 'Unknown'} · {a.created_date ? new Date(a.created_date).toLocaleString() : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}