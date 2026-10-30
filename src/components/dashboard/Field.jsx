import { Switch } from '@/components/ui/switch';
import ImageField from './ImageField';
import ImagesField from './ImagesField';

const inputClass =
  'w-full bg-transparent border-b border-ecs-black/25 py-2.5 text-sm font-light focus:outline-none focus:border-ecs-gold transition-colors';

export default function Field({ field, value, onChange, onGenerateSlug }) {
  const { name, label, type = 'text', required, placeholder, hint, rows = 4, options = [], full } = field;

  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <label className="label-eyebrow-muted">
          {label}{required && <span className="text-ecs-gold ml-1">*</span>}
        </label>
        {type === 'slug' && onGenerateSlug && (
          <button type="button" onClick={onGenerateSlug} className="text-[10px] uppercase tracking-[0.16em] text-ecs-gold hover:underline">
            Generate
          </button>
        )}
      </div>

      {type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClass} border border-ecs-black/15 px-3 resize-y`}
        />
      )}

      {type === 'select' && (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${inputClass} cursor-pointer`}>
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {type === 'toggle' && (
        <div className="flex items-center gap-3 py-2">
          <Switch checked={!!value} onCheckedChange={onChange} />
          <span className="text-sm text-ecs-black/60">{value ? 'Enabled' : 'Disabled'}</span>
        </div>
      )}

      {type === 'number' && (
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className={inputClass}
        />
      )}

      {type === 'image' && <ImageField value={value} onChange={onChange} label="" />}

      {type === 'images' && <ImagesField value={value} onChange={onChange} />}

      {(type === 'text' || type === 'slug' || type === 'url') && (
        <input
          type={type === 'url' ? 'url' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(type === 'slug' ? e.target.value.replace(/\s+/g, '-').toLowerCase() : e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {hint && <p className="mt-1.5 text-[11px] text-ecs-black/40">{hint}</p>}
    </div>
  );
}