import Reveal from './Reveal';

/**
 * Standard editorial header for inner pages.
 */
export default function PageHeader({ eyebrow, title, subtitle, dark = false }) {
  return (
    <section className={`pt-36 md:pt-44 pb-16 md:pb-20 ${dark ? 'bg-ecs-black text-ecs-white' : 'bg-ecs-white'}`}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          {eyebrow && (
            <p className={`label-eyebrow mb-6 ${dark ? '' : ''}`}>{eyebrow}</p>
          )}
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight max-w-5xl text-balance">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={160}>
            <p className={`mt-8 max-w-2xl text-lg md:text-xl font-light leading-relaxed ${dark ? 'text-ecs-white/70' : 'text-ecs-black/60'}`}>
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}