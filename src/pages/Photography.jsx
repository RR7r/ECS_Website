import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function Photography() {
  const { data, loading } = useEntityList('PhotographyEvent', { sort: 'display_order', limit: 50, filter: { published: true }, deps: [] });

  return (
    <>
      <PageHeader
        eyebrow="Photography"
        title="Through the lens."
        subtitle="A curated showcase of event photography. Full digital galleries are hosted on Pixieset."
      />
      <section className="pb-24 md:pb-32 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24">
              {data.map((evt, i) => (
                <Reveal key={evt.id}>
                  <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                    <div className="md:col-span-7 md:[direction:ltr]">
                      <Link to={`/photography/${evt.slug}`} className="group block relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-ecs-graphite">
                        <MediaPlaceholder
                          src={evt.cover_image}
                          alt={evt.event_title}
                          className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                          label="Event cover"
                        />
                        <span className="absolute top-4 left-4 label-eyebrow-muted text-ecs-white/70 z-10">
                          {evt.category}
                        </span>
                      </Link>
                    </div>
                    <div className="md:col-span-5 md:[direction:ltr]">
                      <p className="label-eyebrow mb-4">Event Photography</p>
                      <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight leading-tight">
                        {evt.event_title}
                      </h2>
                      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ecs-black/55">
                        {evt.location && <span>{evt.location}</span>}
                        {evt.date && <span>{evt.date}</span>}
                      </div>
                      {evt.short_description && (
                        <p className="mt-5 text-base text-ecs-black/60 font-light leading-relaxed max-w-md">
                          {evt.short_description}
                        </p>
                      )}
                      <Link
                        to={`/photography/${evt.slug}`}
                        className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline"
                      >
                        View Showcase <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}