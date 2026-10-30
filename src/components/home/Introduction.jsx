import Reveal from '../Reveal';
import { useEntityList } from '@/hooks/useEntityList';
import { DEFAULT_HOMEPAGE } from '@/lib/cms/config';

export default function Introduction() {
  const { data } = useEntityList('HomepageContent', { limit: 1 });
  const text = data[0]?.intro_text || DEFAULT_HOMEPAGE.intro_text;
  const isDefault = text === DEFAULT_HOMEPAGE.intro_text;

  return (
    <section className="py-28 md:py-40 bg-ecs-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-eyebrow">Introduction</p>
              <div className="mt-4 h-px w-12 gold-line" />
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={100}>
              {isDefault ? (
                <p className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight text-balance">
                  Eternal Creative Studio is a creative studio working across{' '}
                  <span className="text-ecs-gold italic">Film, Media, Design</span> and{' '}
                  <span className="text-ecs-gold italic">Digital</span> — creating stories, visuals and ideas with intention.
                </p>
              ) : (
                <p className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight text-balance">
                  {text}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}