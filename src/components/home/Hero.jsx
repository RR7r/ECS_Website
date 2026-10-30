import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useEntityList } from '@/hooks/useEntityList';
import { DEFAULT_HOMEPAGE } from '@/lib/cms/config';

export default function Hero() {
  const { data } = useEntityList('HomepageContent', { limit: 1 });
  const hp = { ...DEFAULT_HOMEPAGE, ...(data[0] || {}) };

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ecs-black">
      {/* Background media */}
      <div className="absolute inset-0">
        <Image
          src={hp.hero_image}
          alt="Cinematic atmosphere — Eternal Creative Studio"
          className="w-full h-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ecs-black/70 via-ecs-black/40 to-ecs-black/85" />
        <div className="absolute inset-0 bg-ecs-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] w-full px-6 md:px-10">
          <div className="max-w-4xl">
            <p className="label-eyebrow text-ecs-gold mb-6 opacity-0 animate-[fadeIn_1s_ease_forwards] [animation-delay:200ms]">
              {hp.hero_eyebrow}
            </p>
            <h1 className="font-display text-ecs-white font-light leading-[0.92] tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl opacity-0 animate-[fadeIn_1.2s_ease_forwards] [animation-delay:400ms]">
              {hp.hero_line1}
              <br />
              {hp.hero_line2}
            </h1>
            <p className="mt-8 font-display italic text-2xl md:text-3xl text-ecs-white/80 opacity-0 animate-[fadeIn_1s_ease_forwards] [animation-delay:900ms]">
              {hp.hero_tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-ecs-white/15">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/work" className="text-[11px] uppercase tracking-[0.28em] text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline">
            Selected Work
          </Link>
          <div className="hidden md:flex items-center gap-2 text-ecs-white/50">
            <span className="text-[11px] uppercase tracking-[0.28em]">Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </div>
          <Link to="/contact" className="text-[11px] uppercase tracking-[0.28em] text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline">
            Start a Project
          </Link>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}