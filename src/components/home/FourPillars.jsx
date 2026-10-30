import Reveal from '../Reveal';

const pillars = [
  {
    num: '01',
    name: 'Film',
    desc: 'Stories brought to life through film, documentary and visual production.',
  },
  {
    num: '02',
    name: 'Media',
    desc: 'Photography, videography and visual coverage built around real moments.',
  },
  {
    num: '03',
    name: 'Design',
    desc: 'Brand identities, graphics and visual systems designed with intention.',
  },
  {
    num: '04',
    name: 'Digital',
    desc: 'Web experiences and digital creative built for modern audiences.',
  },
];

export default function FourPillars() {
  return (
    <section className="bg-ecs-black text-ecs-white py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-eyebrow text-ecs-gold">Four Pillars</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={80}>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-tight tracking-tight">
                One studio. Four disciplines.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-ecs-white/15">
          {pillars.map((p, i) => (
            <Reveal
              key={p.num}
              delay={i * 100}
              className="group py-10 md:py-14 px-1 md:px-8 border-b border-ecs-white/15 md:border-r md:last:border-r-0 lg:border-b-0 lg:border-r"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-sm text-ecs-gold">{p.num}</span>
                <h3 className="font-display text-5xl md:text-6xl font-light tracking-tight group-hover:text-ecs-gold transition-colors duration-500">
                  {p.name}
                </h3>
              </div>
              <p className="mt-6 text-sm md:text-base text-ecs-white/55 leading-relaxed max-w-xs font-light">
                {p.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}