const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Trash2, Copy, Check, Loader2, Search, ExternalLink } from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import EmptyState from '@/components/dashboard/EmptyState';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Image } from '@/components/ui/image';
import { logAudit } from '@/lib/cms/audit';

export default function DashboardMedia() {
  const inputRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    db.entities.MediaAsset
      .filter({}, { sort: '-created_date', limit: 200 })
      .then((res) => setAssets(Array.isArray(res) ? res : res?.items || []))
      .catch((err) => setError(err.message || 'Could not load media.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files can be uploaded.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Images must be under 10 MB.'); return; }
    setUploading(true);
    setError('');
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      const created = await db.entities.MediaAsset.create({
        name: file.name,
        file_url,
        file_size: file.size,
        mime_type: file.type,
        category: 'Library',
      });
      setAssets((prev) => [created, ...prev]);
      logAudit({ action: 'uploaded media', entity: 'MediaAsset', title: file.name });
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const isReferenced = async (url) => {
    const entities = ['PhotographyEvent', 'Project', 'Production', 'Service'];
    const lists = await Promise.all(entities.map((name) =>
      db.entities[name].filter({}, { limit: 200 }).then((r) => (Array.isArray(r) ? r : r?.items || [])).catch(() => [])
    ));
    return lists.some((list) => list.some((r) =>
      [r.cover_image, r.hero_media, r.social_image, ...(Array.isArray(r.gallery_images) ? r.gallery_images : [])]
        .filter(Boolean)
        .includes(url)
    ));
  };

  const confirmDelete = async () => {
    const asset = deleteTarget;
    setDeleteTarget(null);
    if (!asset) return;
    try {
      if (await isReferenced(asset.file_url)) {
        setError('This image is still used by published content. Replace or remove it there before deleting.');
        return;
      }
      await db.entities.MediaAsset.delete(asset.id);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      logAudit({ action: 'deleted media', entity: 'MediaAsset', title: asset.name });
    } catch (err) {
      setError(err.message || 'Could not delete this image.');
    }
  };

  const copy = async (asset) => {
    try {
      await navigator.clipboard.writeText(asset.file_url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError('Could not copy to the clipboard.');
    }
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((a) => `${a.name} ${a.category}`.toLowerCase().includes(term));
  }, [assets, search]);

  const size = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardShell
      eyebrow="Media"
      title="Media Library"
      actions={
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
      }
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />

      <div className="relative mb-5 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ecs-black/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media…"
          className="w-full bg-ecs-white border border-ecs-black/12 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-ecs-gold"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={20} className="animate-spin text-ecs-gold" /></div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="No media yet"
          description="Upload images here or attach them directly while creating content. Files are stored in permanent public storage."
          action={
            <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.2em] hover:bg-ecs-gold hover:text-ecs-black transition-colors">
              <Upload size={14} /> Upload image
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((a) => (
            <div key={a.id} className="bg-ecs-white border border-ecs-black/10 group">
              <div className="relative aspect-[4/3] bg-ecs-cream overflow-hidden">
                <Image src={a.file_url} alt={a.alt_text || a.name} className="w-full h-full" fittingType="fill" />
              </div>
              <div className="p-3">
                <p className="text-sm truncate" title={a.name}>{a.name}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-ecs-black/40 mt-1">
                  {size(a.file_size)} · {a.created_date ? new Date(a.created_date).toLocaleDateString() : ''}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <button onClick={() => copy(a)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 border border-ecs-black/15 text-[10px] uppercase tracking-[0.12em] hover:border-ecs-gold transition-colors">
                    {copiedId === a.id ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    {copiedId === a.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-ecs-black/15 hover:border-ecs-gold transition-colors" title="Open">
                    <ExternalLink size={11} />
                  </a>
                  <button onClick={() => setDeleteTarget(a)} className="p-1.5 border border-ecs-black/15 text-ecs-black/40 hover:text-red-600 hover:border-red-300 transition-colors" title="Delete">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this image?"
        description={deleteTarget ? `“${deleteTarget.name}” will be removed from the media library. Images still used by content are protected.` : ''}
        confirmLabel="Delete image"
        danger
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  );
}