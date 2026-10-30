const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import ImageField from '@/components/dashboard/ImageField';
import { DEFAULT_SETTINGS } from '@/lib/cms/config';
import { logAudit } from '@/lib/cms/audit';

const input = 'w-full bg-transparent border-b border-ecs-black/25 py-2.5 text-sm font-light focus:outline-none focus:border-ecs-gold transition-colors';

export default function DashboardSettings() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    db.entities.SiteSettings
      .filter({}, { limit: 1 })
      .then((res) => {
        if (!active) return;
        const items = Array.isArray(res) ? res : res?.items || [];
        if (items[0]) {
          setRecord(items[0]);
          setForm({ ...DEFAULT_SETTINGS, ...items[0] });
        }
      })
      .catch((err) => { if (active) setError(err.message || 'Could not load site settings.'); })
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
        await db.entities.SiteSettings.update(record.id, payload);
      } else {
        const created = await db.entities.SiteSettings.create(payload);
        setRecord(created);
      }
      setSaved(true);
      logAudit({ action: 'updated website settings', entity: 'SiteSettings', title: 'Website settings' });
    } catch (err) {
      setError(err.message || 'Could not save website settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell eyebrow="Administration" title="Website Settings">
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : (
        <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <h2 className="font-display text-xl font-light mb-5">Identity & SEO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block md:col-span-1">
                  <span className="label-eyebrow-muted block mb-1.5">Site title</span>
                  <input className={input} value={form.site_title} onChange={(e) => set('site_title', e.target.value)} />
                </label>
                <label className="block md:col-span-1">
                  <span className="label-eyebrow-muted block mb-1.5">Default SEO title</span>
                  <input className={input} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="label-eyebrow-muted block mb-1.5">Meta description</span>
                  <textarea rows={3} className={`${input} border border-ecs-black/15 px-3`} value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} />
                </label>
                <div className="md:col-span-2">
                  <ImageField label="Social sharing image" value={form.social_image} onChange={(v) => set('social_image', v)} />
                </div>
              </div>
            </section>

            <section className="bg-ecs-white border border-ecs-black/10 p-5 md:p-6">
              <h2 className="font-display text-xl font-light mb-5">Contact & Footer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Instagram URL</span>
                  <input className={input} value={form.instagram_url} onChange={(e) => set('instagram_url', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Contact email</span>
                  <input type="email" className={input} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Contact phone</span>
                  <input className={input} value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-eyebrow-muted block mb-1.5">Address</span>
                  <input className={input} value={form.address} onChange={(e) => set('address', e.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="label-eyebrow-muted block mb-1.5">Footer note</span>
                  <input className={input} value={form.footer_note} onChange={(e) => set('footer_note', e.target.value)} />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="bg-ecs-white border border-ecs-black/10 p-5">
              <p className="text-xs text-ecs-black/55 font-light leading-relaxed">
                These values feed the public footer and default page metadata. Changes apply to the live website as soon as they are saved.
              </p>
              {error && (
                <p className="mt-3 flex items-start gap-2 text-xs text-red-600"><AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
                {saving ? 'Saving…' : saved ? 'Saved' : 'Save settings'}
              </button>
            </div>
          </div>
        </form>
      )}
    </DashboardShell>
  );
}