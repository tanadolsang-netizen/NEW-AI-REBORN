'use client';

import { useState } from 'react';
import { useModal } from '../App.jsx';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

export default function AuthModal({ onClose }) {
  const { t } = useLang();
  const { setIsAuthOpen } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // login | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = mode === 'login' ? api.auth.login : api.auth.signup;
      await fn({ email, password });
      setIsAuthOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-white">{mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}</h3>
          <button onClick={() => setIsAuthOpen(false)} className="text-white/60 hover:text-white text-[12px]">{t('auth.close')}</button>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.email')} type="email" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password')} type="password" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all" />
          {error && <div className="text-[13px] text-red-300">{error}</div>}
          <button disabled={loading} className="mt-1 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-[14px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all disabled:opacity-60 shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            {loading ? '...' : (mode === 'login' ? t('auth.login') : t('auth.signup'))}
          </button>
        </form>
        <div className="mt-4 text-[13px] text-white/55">
          {mode === 'login' ? (
            <button onClick={() => setMode('signup')} className="hover:text-white">{t('auth.noAccount')}</button>
          ) : (
            <button onClick={() => setMode('login')} className="hover:text-white">{t('auth.hasAccount')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
