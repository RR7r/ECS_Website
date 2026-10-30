import { Mail, Phone } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useEntityList } from '@/hooks/useEntityList';

export default function DashboardMessages() {
  const { data, loading } = useEntityList('Enquiry', { sort: '-created_date', limit: 100, deps: [] });

  return (
    <DashboardShell eyebrow="Workspace" title="Messages">
      {loading ? (
        <p className="text-sm text-ecs-black/50">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-ecs-black/50">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((e) => (
            <div key={e.id} className="bg-ecs-white border border-ecs-black/10 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <p className="font-display text-lg font-light">{e.name}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-xs text-ecs-black/55">
                    {e.email && <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-ecs-gold"><Mail size={12} /> {e.email}</a>}
                    {e.phone && <span className="inline-flex items-center gap-1.5"><Phone size={12} /> {e.phone}</span>}
                    {e.project_type && <span className="uppercase tracking-[0.18em]">{e.project_type}</span>}
                  </div>
                </div>
                <p className="text-xs text-ecs-black/40 whitespace-nowrap">{new Date(e.created_date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-ecs-black/70 font-light leading-relaxed">{e.message}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}