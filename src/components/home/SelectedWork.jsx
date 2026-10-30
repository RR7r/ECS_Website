import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import MediaPlaceholder from '../MediaPlaceholder';
import { useEntityList } from '@/hooks/useEntityList';

export default function SelectedWork() {
  const { data, loading } = useEntityList('Project', { sort: 'display_order', limit: 50, deps: [] });

  return (
    <section className="py-24 md:py-36 bg-ecs-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <Reveal>
              <p className="label-eyebrow mb-5">Selected Work</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight leading-[0.95]">
                Projects we've
                <br />
                shaped with care.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <Link to="/work" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline">
              All Work <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

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
  );
}