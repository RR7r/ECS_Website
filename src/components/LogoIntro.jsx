const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

const ECS_LOGO = 'https://media.db.com/images/public/6aabededfb495e66b0aa0b93/597d3cbc3_ECSLogo.png';

/**
 * Cinematic ECS logo intro — plays once on initial website entry.
 * Black screen → logo fade-in (subtle scale) → brief hold → overlay fades
 * to reveal the homepage (which loads underneath). Respects
 * prefers-reduced-motion with a simple fade and no scale. No spinner, text
 * or progress. Total duration ~2.4s.
 */
export default function LogoIntro({ onComplete, appReady = true }) {
  const [phase, setPhase] = useState('black'); // black -> show -> out
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
  }, []);

  // Drive the reveal + hold timing.
  useEffect(() => {
    if (reduceMotion) {
      const t1 = setTimeout(() => setPhase('show'), 150);
      const t2 = setTimeout(() => setPhase('out'), 1150);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    const t1 = setTimeout(() => setPhase('show'), 400);
    const t2 = setTimeout(() => setPhase('out'), 1900); // 400ms black + 900ms reveal + 600ms hold
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduceMotion]);

  // Fade out, then unmount — only once the app underneath is ready.
  useEffect(() => {
    if (phase !== 'out' || !appReady) return;
    const fade = reduceMotion ? 400 : 500;
    const t = setTimeout(() => onComplete?.(), fade);
    return () => clearTimeout(t);
  }, [phase, appReady, onComplete, reduceMotion]);

  const logoOn = phase === 'show' || phase === 'out';
  const overlayOpacity = phase === 'out' ? 0 : 1;
  const ease = 'cubic-bezier(0.22,1,0.36,1)';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ecs-black"
      style={{ opacity: overlayOpacity, transition: `opacity ${reduceMotion ? 400 : 500}ms ${ease}` }}
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center"
        style={{
          opacity: logoOn ? 1 : 0,
          transform: reduceMotion ? 'none' : `scale(${logoOn ? 1 : 0.98})`,
          transition: `opacity ${reduceMotion ? 400 : 900}ms ${ease}, transform ${reduceMotion ? 0 : 900}ms ${ease}`,
        }}
      >
        <img
          src={ECS_LOGO}
          alt="Eternal Creative Studio"
          className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] h-auto max-w-[72vw] select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}