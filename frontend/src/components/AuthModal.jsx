'use client';

import { useModal } from '../App.jsx';

export default function AuthModal({ onClose }) {
  const { setUpgradeOpen } = useModal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-[28px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[12px] text-black/60 hover:text-black">Close</button>
        <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-2">Sign in</div>
        <h3 className="text-[22px] font-semibold text-black mb-4">Welcome to ASTRAL</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); onClose(); }}
          className="grid gap-3"
        >
          <input type="email" placeholder="Email" className="rounded-2xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-[14px]" />
          <input type="password" placeholder="Password" className="rounded-2xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-[14px]" />
          <button type="submit" className="w-full rounded-full bg-black text-white py-3 text-[14px] font-medium hover:bg-black/85 active:scale-[0.97] transition-all">Continue</button>
        </form>
        <button
          onClick={() => { onClose(); setUpgradeOpen(true); }}
          className="mt-4 w-full rounded-full border border-black/10 px-4 py-3 text-[13px] font-medium text-black/70 hover:border-black/25 hover:text-black transition-all"
        >
          View plans
        </button>
      </div>
    </div>
  );
}
