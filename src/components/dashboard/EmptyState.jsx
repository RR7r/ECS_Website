export default function EmptyState({ title, description, action }) {
  return (
    <div className="border border-dashed border-ecs-black/20 bg-ecs-white/60 px-6 py-14 text-center">
      <p className="font-display text-2xl font-light">{title}</p>
      {description && <p className="mt-2 text-sm text-ecs-black/55 font-light max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}