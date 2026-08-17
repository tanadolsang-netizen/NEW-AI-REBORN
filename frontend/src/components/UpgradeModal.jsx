'use client';

import { useState } from 'react';
import { useModal } from '../App.jsx';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

export default function UpgradeModal({ onClose }) {
  const { t } = useLang();
  const { setIsUpgradeOpen } = useModal();
  const [plan, setPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.payments.checkout({ plan });
      const url = typeof res === 'string' ? res : res?.url;
      if (url) {
        window.location.href = url;
      } else {
        setError('Missing checkout URL');
      }
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
          <h3 className="text-[18px] font-semibold text-white">{t('upgrade.title')}</h3>
          <button onClick={() => setIsUpgradeOpen(false)} className="text-white/60 hover:text-white text-[12px]">{t('auth.close')}</button>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white outline-none focus:border-white/25">
            <option value="monthly">{t('upgrade.monthly')}</option>
            <option value="yearly">{t('upgrade.yearly')}</option>
          </select>
          {error && <div className="text-[13px] text-red-300">{error}</div>}
          <button disabled={loading} className="mt-1 inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 text-[14px] font-medium hover:bg-white/90 active:scale-[0.97] transition-all disabled:opacity-60">
            {loading ? '...' : t('upgrade.subscribe')}
          </button>
        </form>
      </div>
    </div>
  );
}
