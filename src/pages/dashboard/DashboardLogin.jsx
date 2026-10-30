const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { safeReturnTo } from '@/lib/authReturnTo';
import GoogleIcon from '@/components/GoogleIcon';
import { Image } from '@/components/ui/image';

const ECS_LOGO = 'https://media.db.com/images/public/6aabededfb495e66b0aa0b93/597d3cbc3_ECSLogo.png';

export default function DashboardLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const returnTo = safeReturnTo();
  const dest = returnTo === '/' ? '/dashboard' : returnTo;

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, isLoadingAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await db.auth.loginViaEmailPassword(email, password);
      window.location.href = dest;
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-ecs-black">
      <div className="hidden md:flex flex-col justify-between p-12 bg-ecs-black text-ecs-white border-r border-ecs-white/10">
        <Image src={ECS_LOGO} alt="Eternal Creative Studio" className="w-44 h-auto" fittingType="fit" />
        <div>
          <p className="label-eyebrow mb-5">Studio Workspace</p>
          <h1 className="font-display text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight max-w-md">
            The control room behind the work.
          </h1>
          <p className="mt-6 text-sm text-ecs-white/50 font-light leading-relaxed max-w-sm">
            Publish photography, projects and productions. Private to the Eternal Creative Studio team.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-ecs-white/30">
          Authorised access only
        </p>
      </div>

      <div className="flex items-center justify-center bg-ecs-white px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-10">
            <Image src={ECS_LOGO} alt="Eternal Creative Studio" className="w-36 h-auto" fittingType="fit" />
          </div>
          <p className="label-eyebrow mb-3">Workspace</p>
          <h2 className="font-display text-4xl font-light tracking-tight">Sign in</h2>
          <p className="mt-3 text-sm text-ecs-black/55 font-light">Administrative dashboard access.</p>

          <button
            onClick={() => db.auth.loginWithProvider('google', dest)}
            className="mt-8 w-full h-12 border border-ecs-black/20 flex items-center justify-center gap-3 text-sm hover:border-ecs-gold transition-colors"
          >
            <GoogleIcon className="w-5 h-5" /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ecs-black/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-ecs-black/35">or</span>
            <span className="h-px flex-1 bg-ecs-black/10" />
          </div>

          {error && <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ecs-email" className="label-eyebrow-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-ecs-black/35" />
                <input
                  id="ecs-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-ecs-black/25 pl-6 py-2.5 text-sm focus:outline-none focus:border-ecs-gold transition-colors"
                  placeholder="you@eternalcreativestudio.in"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ecs-password" className="label-eyebrow-muted">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-ecs-black/45 hover:text-ecs-gold">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-ecs-black/35" />
                <input
                  id="ecs-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-ecs-black/25 pl-6 py-2.5 text-sm focus:outline-none focus:border-ecs-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-ecs-black text-ecs-white text-[11px] uppercase tracking-[0.22em] hover:bg-ecs-gold hover:text-ecs-black transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-xs text-ecs-black/45 font-light leading-relaxed">
            Access is by approval. New accounts are reviewed by the studio administrator before the dashboard opens.
          </p>

          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ecs-black/40 hover:text-ecs-gold transition-colors">
            <ArrowLeft size={12} /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}