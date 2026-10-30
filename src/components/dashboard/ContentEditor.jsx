const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Eye, ExternalLink, Trash2, Check, AlertCircle } from 'lucide-react';

import { getContentType } from '@/lib/cms/contentTypes';
import { slugify } from '@/lib/cms/slug';
import { logAudit } from '@/lib/cms/audit';
import DashboardShell from './DashboardShell';
import Field from './Field';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { Image } from '@/components/ui/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ContentEditor({ typeKey, id }) {
  const ct = getContentType(typeKey);
  const navigate = useNavigate();
  const isNew = !id;

  const allFields = useMemo(() => ct.sections.flatMap((s) => s.fields), [ct]);
  const slugField = allFields.find((f) => f.type === 'slug');

  const [form, setForm] = useState({ ...ct.defaults });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [slugAuto, setSlugAuto] = useState(isNew);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    db.entities[ct.entity]
      .get(id)
      .then((rec) => { if (active) setForm({ ...ct.defaults, ...rec }); })
      .catch((err) => { if (active) setError(err.message || 'Could not load this record.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, ct]);

  const setValue = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (slugField && name === slugField.from) {
        if (slugAuto) next[slugField.name] = slugify(value);
      }
      if (slugField && name === slugField.name) setSlugAuto(false);
      return next;
    });
  };

  const buildPayload = (overrides = {}) => {
    const payload = {};
    allFields.forEach((f) => { payload[f.name] = form[f.name] ?? (f.type === 'toggle' ? false : ''); });
    return { ...payload, ...overrides };
  };

  const validate = async (payload) => {
    const missing = allFields.filter((f) => f.required && !String(payload[f.name] || '').trim());
    if (missing.length > 0) return `Required: ${missing.map((f) => f.label).join(', ')}.`;
    if (slugField) {
      const slug = String(payload[slugField.name] || '').trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return 'The URL slug can only contain lowercase letters, numbers and hyphens.';
      }
      const res = await db.entities[ct.entity].filter({ slug });
      const items = Array.isArray(res) ? res : res?.items || [];
      if (items.some((r) => r.id !== id)) return 'That URL slug is already used by another entry.';
    }
    if (payload.pixieset_url) {
      try { new URL(payload.pixieset_url); } catch { return 'The gallery URL is not valid.'; }
    }
    return '';
  };

  const save = async ({ published } = {}) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const overrides = {};
      if (typeof published === 'boolean') overrides.published = published;
      const payload = buildPayload(overrides);
      const problem = await validate(payload);
      if (problem) { setError(problem); setSaving(false); return; }

      if (isNew) {
        const created = await db.entities[ct.entity].create(payload);
        logAudit({
          action: payload.published ? 'published' : 'created draft',
          entity: ct.entity,
          title: payload[ct.titleField],
        });
        navigate(`/dashboard/${typeKey}/${created.id}`, { replace: true });
        setMessage('Saved.');
      } else {
        await db.entities[ct.entity].update(id, payload);
        setForm((prev) => ({ ...prev, ...payload }));
        logAudit({
          action: typeof published === 'boolean'
            ? (published ? 'published' : 'unpublished')
            : 'updated',
          entity: ct.entity,
          title: payload[ct.titleField],
        });
        setMessage('Changes saved.');
      }
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await db.entities[ct.entity].delete(id);
      logAudit({ action: 'deleted', entity: ct.entity, title: form[ct.titleField] });
      navigate(`/dashboard/${typeKey}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not delete this record.');
    }
  };

  if (loading) {
    return (
      <DashboardShell eyebrow="Content management" title={ct.singular}>
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      eyebrow={isNew ? `New ${ct.singular}` : `Editing ${ct.singular}`}
      title={form[ct.titleField] || `New ${ct.singular}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-ecs-black/20 text-[10px] uppercase tracking-[0.18em] hover:border-ecs-gold transition-colors">
            <Eye size={13} /> Preview
          </button>
          {!isNew && (
            <button onClick={() => setDeleteOpen(true)} className="p-2.5 border border-ecs-black/15 text-ecs-black/40 hover:text-red-600 hover:border-red-300 transition-colors" title="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to={`/dashboard/${typeKey}`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ecs-black/50 hover:text-ecs-gold transition-colors">
          <ArrowLeft size={13} /> All {ct.label}
        </Link>
        <div className="flex items-center gap-3">
          <StatusBadge status={form.published ? 'published' : 'draft'} />
          {form.published && ct.publicPath && (
            <a href={ct.publicPath(form)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ecs-black/50 hover:text-ecs-gold">
              View live <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {message && (
        <div className="mb-5 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={15} /> {message}
        </div>
      )}

      <div className="space-y-6">
        {ct.sections.map((section) => (
          <section key={section.title} className="bg-ecs-white border border-ecs-black/10">
            <div className="px-5 md:px-6 py-4 border-b border-ecs-black/8">
              <h2 className="font-display text-lg font-light tracking-tight">{section.title}</h2>
            </div>
            <div className="px-5 md:px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {section.fields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={(v) => setValue(field.name, v)}
                  onGenerateSlug={field.type === 'slug' ? () => setForm((prev) => ({ ...prev, [field.name]: slugify(prev[field.from] || '') })) : undefined}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-ecs-cream/95 backdrop-blur border-t border-ecs-black/10 flex flex-wrap items-center justify-end gap-2">
        {!form.published && (
          <button
            onClick={() => save({ published: false })}
            disabled={saving}
            className="px-5 py-2.5 border border-ecs-black/20 text-[11px] uppercase tracking-[0.18em] hover:border-ecs-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
        )}
        {form.published ? (
          <button
            onClick={() => save({ published: false })}
            disabled={saving}
            className="px-5 py-2.5 border border-ecs-black/20 text-[11px] uppercase tracking-[0.18em] hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            Unpublish
          </button>
        ) : (
          <button
            onClick={() => save({ published: true })}
            disabled={saving}
            className="px-6 py-2.5 bg-ecs-gold text-ecs-black text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ecs-black hover:text-ecs-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        )}
        <button
          onClick={() => save()}
          disabled={saving}
          className="px-6 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete this ${ct.singular.toLowerCase()}?`}
        description="This permanently removes the entry from the website. This cannot be undone."
        confirmLabel="Delete permanently"
        danger
        onConfirm={handleDelete}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl rounded-none border-ecs-black/15 bg-ecs-white p-0 overflow-hidden">
          {form[ct.coverField] && (
            <Image src={form[ct.coverField]} alt="" className="w-full aspect-[16/9]" fittingType="fill" />
          )}
          <div className="p-6">
            <DialogHeader>
              <p className="label-eyebrow mb-2">{form[ct.subtitleField] || ct.singular}</p>
              <DialogTitle className="font-display text-3xl font-light tracking-tight text-left">
                {form[ct.titleField] || 'Untitled'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ecs-black/50">
              {ct.metaFields.map((f) => form[f]).filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
            </div>
            {form.short_description && (
              <p className="mt-4 text-sm text-ecs-black/65 font-light leading-relaxed">{form.short_description}</p>
            )}
            {form.full_description && (
              <p className="mt-4 text-sm text-ecs-black/55 font-light leading-relaxed whitespace-pre-line">{form.full_description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}