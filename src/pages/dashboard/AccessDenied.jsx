import { Link } from 'react-router-dom';
import { ShieldX, LogOut, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-ecs-black text-ecs-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="w-12 h-12 border border-red-400/40 flex items-center justify-center mb-8">
          <ShieldX size={20} className="text-red-400" />
        </div>
        <p className="label-eyebrow mb-4">Access denied</p>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
          This account does not have access.
        </h1>
        <p className="mt-6 text-sm md:text-base text-ecs-white/60 font-light leading-relaxed">
          Dashboard access for this account has been rejected or revoked. If you believe this is a mistake, contact the studio administrator.
        </p>
        {user?.email && (
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ecs-white/35">{user.email}</p>
        )}
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
