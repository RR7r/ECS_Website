import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Leadership from '@/components/home/Leadership';

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Eternal Creative Studio."
        subtitle="Film • Media • Design • Digital. Stories. Visuals. Ideas."
      />

      <section className="pb-16 md:pb-24 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <Reveal><p className="label-eyebrow">The Studio</p></Reveal>
            </div>
            <div className="md:col-span-9">
              <Reveal delay={80}>
                <p className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight text-balance">
                  Eternal Creative Studio is a creative studio working across Film, Media, Design and Digital — creating stories, visuals and ideas with intention.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-10 max-w-2xl text-lg text-ecs-black/60 font-light leading-relaxed">
                  Established in 2023 as a company of Eternal Groups, the studio works across creative production, visual media, design and digital experiences — with a focus on craft, authenticity and human storytelling.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-16 md:py-24 bg-ecs-cream">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { label: 'Established', value: '2023' },
              { label: 'Parent', value: 'Eternal Groups' },
              { label: 'Based in', value: 'Thiruvananthapuram' },
              { label: 'Disciplines', value: 'Film · Media · Design · Digital' },
            ].map((f, i) => (
              <Reveal key={f.label} delay={i * 80}>
                <div className="border-t border-ecs-black/20 pt-5">
                  <p className="label-eyebrow-muted mb-3">{f.label}</p>
                  <p className="font-display text-xl md:text-2xl font-light leading-tight">{f.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <Leadership />

      {/* CTA */}
      <section className="py-24 md:py-32 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight text-balance">
              Let's build something meaningful.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] link-underline">
              Start a Project <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}