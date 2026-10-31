import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { useEntityList } from '@/hooks/useEntityList';

const pillars = ['Film', 'Media', 'Design', 'Digital'];

export default function Services() {
  const { data, loading } = useEntityList('Service', { sort: 'display_order', limit: 100, filter: { published: true }, deps: [] });

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Capabilities across four disciplines."
        subtitle="Film, Media, Design and Digital — a creative studio capabilities document."
      />
      <section className="pb-24 md:pb-32 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {pillars.map((pillar, idx) => {
            const services = loading ? [] : data.filter((s) => s.pillar === pillar);
            if (!loading && services.length === 0) return null;
            return (
              <div key={pillar} className="mb-16 md:mb-24">
                <Reveal>
                  <div className="flex items-baseline gap-6 mb-10 border-b border-ecs-black/15 pb-6">
                    <span className="font-display text-sm text-ecs-gold">0{idx + 1}</span>
                    <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight">{pillar}</h2>
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {services.map((s, i) => (
                    <Reveal key={s.id} delay={i * 60}>
                      <div className="group">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-display text-2xl md:text-3xl font-light tracking-tight group-hover:text-ecs-gold transition-colors duration-500">
                            {s.title}
                          </h3>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-ecs-black/30">{pillar}</span>
                        </div>
                        {s.short_description && (
                          <p className="mt-3 text-sm md:text-base text-ecs-black/55 font-light leading-relaxed max-w-md">
                            {s.short_description}
                          </p>
                        )}
                        {s.capabilities && (
                          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ecs-black/40 leading-relaxed">
                            {s.capabilities}
                          </p>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}

          <Reveal>
            <div className="mt-16 pt-12 border-t border-ecs-black/15">
              <p className="font-display text-2xl md:text-4xl font-light leading-relaxed max-w-3xl text-balance">
                Physical printing is not a core in-house service. Where required, we prepare print-ready artwork and work with an external local printing partner.
              </p>
              <Link
                to="/contact"
                className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline"
              >
                Discuss a project <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
