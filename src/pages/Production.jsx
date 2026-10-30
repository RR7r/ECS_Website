import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function Production() {
  const { data, loading } = useEntityList('Production', { sort: 'display_order', limit: 50, filter: { published: true }, deps: [] });

  return (
    <>
      <PageHeader
        eyebrow="Production"
        title="Original productions."
        subtitle="The ECS production archive — film, documentary and post-production work from the studio."
        dark
      />
      <section className="pb-24 md:pb-32 bg-ecs-black text-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border border-ecs-white/20 border-t-ecs-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-12 md:space-y-20">
              {data.map((p, i) => (
                <Reveal key={p.id}>
                  <Link to={`/production/${p.slug}`} className="group block">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                      <div className="md:col-span-7">
                        <div className="relative aspect-[16/9] overflow-hidden bg-ecs-graphite">
                          <MediaPlaceholder
                            src={p.cover_image}
                            alt={p.title}
                            className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                            label="Production cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ecs-black/60 via-transparent to-transparent" />
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <p className="label-eyebrow text-ecs-gold mb-4">{p.production_number}</p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[0.98] group-hover:text-ecs-gold transition-colors duration-500">
                          {p.title}
                        </h2>
                        <p className="mt-4 text-sm uppercase tracking-[0.22em] text-ecs-white/55">{p.type}</p>
                        {p.short_description && (
                          <p className="mt-6 text-base text-ecs-white/60 font-light leading-relaxed max-w-md">
                            {p.short_description}
                          </p>
                        )}
                        <span className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-ecs-white/70 group-hover:text-ecs-gold transition-colors">
                          View Production <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
