import { useEffect } from 'react';

/**
 * Shared shell for dashboard pages. Sets the document title and renders
 * a consistent editorial page header.
 */
export default function DashboardShell({ title, eyebrow, children, actions }) {
  useEffect(() => {
    document.title = `${title} — ECS Workspace`;
    return () => {
      document.title = 'Eternal Creative Studio — Film • Media • Design • Digital';
    };
  }, [title]);

  return (
    <div className="px-6 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          {eyebrow && <p className="label-eyebrow mb-3">{eyebrow}</p>}
          <h1 className="font-display text-3xl md:text-5xl font-light tracking-tight">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}