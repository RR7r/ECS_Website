const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useRef, useState } from 'react';
import { Upload, X, Loader2, Link2 } from 'lucide-react';

import { Image } from '@/components/ui/image';

export default function ImageField({ value, onChange, label }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Images must be under 10 MB.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
      try {
        await db.entities.MediaAsset.create({
          name: file.name,
          file_url,
          file_size: file.size,
          mime_type: file.type,
          category: 'Content',
        });
      } catch {
        // the upload itself succeeded; the library entry is secondary
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <p className="label-eyebrow-muted mb-2">{label}</p>}
      {value ? (
        <div className="relative group border border-ecs-black/10 bg-ecs-cream">
          <Image src={value} alt={label || 'Image'} className="w-full aspect-[16/9]" fittingType="fill" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-ecs-black/80 text-ecs-white hover:bg-ecs-gold hover:text-ecs-black transition-colors"
              title="Replace image"
            >
              <Upload size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-ecs-black/80 text-ecs-white hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full border border-dashed border-ecs-black/25 bg-ecs-white px-6 py-10 flex flex-col items-center gap-2 hover:border-ecs-gold transition-colors disabled:opacity-60"
        >
          {busy ? <Loader2 size={18} className="animate-spin text-ecs-gold" /> : <Upload size={18} className="text-ecs-gold" />}
          <span className="text-sm font-light">{busy ? 'Uploading…' : 'Upload image'}</span>
          <span className="text-[11px] text-ecs-black/40">JPG or PNG · under 10 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setUrlMode((v) => !v)} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ecs-black/45 hover:text-ecs-gold">
          <Link2 size={12} /> Use an image URL
        </button>
        {value && <span className="text-[10px] text-ecs-black/30 truncate max-w-[220px]">{value}</span>}
      </div>
      {urlMode && (
        <div className="mt-2 flex gap-2">
          <input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://…"
            className="flex-1 bg-transparent border-b border-ecs-black/25 py-2 text-sm focus:outline-none focus:border-ecs-gold"
          />
          <button
            type="button"
            onClick={() => { if (urlValue.trim()) { onChange(urlValue.trim()); setUrlValue(''); setUrlMode(false); } }}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.18em] border border-ecs-black/20 hover:border-ecs-gold"
          >
            Apply
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}