const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { Upload, FileText, ExternalLink, Loader2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function DashboardFiles() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      setFiles((prev) => [{ name: file.name, url: file_url, date: new Date().toLocaleDateString() }, ...prev]);
    } catch {
      // ignore — error state surfaced by empty result
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <DashboardShell eyebrow="Workspace" title="Files">
      <label className="flex flex-col items-center justify-center gap-3 border border-dashed border-ecs-black/20 bg-ecs-white p-10 cursor-pointer hover:border-ecs-gold transition-colors">
        {uploading ? <Loader2 size={20} className="animate-spin text-ecs-gold" /> : <Upload size={20} className="text-ecs-gold" />}
        <span className="text-sm">{uploading ? 'Uploading…' : 'Click to upload a file'}</span>
        <span className="text-xs text-ecs-black/40">Stored to public ECS storage</span>
        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <div className="mt-8 bg-ecs-white border border-ecs-black/10">
        {files.length === 0 ? (
          <p className="px-5 py-8 text-sm text-ecs-black/50 text-center">No files uploaded in this session.</p>
        ) : (
          <ul className="divide-y divide-ecs-black/10">
            {files.map((f, i) => (
              <li key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm min-w-0">
                  <FileText size={16} className="text-ecs-gold shrink-0" />
                  <span className="truncate">{f.name}</span>
                </span>
                <span className="flex items-center gap-4 text-xs text-ecs-black/50">
                  {f.date}
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-ecs-gold hover:underline inline-flex items-center gap-1">
                    Open <ExternalLink size={12} />
                  </a>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}