import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityBySlug, useEntityList } from '@/hooks/useEntityList';

export default function WorkDetail() {
  const { slug } = useParams();
  const { data: project, loading } = useEntityBySlug('Project', slug, { onlyPublished: true });
  const { data: related } = useEntityList('Project', { sort: 'display_order', limit: 50, filter: { published: true }, deps: [slug] });

  if (loading) {
    return (
      <div className="pt-40 min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 pb-40 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="label-eyebrow mb-4">Not Found</p>
        <h1 className="font-display text-4xl font-light mb-6">This project doesn't exist.</h1>
        <Link to="/work" className="text-sm uppercase tracking-[0.22em] link-underline">Back to Work</Link>
      </div>
    );
  }

  const others = related.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <Link to="/work" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ecs-black/50 hover:text-ecs-gold transition-colors mb-8">
              <ArrowLeft size={14} /> Back to Work
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <p className="label-eyebrow mb-5">{project.category}</p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] max-w-5xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              {project.client_type && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Type</p>
                  <p className="text-sm">{project.client_type}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Role</p>
                  <p className="text-sm">{project.role}</p>
                </div>
              )}
              {project.date && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Date</p>
                  <p className="text-sm">{project.date}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="label-eyebrow-muted mb-1.5">Location</p>
                  <p className="text-sm">{project.location}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cover */}
      <section className="bg-ecs-white pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ecs-graphite">
              <MediaPlaceholder
                src={project.hero_media || project.cover_image}
                alt={project.title}
                className="w-full h-full"
                label="Project hero media"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Description */}
      {project.full_description && (
        <section className="py-16 md:py-24 bg-ecs-cream">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-3">
                <Reveal><p className="label-eyebrow">Introduction</p></Reveal>
              </div>
              <div className="md:col-span-8">
                <Reveal delay={80}>
                  <p className="font-display text-2xl md:text-3xl font-light leading-relaxed text-balance">
                    {project.full_description}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {others.length > 0 && (
        <section className="py-20 md:py-28 bg-ecs-white">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <Reveal><p className="label-eyebrow mb-10">Related Work</p></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {others.map((p) => (
                <Reveal key={p.id}>
                  <Link to={`/work/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ecs-graphite">
                      <MediaPlaceholder src={p.cover_image} alt={p.title} className="w-full h-full transition-transform duration-[1.2s] group-hover:scale-[1.03]" label="Project cover" />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl md:text-2xl font-light group-hover:text-ecs-gold transition-colors">{p.title}</h3>
                      <ArrowUpRight size={18} className="text-ecs-black/30 group-hover:text-ecs-gold transition-colors mt-1" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}