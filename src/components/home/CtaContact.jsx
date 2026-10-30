import { Link } from 'react-router-dom';
import Reveal from '../Reveal';

export default function CtaContact() {
  return (
    <section className="py-24 md:py-48 bg-ecs-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 text-center">
        <Reveal>
          <p className="label-eyebrow mb-8">Start a Project</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] text-balance max-w-5xl mx-auto">
            Have something
            <br />
            worth creating?
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 font-display italic text-2xl md:text-3xl text-ecs-black/60">
            Let's build something meaningful.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <Link
            to="/contact"
            className="mt-12 inline-flex items-center justify-center px-10 py-4 bg-ecs-black text-ecs-white text-sm uppercase tracking-[0.22em] font-medium hover:bg-ecs-gold hover:text-ecs-black transition-all duration-500"
          >
            Start a Project
          </Link>
        </Reveal>
      </div>
    </section>
  );
}