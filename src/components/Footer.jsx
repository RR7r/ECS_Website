const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useEntityList } from '@/hooks/useEntityList';
import { DEFAULT_SETTINGS } from '@/lib/cms/config';

const ECS_LOGO = 'https://media.db.com/images/public/6aabededfb495e66b0aa0b93/597d3cbc3_ECSLogo.png';

function instagramHandle(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    return parts.length ? `@${parts[parts.length - 1]}` : '@eternal.creativestudio';
  } catch {
    return '@eternal.creativestudio';
  }
}

export default function Footer() {
  const { data } = useEntityList('SiteSettings', { limit: 1 });
  const s = { ...DEFAULT_SETTINGS, ...(data[0] || {}) };

  return (
    <footer className="bg-ecs-black text-ecs-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Image
              src={ECS_LOGO}
              alt="Eternal Creative Studio — official logo"
              className="w-44 md:w-52 h-auto"
              fittingType="fit"
            />
            <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-ecs-gold">
              Film • Media • Design • Digital
            </p>
            <p className="mt-3 font-display text-lg text-ecs-white/70 italic">
              Stories. Visuals. Ideas.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="label-eyebrow-muted text-ecs-white/40 mb-5">Navigation</p>
            <ul className="space-y-3">
              {[
                { label: 'Work', to: '/work' },
                { label: 'Services', to: '/services' },
                { label: 'About', to: '/about' },
                { label: 'Photography', to: '/photography' },
                { label: 'Production', to: '/production' },
                { label: 'Start a Project', to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-4">
            <p className="label-eyebrow-muted text-ecs-white/40 mb-5">Connect</p>
            <a
              href={s.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline"
            >
              <Instagram size={16} />
              {instagramHandle(s.instagram_url)}
            </a>
            {s.contact_email && (
              <a href={`mailto:${s.contact_email}`} className="mt-4 flex items-center gap-3 text-sm text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline">
                <Mail size={16} /> {s.contact_email}
              </a>
            )}
            {s.contact_phone && (
              <a href={`tel:${s.contact_phone}`} className="mt-3 flex items-center gap-3 text-sm text-ecs-white/70 hover:text-ecs-gold transition-colors link-underline">
                <Phone size={16} /> {s.contact_phone}
              </a>
            )}
            <Link to="/dashboard/login" className="block mt-6 text-sm text-ecs-white/50 hover:text-ecs-gold transition-colors link-underline">
              Client / Workspace Login
            </Link>
            <div className="mt-8 space-y-2 text-sm text-ecs-white/50">
              <p>{s.footer_note}</p>
              <p>Established <span className="text-ecs-white/80">2023</span></p>
              <p>{s.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ecs-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ecs-white/40">
            © {new Date().getFullYear()} Eternal Creative Studio
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ecs-white/30">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}