import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function Work() {
  const { data, loading } = useEntityList('Project', { sort: 'display_order', limit: 50, filter: { published: true }, deps: [] });

  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="Projects shaped with intention."
        subtitle="Client work and in-house ventures — across film, media, design and digital."
      />
      <section className="pb-24 md:pb-32 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border border-ecs-black/20 border-t-ecs-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-20">
              {data.map((project, i) => (
                <Reveal key={project.id} delay={(i % 2) * 120}>
                  <Link to={`/work/${project.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ecs-graphite">
                      <MediaPlaceholder
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                        label="Project cover"
                      />
                      <span className="absolute top-4 left-4 label-eyebrow-muted text-ecs-white/70 z-10">
                        {project.client_type}
                      </span>
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-light tracking-tight group-hover:text-ecs-gold transition-colors duration-500">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-ecs-black/50">{project.category}</p>
                        {project.short_description && (
                          <p className="mt-3 text-sm text-ecs-black/55 max-w-md font-light leading-relaxed">
                            {project.short_description}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight size={20} className="text-ecs-black/30 group-hover:text-ecs-gold transition-colors duration-500 shrink-0 mt-1" />
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