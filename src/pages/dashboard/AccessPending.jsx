import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { resolveStatus } from '@/lib/cms/roles';
import { SUPER_ADMIN_EMAIL } from '@/lib/cms/config';

export default function AccessPending() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const started = useRef(false);
  const [state, setState] = useState('idle');

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!user) { navigate('/dashboard/login', { replace: true }); return; }
    const status = resolveStatus(user);
    if (status === 'approved') navigate('/dashboard', { replace: true });
    if (status === 'rejected') navigate('/dashboard/access-denied', { replace: true });
  }, [user, isLoadingAuth, navigate]);

  useEffect(() => {
    if (!user || started.current) return;
    if (resolveStatus(user) !== 'pending') return;
    started.current = true;
    setState('saving');
    (async () => {
      try {
        const res = await base44.entities.AccessRequest.filter({ email: user.email });
        const items = Array.isArray(res) ? res : res?.items || [];
        if (items.length === 0) {
          await base44.entities.AccessRequest.create({
            full_name: user.full_name || '',
            email: user.email,
            user_id: user.id,
            status: 'pending',
            requested_role: 'editor',
          });
          try {
            await base44.integrations.Core.SendEmail({
              to: SUPER_ADMIN_EMAIL,
              subject: `Dashboard access request — ${user.full_name || user.email}`,
              body: `${user.full_name || 'A new account'} (${user.email}) is requesting access to the Eternal Creative Studio dashboard. Open Access Requests in the workspace to approve or reject it.`,
            });
          } catch {
            // email delivery depends on the app's email configuration
          }
        }
        setState('done');
      } catch {
        setState('done');
      }
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-ecs-black text-ecs-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="w-12 h-12 border border-ecs-gold/40 flex items-center justify-center mb-8">
          <Clock size={20} className="text-ecs-gold" />
        </div>
        <p className="label-eyebrow mb-4">Access</p>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
          Access request received
        </h1>
        <p className="mt-6 text-sm md:text-base text-ecs-white/60 font-light leading-relaxed">
          Your account has been successfully authenticated, but dashboard access has not yet been approved.
        </p>
        <p className="mt-4 text-sm md:text-base text-ecs-white/50 font-light leading-relaxed">
          Your request is under review by the Eternal Creative Studio administrator. You will receive an email notification once your access request has been reviewed.
        </p>

        <div className="mt-8 border-t border-ecs-white/10 pt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-ecs-white/40">
          <span>{user?.email || 'Signed in'}</span>
          {state === 'saving' && <span className="inline-flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> Recording request</span>}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => base44.auth.logout('/dashboard/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-ecs-white/25 text-[11px] uppercase tracking-[0.2em] hover:border-ecs-gold hover:text-ecs-gold transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ecs-white/45 hover:text-ecs-gold transition-colors">
            <ArrowLeft size={13} /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
