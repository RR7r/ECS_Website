import { Link } from 'react-router-dom';

/**
 * Automatic horizontal marquee. Items scroll continuously and seamlessly.
 * Duplicates the list once to create a seamless infinite loop. Pauses on
 * hover (desktop). Mobile keeps smooth animation without blocking scroll.
 */
export default function Marquee({ items = [], speed = 40 }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-10 select-none">
      <div
        className="marquee-track flex w-max items-center gap-16"
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-16 shrink-0">
            <MarqueeItem item={item} />
            <span className="text-ecs-gold/40 text-2xl font-light">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({ item }) {
  const isWordmark = item.use_typographic_wordmark || !item.logo;
  const content = (
    <span className="font-display text-3xl md:text-5xl font-light tracking-tight text-ecs-black/80 hover:text-ecs-black transition-colors duration-500 whitespace-nowrap">
      {item.name}
    </span>
  );

  if (item.website) {
    return (
      <a
        href={item.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={item.name}
      >
        {content}
      </a>
    );
  }
  return <div className="block">{content}</div>;
}