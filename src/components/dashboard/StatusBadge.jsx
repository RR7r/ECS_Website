const STYLES = {
  published: 'border-ecs-gold/40 bg-ecs-gold/10 text-ecs-gold',
  draft: 'border-ecs-black/15 bg-ecs-black/5 text-ecs-black/55',
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  approved: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-700',
  new: 'border-ecs-gold/40 bg-ecs-gold/10 text-ecs-gold',
  in_progress: 'border-blue-500/30 bg-blue-500/10 text-blue-700',
  completed: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700',
  archived: 'border-ecs-black/15 bg-ecs-black/5 text-ecs-black/45',
};

const LABELS = {
  published: 'Published',
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  new: 'New',
  in_progress: 'In progress',
  completed: 'Completed',
  archived: 'Archived',
};

export default function StatusBadge({ status, label }) {
  const key = status || 'draft';
  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${STYLES[key] || STYLES.draft}`}>
      {label || LABELS[key] || key}
    </span>
  );
}
