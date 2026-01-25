'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import AdminLoginModal from '@/components/AdminLoginModal';

interface HomeClientProps {
  totalEvents: number;
  dayCount: number;
}

export default function HomeClient({ totalEvents, dayCount }: HomeClientProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main
      className="min-h-screen relative flex flex-col items-center justify-start overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/og-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 1. ADMIN-NAPPI
          Mobiilissa: pt-6
          Desktopissa: top-12
      */}
      <div className="relative z-[60] w-full flex justify-end px-6 pt-6 md:absolute md:top-12 md:right-12 md:p-0 md:w-auto">
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="h-10 md:h-14 inline-flex items-center justify-center rounded-full bg-pink-500 px-5 md:px-8 text-[10px] md:text-lg font-black italic uppercase tracking-tighter text-white shadow-xl border border-pink-400/30 transition-all active:scale-95"
        >
          <span className="mr-2 text-base md:text-xl">🦁</span> Mother lion
        </button>
      </div>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />

      {/* 2. SISÄLTÖKONTTI 
          pt-24 mobiilissa -> Reilu väli nappiin.
          md:pt-40 työpöydällä -> Otsikko laskeutuu alemmas ja saa tilaa.
      */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 pt-24 md:pt-40">
        
        {/* OTSikko */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] drop-shadow-[0_10px_20px_rgba(0,0,0,1)] text-white">
            <span className="text-[#009246]">Mila</span>no 
            <br className="md:hidden" />
            <span className="text-[#ce2b37]">Cortina</span>
          </h1>
          <div className="text-8xl sm:text-8xl md:text-[9rem] font-black italic text-white uppercase leading-none mt-2 md:mt-[-0.5rem] drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">
            2026
          </div>
          <p className="text-[10px] md:text-2xl text-white font-black italic uppercase tracking-[0.4em] mt-8 opacity-80">
            Production Schedule
          </p>
        </div>

        {/* LOGIN FORM */}
        <div className="max-w-[280px] md:max-w-sm mx-auto mb-10 md:mb-16 relative z-30">
          <div className="glass-card p-1 rounded-2xl shadow-2xl border border-white/10">
            <LoginForm />
          </div>
        </div>

        {/* INFO-KORTIT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-[320px] md:max-w-none mx-auto pb-20 text-white">
          <div className="glass-card p-4 md:p-6 rounded-2xl border-t-4 border-t-[#009246]">
            <div className="text-4xl md:text-5xl font-black italic text-[#009246] mb-1 leading-none">{dayCount}</div>
            <div className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest leading-none">Days of Production</div>
          </div>

          <div className="glass-card p-4 md:p-6 rounded-2xl border-t-4 border-t-white">
            <div className="text-4xl md:text-5xl font-black italic text-white mb-1 leading-none">2</div>
            <div className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest leading-none">Production Cities</div>
          </div>

          <div className="glass-card p-4 md:p-6 rounded-2xl border-t-4 border-t-[#ce2b37]">
            <div className="text-4xl md:text-5xl font-black italic text-[#ce2b37] mb-1 leading-none">{totalEvents}</div>
            <div className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest leading-none">Scheduled Events</div>
          </div>
        </div>
      </div>
    </main>
  );
}