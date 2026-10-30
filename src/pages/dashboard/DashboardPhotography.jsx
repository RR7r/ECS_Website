import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useEntityList } from '@/hooks/useEntityList';

export default function DashboardPhotography() {
  const { data, loading } = useEntityList('PhotographyEvent', { sort: 'display_order', limit: 50, deps: [] });

  return (
    <DashboardShell eyebrow="Workspace" title="Photography">
      {loading ? (
        <p className="text-sm text-ecs-black/50">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-ecs-black/50">No collections yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((e) => (
            <div key={e.id} className="bg-ecs-white border border-ecs-black/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="label-eyebrow-muted mb-1">{e.category || 'Event Photography'}</p>
                <h3 className="font-display text-xl font-light">{e.event_title}</h3>
                <p className="mt-1 text-xs text-ecs-black/50">{e.location} · {e.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link to={`/photography/${e.slug}`} className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-ecs-gold link-underline">
                  Showcase <ArrowUpRight size={12} />
                </Link>
                {e.pixieset_url && (
                  <a href={e.pixieset_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-ecs-black/60 hover:text-ecs-gold">
                    Pixieset <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}