import { useState } from 'react';
import {
  ShieldCheck, TrendingUp, Activity, Briefcase, Eye, Mail,
  CheckCircle2, Clock, ArrowUpRight, Presentation, BarChart3,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';

// Isolated DEMO data for the executive presentation mode.
// This never touches live workspace data.
const STATS = [
  { label: 'Annual Revenue', value: '₹48.2L', delta: '+18%', icon: TrendingUp },
  { label: 'Active Projects', value: '12', delta: '+3', icon: Briefcase },
  { label: 'Client Retention', value: '94%', delta: '+2%', icon: CheckCircle2 },
  { label: 'Avg. Project Value', value: '₹4.0L', delta: '+9%', icon: BarChart3 },
];

const PIPELINE = [
  { name: 'Avira — Brand Film', stage: 'In Production', progress: 65 },
  { name: 'Zenith — Onam Campaign', stage: 'Editing', progress: 80 },
  { name: 'Evorza — Launch Film', stage: 'Pre-production', progress: 25 },
  { name: 'Eternal Esports — Identity', stage: 'Delivered', progress: 100 },
];

const ENQUIRIES = [
  { name: 'Maya Arts Collective', type: 'Documentary', date: '2 days ago' },
  { name: 'Coastal Resorts Kerala', type: 'Commercial', date: '5 days ago' },
  { name: 'Trivandrum Tech Fest', type: 'Event Coverage', date: '1 week ago' },
];

const ORDERS = [
  { id: 'ECS-1042', client: 'Avira Creative Works', value: '₹3.2L', status: 'Paid' },
  { id: 'ECS-1041', client: 'Zenith Fencing Academy', value: '₹1.8L', status: 'Invoiced' },
  { id: 'ECS-1040', client: 'Evorza', value: '₹2.4L', status: 'Paid' },
];

const ACTIVITY = [
  { text: 'Vijay Tribute moved to Editing & Post-Production', time: '1h ago' },
  { text: 'New enquiry from Coastal Resorts Kerala', time: '5h ago' },
  { text: 'Trivandrum in Motion cover uploaded', time: '1d ago' },
  { text: 'Zenith Onam gallery published to Pixieset', time: '2d ago' },
];

export default function ProfessionalControl() {
  const [presenting, setPresenting] = useState(false);

  return (
    <DashboardShell
      eyebrow="Executive Preview · Demo Data"
      title="Professional Control"
      actions={
        <button
          onClick={() => setPresenting((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-xs uppercase tracking-[0.22em] hover:bg-ecs-gold hover:text-ecs-black transition-colors"
        >
          <Presentation size={14} /> {presenting ? 'Exit Presentation' : 'Presentation Mode'}
        </button>
      }
    >
      <div className={`space-y-8 ${presenting ? 'text-lg' : ''}`}>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ecs-black text-ecs-white p-6">
              <div className="flex items-center justify-between mb-4">
                <s.icon size={18} className="text-ecs-gold" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-ecs-gold">{s.delta}</span>
              </div>
              <p className={`font-display font-light ${presenting ? 'text-5xl' : 'text-4xl'}`}>{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ecs-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="lg:col-span-2 bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><Briefcase size={18} className="text-ecs-gold" /> Project Pipeline</h2>
            <div className="space-y-4">
              {PIPELINE.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-ecs-black/50 text-xs uppercase tracking-[0.18em]">{p.stage}</span>
                  </div>
                  <div className="h-1 bg-ecs-black/10">
                    <div className="h-full bg-ecs-gold" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Center */}
          <div className="bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><Activity size={18} className="text-ecs-gold" /> Activity Center</h2>
            <ul className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <Clock size={14} className="text-ecs-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ecs-black/80">{a.text}</p>
                    <p className="text-xs text-ecs-black/40">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Enquiries */}
          <div className="bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><Mail size={18} className="text-ecs-gold" /> Recent Enquiries</h2>
            <ul className="divide-y divide-ecs-black/10">
              {ENQUIRIES.map((e) => (
                <li key={e.name} className="py-3 flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{e.name}</p>
                    <p className="text-xs text-ecs-black/50">{e.type}</p>
                  </div>
                  <p className="text-xs text-ecs-black/40">{e.date}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Orders */}
          <div className="bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><CheckCircle2 size={18} className="text-ecs-gold" /> Orders</h2>
            <ul className="divide-y divide-ecs-black/10">
              {ORDERS.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{o.client}</p>
                    <p className="text-xs text-ecs-black/40">{o.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{o.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-ecs-gold">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Business Performance + Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><BarChart3 size={18} className="text-ecs-gold" /> Business Performance</h2>
            <div className="flex items-end gap-2 h-40">
              {[40, 55, 48, 70, 62, 85, 78, 92].map((h, i) => (
                <div key={i} className="flex-1 bg-ecs-black/80 hover:bg-ecs-gold transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="mt-3 text-xs text-ecs-black/50 uppercase tracking-[0.18em]">Quarterly revenue trend</p>
          </div>

          <div className="bg-ecs-white border border-ecs-black/10 p-6">
            <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><Eye size={18} className="text-ecs-gold" /> Workflow Overview</h2>
            <ul className="space-y-3 text-sm">
              {[
                { stage: 'Pre-production', count: 3 },
                { stage: 'Production', count: 4 },
                { stage: 'Post-production', count: 3 },
                { stage: 'Delivered', count: 2 },
              ].map((w) => (
                <li key={w.stage} className="flex justify-between border-b border-ecs-black/5 pb-2">
                  <span>{w.stage}</span>
                  <span className="text-ecs-black/50">{w.count} projects</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Executive Actions */}
        <div className="bg-ecs-black text-ecs-white p-6">
          <h2 className="font-display text-xl font-light mb-5 flex items-center gap-2"><ShieldCheck size={18} className="text-ecs-gold" /> Executive Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Export Report', 'New Campaign', 'Team Review', 'Quarterly Close'].map((a) => (
              <button key={a} className="flex items-center justify-between px-4 py-3 bg-ecs-white/5 hover:bg-ecs-gold hover:text-ecs-black text-sm transition-colors">
                {a} <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}