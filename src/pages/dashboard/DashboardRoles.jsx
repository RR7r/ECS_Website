import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { ROLE_MATRIX } from '@/lib/cms/roles';

export default function DashboardRoles() {
  return (
    <DashboardShell
      eyebrow="Administration"
      title="Roles & Permissions"
      actions={
        <Link to="/dashboard/users" className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors">
          Assign roles <ArrowUpRight size={13} />
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLE_MATRIX.map((r) => (
          <section key={r.role} className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              {r.role === 'super_admin' && <ShieldCheck size={15} className="text-ecs-gold" />}
              <h2 className="font-display text-2xl font-light">{r.label}</h2>
            </div>
            <p className="text-sm text-ecs-black/55 font-light leading-relaxed">{r.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {r.permissions.map((p) => (
                <li key={p} className="text-xs text-ecs-black/65 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-ecs-gold shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-6 border border-ecs-black/10 bg-ecs-cream/60 p-5 text-sm text-ecs-black/60 font-light leading-relaxed">
        The Super Admin account is fixed and cannot be demoted or removed from this dashboard. Backend rules also restrict
        content writes to administrators and to the author of each record, so permissions are enforced on the server, not only for
        users who are logged in.
      </div>
    </DashboardShell>
  );
}
