'use client';

import { useModal } from '../App.jsx';

export default function UpgradeModal({ onClose }) {
  const { setAuthOpen } = useModal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-[28px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[12px] text-black/60 hover:text-black">Close</button>
        <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-2">Pricing</div>
        <h3 className="text-[22px] font-semibold text-black mb-2">ASTRAL Pro</h3>
        <p className="text-[14px] leading-[1.6] text-black/55 mb-6">Unlock synastry depth tools, export-ready reports, and priority backend throughput.</p>

        <div className="rounded-2xl border border-black/8 bg-[#fbfbfd] p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase">Pro</div>
              <div className="mt-1 text-[32px] font-semibold text-black tracking-tight">$9</div>
              <div className="text-[12px] text-black/55">per month</div>
            </div>
            <button
              onClick={async () => { onClose(); }}
              className="rounded-full bg-black text-white px-5 py-2.5 text-[13px] font-medium hover:bg-black/85 active:scale-[0.97] transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>

        <button
          onClick={() => { onClose(); setAuthOpen(true); }}
          className="mt-4 w-full rounded-full border border-black/10 px-4 py-3 text-[13px] font-medium text-black/70 hover:border-black/25 hover:text-black transition-all"
        >
          Already a member? Sign in
        </button>
      </div>
    </div>
  );
}
