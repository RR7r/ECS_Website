import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityBySlug } from '@/hooks/useEntityList';

export default function ProductionDetail() {
  const { slug } = useParams();
  const { data: production, loading } = useEntityBySlug('Production', slug, { onlyPublished: true });

  if (loading) {
    return (
      <div className="pt-40 min-h-[60vh] flex items-center justify-center bg-ecs-black">
        <div className="w-6 h-6 border border-ecs-white/20 border-t-ecs-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!production) {
    return (
      <div className="pt-40 pb-40 min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-ecs-black text-ecs-white">
        <p className="label-eyebrow text-ecs-gold mb-4">Not Found</p>
        <h1 className="font-display text-4xl font-light mb-6">This production doesn't exist.</h1>
        <Link to="/production" className="text-sm uppercase tracking-[0.22em] link-underline">Back to Production</Link>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-ecs-black text-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <Link to="/production" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ecs-white/50 hover:text-ecs-gold transition-colors mb-8">
              <ArrowLeft size={14} /> Back to Production
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <p className="label-eyebrow text-ecs-gold mb-5">{production.production_number}</p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] max-w-5xl">
              {production.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-sm md:text-base uppercase tracking-[0.22em] text-ecs-gold">{production.type}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              {production.role && (
                <div>
                  <p className="label-eyebrow-muted text-ecs-white/40 mb-1.5">Role</p>
                  <p className="text-sm text-ecs-white/80">{production.role}</p>
                </div>
              )}
              {production.date && (
                <div>
                  <p className="label-eyebrow-muted text-ecs-white/40 mb-1.5">Date</p>
                  <p className="text-sm text-ecs-white/80">{production.date}</p>
                </div>
              )}
              {production.location && (
                <div>
                  <p className="label-eyebrow-muted text-ecs-white/40 mb-1.5">Location</p>
                  <p className="text-sm text-ecs-white/80">{production.location}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ecs-black pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ecs-graphite">
              <MediaPlaceholder src={production.hero_media || production.cover_image} alt={production.title} className="w-full h-full" label="Production hero media" />
            </div>
          </Reveal>
        </div>
      </section>

      {production.full_description && (
        <section className="py-16 md:py-24 bg-ecs-graphite text-ecs-white">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-3">
                <Reveal><p className="label-eyebrow text-ecs-gold">Project</p></Reveal>
              </div>
              <div className="md:col-span-8">
                <Reveal delay={80}>
                  <p className="font-display text-2xl md:text-3xl font-light leading-relaxed text-balance">
                    {production.full_description}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {production.video_url && (
        <section className="py-16 md:py-24 bg-ecs-black">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <Reveal>
              <p className="label-eyebrow text-ecs-gold mb-8">Final Work</p>
              <div className="aspect-video w-full bg-ecs-graphite">
                <iframe
                  src={production.video_url}
                  title={production.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {production.credits && (
        <section className="py-16 md:py-20 bg-ecs-graphite text-ecs-white">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-3">
                <Reveal><p className="label-eyebrow text-ecs-gold">Credits</p></Reveal>
              </div>
              <div className="md:col-span-9">
                <Reveal delay={80}>
                  <p className="text-base text-ecs-white/70 font-light leading-relaxed whitespace-pre-line max-w-2xl">
                    {production.credits}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-ecs-black text-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 text-center">
          <Reveal>
            <Link to="/production" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline">
              <ArrowLeft size={16} /> All Productions
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
