import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';

export default function AboutPreview() {
  return (
    <section className="py-28 md:py-40 bg-ecs-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-eyebrow">About</p>
              <div className="mt-4 h-px w-12 gold-line" />
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={80}>
              <p className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight text-balance">
                Established in 2023, Eternal Creative Studio is a company of{' '}
                <span className="text-ecs-gold italic">Eternal Groups</span> — working across creative production, visual media, design and digital experiences.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl">
                <div>
                  <p className="label-eyebrow-muted mb-2">Established</p>
                  <p className="font-display text-2xl font-light">2023</p>
                </div>
                <div>
                  <p className="label-eyebrow-muted mb-2">Based in</p>
                  <p className="font-display text-2xl font-light">Thiruvananthapuram</p>
                </div>
                <div>
                  <p className="label-eyebrow-muted mb-2">Parent</p>
                  <p className="font-display text-2xl font-light">Eternal Groups</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <Link to="/about" className="mt-12 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline">
                More about the studio <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}