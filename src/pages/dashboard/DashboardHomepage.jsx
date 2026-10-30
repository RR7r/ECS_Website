const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import ImageField from '@/components/dashboard/ImageField';
import { DEFAULT_HOMEPAGE } from '@/lib/cms/config';
import { logAudit } from '@/lib/cms/audit';

const input = 'w-full bg-transparent border-b border-ecs-black/25 py-2.5 text-sm font-light focus:outline-none focus:border-ecs-gold transition-colors';

export default function DashboardHomepage() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(DEFAULT_HOMEPAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    db.entities.HomepageContent
      .filter({}, { limit: 1 })
      .then((res) => {
        if (!active) return;
        const items = Array.isArray(res) ? res : res?.items || [];
        if (items[0]) {
          setRecord(items[0]);
          setForm({ ...DEFAULT_HOMEPAGE, ...items[0] });
        }
      })
      .catch((err) => { if (active) setError(err.message || 'Could not load homepage content.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.created_date;
      delete payload.updated_date;
      delete payload.created_by_id;
      delete payload.created_by;
      if (record) {
        await db.entities.HomepageContent.update(record.id, payload);
      } else {
        const created = await db.entities.HomepageContent.create(payload);
        setRecord(created);
      }
      setSaved(true);
      logAudit({ action: 'updated homepage content', entity: 'HomepageContent', title: 'Homepage' });
    } catch (err) {
      setError(err.message || 'Could not save homepage content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell eyebrow="Content management" title="Homepage Content">
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : (
        <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <h2 className="font-display text-xl font-light mb-5">Hero</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block md:col-span-2">
                  <span className="label-eyebrow-muted block mb-1.5">Eyebrow</span>
                  <input className={input} value={form.hero_eyebrow} onChange={(e) => set('hero_eyebrow', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Heading line 1</span>
                  <input className={input} value={form.hero_line1} onChange={(e) => set('hero_line1', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Heading line 2</span>
                  <input className={input} value={form.hero_line2} onChange={(e) => set('hero_line2', e.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="label-eyebrow-muted block mb-1.5">Tagline</span>
                  <input className={input} value={form.hero_tagline} onChange={(e) => set('hero_tagline', e.target.value)} />
                </label>
                <div className="md:col-span-2">
                  <ImageField label="Hero background image" value={form.hero_image} onChange={(v) => set('hero_image', v)} />
                </div>
              </div>
            </section>

            <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <h2 className="font-display text-xl font-light mb-5">Introduction</h2>
              <textarea
                rows={5}
                className={`${input} border border-ecs-black/15 px-3`}
                value={form.intro_text}
                onChange={(e) => set('intro_text', e.target.value)}
              />
            </section>
          </div>

          <div className="space-y-4">
            <div className="bg-ecs-white border border-ecs-black/10 p-5">
              <p className="text-xs text-ecs-black/55 font-light leading-relaxed">
                The hero and introduction update on the live homepage immediately after saving. Section order and design remain unchanged.
              </p>
              {error && <p className="mt-3 flex items-start gap-2 text-xs text-red-600"><AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
                {saving ? 'Saving…' : saved ? 'Saved' : 'Save homepage'}
              </button>
            </div>
          </div>
        </form>
      )}
    </DashboardShell>
  );
}