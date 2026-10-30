const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, ExternalLink, Loader2, FileText } from 'lucide-react';

import { getContentType } from '@/lib/cms/contentTypes';
import { logAudit } from '@/lib/cms/audit';
import DashboardShell from './DashboardShell';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import { Image } from '@/components/ui/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ContentManager({ typeKey }) {
  const ct = getContentType(typeKey);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    db.entities[ct.entity]
      .filter({}, { sort: 'display_order', limit: 200 })
      .then((res) => {
        if (!active) return;
        setRecords(Array.isArray(res) ? res : res?.items || []);
        setError('');
      })
      .catch((err) => { if (active) setError(err.message || 'Could not load records.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [ct.entity]);

  const groups = useMemo(() => {
    if (!ct.filterField) return [];
    return [...new Set(records.map((r) => r[ct.filterField]).filter(Boolean))];
  }, [records, ct.filterField]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((r) => {
      if (statusFilter === 'published' && !r.published) return false;
      if (statusFilter === 'draft' && r.published) return false;
      if (groupFilter !== 'all' && r[ct.filterField] !== groupFilter) return false;
      if (!term) return true;
      return ct.searchFields.some((f) => String(r[f] || '').toLowerCase().includes(term));
    });
  }, [records, search, statusFilter, groupFilter, ct]);

  const publishedCount = records.filter((r) => r.published).length;
  const draftCount = records.length - publishedCount;

  const togglePublished = async (record) => {
    setWorkingId(record.id);
    try {
      const next = !record.published;
      await db.entities[ct.entity].update(record.id, { published: next });
      setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, published: next } : r)));
      logAudit({
        action: next ? 'published' : 'unpublished',
        entity: ct.entity,
        title: record[ct.titleField],
      });
    } catch (err) {
      setError(err.message || 'Could not update publication status.');
    } finally {
      setWorkingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const record = deleteTarget;
    setDeleteTarget(null);
    try {
      await db.entities[ct.entity].delete(record.id);
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
      logAudit({ action: 'deleted', entity: ct.entity, title: record[ct.titleField] });
    } catch (err) {
      setError(err.message || 'Could not delete this record.');
    }
  };

  if (!ct) return null;

  return (
    <DashboardShell
      eyebrow="Content management"
      title={ct.label}
      actions={
        <Link
          to={`/dashboard/${typeKey}/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors"
        >
          <Plus size={14} /> New {ct.singular}
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total', value: records.length },
          { label: 'Published', value: publishedCount },
          { label: 'Drafts', value: draftCount },
        ].map((s) => (
          <div key={s.label} className="bg-ecs-white border border-ecs-black/10 px-4 py-3">
            <p className="font-display text-2xl font-light">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ecs-black/45 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ecs-black/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${ct.label.toLowerCase()}…`}
            className="w-full bg-ecs-white border border-ecs-black/12 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ecs-white border border-ecs-black/12 px-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        {groups.length > 0 && (
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-ecs-white border border-ecs-black/12 px-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
          >
            <option value="all">All {ct.filterField.replace('_', ' ')}s</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={records.length === 0 ? `No ${ct.label.toLowerCase()} yet` : 'Nothing matches these filters'}
          description={records.length === 0 ? `Create your first ${ct.singular.toLowerCase()} — it will publish to the live website.` : 'Clear the search or filters to see more.'}
          action={
            records.length === 0 ? (
              <Link to={`/dashboard/${typeKey}/new`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors">
                <Plus size={14} /> New {ct.singular}
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="bg-ecs-white border border-ecs-black/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-ecs-black/45 border-b border-ecs-black/10">
                <th className="px-4 py-3 font-medium">Entry</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Modified</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-b border-ecs-black/5 hover:bg-ecs-cream/50 transition-colors align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-ecs-cream border border-ecs-black/10 overflow-hidden shrink-0">
                        {ct.coverField && r[ct.coverField] ? (
                          <Image src={r[ct.coverField]} alt="" className="w-full h-full" fittingType="fill" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ecs-black/20"><FileText size={14} /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[240px]">{r[ct.titleField] || 'Untitled'}</p>
                        {ct.subtitleField && r[ct.subtitleField] && (
                          <p className="text-xs text-ecs-black/45 truncate">{r[ct.subtitleField]}</p>
                        )}
                        {ct.showGallery && (
                          <p className={`text-[10px] uppercase tracking-[0.14em] mt-1 ${r.pixieset_url ? 'text-ecs-gold' : 'text-ecs-black/30'}`}>
                            {r.pixieset_url ? 'Gallery linked' : 'No gallery'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ecs-black/55">
                    {ct.metaFields.map((f) => r[f]).filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.published ? 'published' : 'draft'} />
                  </td>
                  <td className="px-4 py-3 text-xs text-ecs-black/45 whitespace-nowrap">
                    {r.updated_date ? new Date(r.updated_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreview(r)}
                        className="p-2 text-ecs-black/50 hover:text-ecs-gold transition-colors"
                        title="Preview"
                      >
                        <Eye size={15} />
                      </button>
                      <Link
                        to={`/dashboard/${typeKey}/${r.id}`}
                        className="p-2 text-ecs-black/50 hover:text-ecs-gold transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => togglePublished(r)}
                        disabled={workingId === r.id}
                        className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] border transition-colors disabled:opacity-40 ${
                          r.published
                            ? 'border-ecs-black/15 text-ecs-black/55 hover:border-ecs-black/40'
                            : 'border-ecs-gold/40 text-ecs-gold hover:bg-ecs-gold hover:text-ecs-black'
                        }`}
                      >
                        {r.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-2 text-ecs-black/40 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete this ${ct.singular.toLowerCase()}?`}
        description={
          deleteTarget
            ? `“${deleteTarget[ct.titleField]}” will be permanently removed from the website. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
        danger
        onConfirm={confirmDelete}
      />

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-2xl rounded-none border-ecs-black/15 bg-ecs-white p-0 overflow-hidden">
          {preview && (
            <>
              {ct.coverField && preview[ct.coverField] && (
                <Image src={preview[ct.coverField]} alt="" className="w-full aspect-[16/9]" fittingType="fill" />
              )}
              <div className="p-6">
                <DialogHeader>
                  <p className="label-eyebrow mb-2">{preview[ct.subtitleField] || ct.singular}</p>
                  <DialogTitle className="font-display text-3xl font-light tracking-tight text-left">
                    {preview[ct.titleField]}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ecs-black/50">
                  {ct.metaFields.map((f) => preview[f]).filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
                </div>
                {preview.short_description && (
                  <p className="mt-4 text-sm text-ecs-black/65 font-light leading-relaxed">{preview.short_description}</p>
                )}
                {ct.showGallery && preview.pixieset_url && (
                  <a href={preview.pixieset_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ecs-gold hover:underline">
                    {preview.gallery_button_text || 'View photography gallery'} <ExternalLink size={12} />
                  </a>
                )}
                <div className="mt-6 flex items-center gap-3">
                  {preview.published && ct.publicPath && (
                    <a href={ct.publicPath(preview)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-ecs-black text-ecs-white text-[10px] uppercase tracking-[0.18em] hover:bg-ecs-gold hover:text-ecs-black transition-colors">
                      View live <ExternalLink size={12} />
                    </a>
                  )}
                  <Link to={`/dashboard/${typeKey}/${preview.id}`} className="px-4 py-2 border border-ecs-black/20 text-[10px] uppercase tracking-[0.18em] hover:border-ecs-gold transition-colors">
                    Edit
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}