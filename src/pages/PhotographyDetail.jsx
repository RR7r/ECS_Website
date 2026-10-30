import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityBySlug } from '@/hooks/useEntityList';

export default function PhotographyDetail() {
  const { slug } = useParams();
  const { data: evt, loading } = useEntityBySlug('PhotographyEvent', slug, { onlyPublished: true });

  if (loading) {
    return (
      <div className="pt-40 min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!evt) {
    return (
      <div className="pt-40 pb-40 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="label-eyebrow mb-4">Not Found</p>
        <h1 className="font-display text-4xl font-light mb-6">This collection doesn't exist.</h1>
        <Link to="/photography" className="text-sm uppercase tracking-[0.22em] link-underline">Back to Photography</Link>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <Link to="/photography" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ecs-black/50 hover:text-ecs-gold transition-colors mb-8">
              <ArrowLeft size={14} /> Back to Photography
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <p className="label-eyebrow mb-5">{evt.category}</p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.95] max-w-4xl">
              {evt.event_title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
              {evt.location && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Location</p>
                  <p className="text-sm">{evt.location}</p>
                </div>
              )}
              {evt.date && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Date</p>
                  <p className="text-sm">{evt.date}</p>
                </div>
              )}
              {evt.year && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Year</p>
                  <p className="text-sm">{evt.year}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ecs-white pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ecs-graphite">
              <MediaPlaceholder src={evt.cover_image} alt={evt.event_title} className="w-full h-full" label="Event cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {evt.short_description && (
        <section className="py-16 md:py-24 bg-ecs-cream">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-3">
                <Reveal><p className="label-eyebrow">About this event</p></Reveal>
              </div>
              <div className="md:col-span-8">
                <Reveal delay={80}>
                  <p className="font-display text-2xl md:text-3xl font-light leading-relaxed text-balance">
                    {evt.short_description}
                  </p>
                </Reveal>
                {evt.full_description && (
                  <Reveal delay={140}>
                    <p className="mt-6 text-base text-ecs-black/60 font-light leading-relaxed whitespace-pre-line max-w-2xl">
                      {evt.full_description}
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {evt.pixieset_url && (
        <section className="py-20 md:py-28 bg-ecs-white">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 text-center">
            <Reveal>
              <p className="label-eyebrow mb-6">Full Digital Gallery</p>
              <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight max-w-3xl mx-auto text-balance">
                Explore the complete collection on Pixieset.
              </h2>
              <a
                href={evt.pixieset_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-ecs-black text-ecs-white text-sm uppercase tracking-[0.22em] font-medium hover:bg-ecs-gold hover:text-ecs-black transition-all duration-500"
              >
                {evt.gallery_button_text || 'View Digital Gallery'} <ExternalLink size={16} />
              </a>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
