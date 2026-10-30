import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import { useEntityList } from '@/hooks/useEntityList';

const pillars = ['Film', 'Media', 'Design', 'Digital'];

export default function ServicesPreview() {
  const { data, loading } = useEntityList('Service', { sort: 'display_order', limit: 50, deps: [] });

  return (
    <section className="py-28 md:py-40 bg-ecs-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-20">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-eyebrow">Services</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={80}>
              <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight leading-tight">
                What we make, and how we make it.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-ecs-black/15">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
            </div>
          ) : (
            pillars.map((pillar, idx) => {
              const services = data.filter((s) => s.pillar === pillar);
              return (
                <Reveal key={pillar} delay={idx * 80}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 border-b border-ecs-black/15">
                    <div className="md:col-span-3 flex items-start gap-4">
                      <span className="font-display text-sm text-ecs-gold mt-1">0{idx + 1}</span>
                      <h3 className="font-display text-3xl md:text-4xl font-light tracking-tight">{pillar}</h3>
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {services.map((s) => (
                          <span key={s.id} className="text-sm md:text-base text-ecs-black/65 font-light">
                            {s.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-1 flex md:justify-end items-start">
                      <Link to="/services" className="text-ecs-black/40 hover:text-ecs-gold transition-colors">
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}