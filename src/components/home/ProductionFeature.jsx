import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import MediaPlaceholder from '../MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function ProductionFeature() {
  const { data, loading } = useEntityList('Production', { sort: 'display_order', limit: 50, deps: [] });
  if (loading) return null;
  if (!data.length) return null;

  const featured = data.find((p) => p.featured) || data[0];
  const secondary = data.find((p) => p.id !== featured.id) || null;

  return (
    <section className="bg-ecs-black text-ecs-white py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-eyebrow text-ecs-gold">Production</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={80}>
              <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight leading-tight">
                Original productions from the studio.
              </h2>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <Link to={`/production/${featured.slug}`} className="group block relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ecs-graphite">
            <MediaPlaceholder
              src={featured.cover_image}
              alt={featured.title}
              className="w-full h-full transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              label="Production cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ecs-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <p className="label-eyebrow text-ecs-gold mb-3">{featured.production_number} — Featured</p>
              <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ecs-white/60">{featured.type}</p>
            </div>
            <div className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full border border-ecs-white/40 flex items-center justify-center group-hover:bg-ecs-gold group-hover:border-ecs-gold transition-all duration-500">
              <ArrowUpRight size={18} className="text-ecs-white group-hover:text-ecs-black transition-colors" />
            </div>
          </Link>
        </Reveal>

        {secondary && (
          <Reveal delay={120}>
            <Link to={`/production/${secondary.slug}`} className="group mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center border-t border-ecs-white/15 pt-8">
              <div className="md:col-span-2">
                <span className="label-eyebrow text-ecs-gold">{secondary.production_number}</span>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-display text-2xl md:text-4xl font-light tracking-tight group-hover:text-ecs-gold transition-colors duration-500">
                  {secondary.title}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-ecs-white/50">{secondary.type}</p>
              </div>
              <div className="md:col-span-3 flex md:justify-end">
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-ecs-white/70 group-hover:text-ecs-gold transition-colors">
                  View <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}