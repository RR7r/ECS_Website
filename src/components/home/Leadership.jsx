const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import Reveal from '../Reveal';
import { Image } from '@/components/ui/image';

const FOUNDER_IMG = 'https://media.db.com/images/public/6aabededfb495e66b0aa0b93/6a6fb73dc_Founder.jpeg';

export default function Leadership() {
  return (
    <section className="bg-ecs-black text-ecs-white py-20 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Mobile label — appears above the portrait */}
        <div className="md:hidden mb-8">
          <Reveal>
            <p className="label-eyebrow text-ecs-gold">Leadership</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Founder portrait — contained inside the black section */}
          <div className="md:col-span-7">
            <Reveal>
              <div className="aspect-[4/5] w-full overflow-hidden bg-ecs-graphite">
                <Image
                  src={FOUNDER_IMG}
                  alt="Rohith S A — Founder & Creative Director, Eternal Creative Studio"
                  className="w-full h-full"
                  fittingType="fill"
                />
              </div>
            </Reveal>
          </div>

          {/* Leadership text */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="hidden md:block">
              <Reveal>
                <p className="label-eyebrow text-ecs-gold mb-8">Leadership</p>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.98]">
                Rohith S A
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-6 flex items-center gap-4">
                <span className="h-px w-10 gold-line" />
                <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-ecs-gold">
                  Founder &amp; Creative Director
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-md text-base md:text-lg text-ecs-white/60 font-light leading-relaxed">
                The vision behind Eternal Creative Studio — leading the studio's work across film, media, design and digital with intention and craft.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}