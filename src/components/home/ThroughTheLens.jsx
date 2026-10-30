import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import MediaPlaceholder from '../MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function ThroughTheLens() {
  const { data, loading } = useEntityList('PhotographyEvent', { sort: 'display_order', limit: 50, deps: [] });

  return (
    <section className="py-28 md:py-40 bg-ecs-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24">
          <div>
            <Reveal>
              <p className="label-eyebrow mb-5">Through the Lens</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight leading-[0.95]">
                Moments, framed.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <Link to="/photography" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline">
              All Collections <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {data.map((evt, i) => (
              <Reveal key={evt.id} delay={i * 100}>
                <Link to={`/photography/${evt.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ecs-graphite">
                    <MediaPlaceholder
                      src={evt.cover_image}
                      alt={evt.event_title}
                      className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                      label="Event cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ecs-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-ecs-white/70 mb-2">
                        {evt.category}
                      </p>
                      <h3 className="font-display text-xl md:text-2xl font-light text-ecs-white leading-tight">
                        {evt.event_title}
                      </h3>
                      <p className="mt-2 text-xs text-ecs-white/60">{evt.location} · {evt.date}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}