import Reveal from '../Reveal';
import Marquee from '../Marquee';
import { useEntityList } from '@/hooks/useEntityList';

export default function ClientsMarquee() {
  const { data } = useEntityList('Company', { sort: 'display_order', limit: 50, deps: [] });

  return (
    <section className="py-20 md:py-28 bg-ecs-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 mb-10">
        <Reveal>
          <p className="label-eyebrow">Clients & Ventures</p>
        </Reveal>
      </div>
      <Reveal delay={80}>
        <Marquee items={data} speed={48} />
      </Reveal>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 mt-10">
        <div className="flex flex-wrap gap-x-10 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-ecs-black/45">
          {data.map((c) => (
            <span key={c.id || c.name}>
              {c.name} — {c.type === 'In-house' ? 'Eternal / In-house venture' : 'Client'}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}