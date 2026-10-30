const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

import { Image } from '@/components/ui/image';

export default function ImagesField({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = Array.isArray(value) ? value : [];

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    setBusy(true);
    setError('');
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      onChange([...list, file_url]);
      try {
        await db.entities.MediaAsset.create({
          name: file.name, file_url, file_size: file.size, mime_type: file.type, category: 'Content',
        });
      } catch {
        // library entry is secondary to the upload
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((url, i) => (
          <div key={`${url}-${i}`} className="relative border border-ecs-black/10 bg-ecs-cream">
            <Image src={url} alt={`Image ${i + 1}`} className="w-full aspect-[4/3]" fittingType="fill" />
            <button
              type="button"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 right-1.5 p-1.5 bg-ecs-black/80 text-ecs-white hover:bg-red-600"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-[4/3] border border-dashed border-ecs-black/25 flex flex-col items-center justify-center gap-2 hover:border-ecs-gold transition-colors disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin text-ecs-gold" /> : <Upload size={16} className="text-ecs-gold" />}
          <span className="text-[11px] text-ecs-black/50">{busy ? 'Uploading…' : 'Add image'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}