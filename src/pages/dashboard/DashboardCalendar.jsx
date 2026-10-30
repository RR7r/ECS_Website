const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

function parseContentDate(value) {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const text = String(value);
  const month = MONTHS.find((m) => text.toLowerCase().includes(m));
  const year = text.match(/\b(20\d{2})\b/);
  const day = text.match(/\b(\d{1,2})\b/);
  if (month && year) {
    return new Date(Number(year[1]), MONTHS.indexOf(month), day ? Math.min(Number(day[1]), 28) : 1);
  }
  if (year) return new Date(Number(year[1]), 0, 1);
  return null;
}

export default function DashboardCalendar() {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [photos, projects, productions] = await Promise.all(
          ['PhotographyEvent', 'Project', 'Production'].map((entity) =>
            db.entities[entity]
              .filter({}, { limit: 200 })
              .then((r) => (Array.isArray(r) ? r : r?.items || []))
              .catch(() => [])
          )
        );
        if (!active) return;
        const list = [
          ...photos.map((p) => ({ id: p.id, title: p.event_title, type: 'Photography', date: p.date, fallback: p.created_date, published: p.published, href: `/dashboard/photography/${p.id}` })),
          ...projects.map((p) => ({ id: p.id, title: p.title, type: 'Project', date: p.date, fallback: p.created_date, published: p.published, href: `/dashboard/projects/${p.id}` })),
          ...productions.map((p) => ({ id: p.id, title: p.title, type: 'Production', date: p.date, fallback: p.created_date, published: p.published, href: `/dashboard/productions/${p.id}` })),
        ]
          .map((e) => ({ ...e, parsed: parseContentDate(e.date) || parseContentDate(e.fallback) }))
          .filter((e) => e.parsed);
        setEvents(list);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const eventsForDay = (date) =>
    events.filter((e) => e.parsed.toDateString() === date.toDateString());

  const monthName = cursor.toLocaleString('default', { month: 'long', year: 'numeric' });

  const selectedEvents = selected ? eventsForDay(selected) : [];

  const upcoming = useMemo(
    () => events.filter((e) => e.parsed >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      .sort((a, b) => a.parsed - b.parsed)
      .slice(0, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events]
  );

  return (
    <DashboardShell eyebrow="Communication" title="Publishing Calendar">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-light">{monthName}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 hover:bg-ecs-cream transition-colors" aria-label="Previous month"><ChevronLeft size={18} /></button>
              <button onClick={() => { setCursor(new Date()); setSelected(new Date()); }} className="px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] border border-ecs-black/15 hover:border-ecs-gold transition-colors">Today</button>
              <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 hover:bg-ecs-cream transition-colors" aria-label="Next month"><ChevronRight size={18} /></button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center"><Loader2 size={18} className="animate-spin text-ecs-gold" /></div>
          ) : (
            <>
              <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-[0.16em] text-ecs-black/40 mb-1">
                {WEEKDAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} />;
                  const dayEvents = eventsForDay(date);
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = selected && date.toDateString() === selected.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(date)}
                      className={`aspect-square p-1.5 border text-left transition-colors ${
                        isSelected ? 'border-ecs-gold bg-ecs-gold/10' : isToday ? 'border-ecs-black bg-ecs-black text-ecs-white' : 'border-ecs-black/8 hover:border-ecs-black/30'
                      }`}
                    >
                      <span className="text-xs">{date.getDate()}</span>
                      {dayEvents.length > 0 && (
                        <span className="mt-1 flex flex-wrap gap-0.5">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span key={e.id} className={`block w-1.5 h-1.5 rounded-full ${isToday ? 'bg-ecs-gold' : 'bg-ecs-black/60'}`} />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {events.length === 0 && (
                <p className="mt-4 text-sm text-ecs-black/45">No dated content yet. Add a date to a photography event, project or production and it appears here.</p>
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-ecs-white border border-ecs-black/10 p-5">
            <h3 className="font-display text-lg font-light mb-3">
              {selected ? selected.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a day'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-ecs-black/45">{selected ? 'Nothing scheduled on this day.' : 'Choose a date to see what is scheduled.'}</p>
            ) : (
              <ul className="space-y-3">
                {selectedEvents.map((e) => (
                  <li key={e.id} className="border-l-2 border-ecs-gold pl-3">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-ecs-black/40">{e.type} · {e.published ? 'Published' : 'Draft'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-ecs-white border border-ecs-black/10 p-5">
            <h3 className="font-display text-lg font-light mb-3">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-ecs-black/45">Nothing upcoming.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((e) => (
                  <li key={e.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm truncate">{e.title}</p>
                      <p className="text-[11px] text-ecs-black/40">{e.type}</p>
                    </div>
                    <span className="text-[11px] text-ecs-black/45 whitespace-nowrap">
                      {e.parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}