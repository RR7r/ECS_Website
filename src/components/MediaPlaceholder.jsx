import { Image } from '@/components/ui/image';

/**
 * Replaceable media placeholder. Shows an elegant ECS-styled block when no
 * real image URL is supplied yet. Pass a real URL via `src` to render the
 * actual media. Never fakes a specific project/event — only atmospheric tone.
 */
export default function MediaPlaceholder({ src, alt, className = '', fittingType = 'fill', label = 'Replaceable media' }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        fittingType={fittingType}
      />
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-ecs-graphite ${className}`}
      role="img"
      aria-label={alt || label}
    >
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #C9A15A 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(135deg, #F5F4EF 0%, transparent 50%)' }} />
      <div className="absolute top-4 left-4 h-px w-10 gold-line opacity-50" />
      <div className="absolute top-4 right-4 h-px w-10 gold-line opacity-50" />
      <div className="absolute bottom-4 left-4 h-px w-10 gold-line opacity-50" />
      <div className="absolute bottom-4 right-4 h-px w-10 gold-line opacity-50" />
      <span className="label-eyebrow-muted text-ecs-white/40 z-10">{label}</span>
    </div>
  );
}