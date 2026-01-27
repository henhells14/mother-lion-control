'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
// Lisätty Users ja StickyNote ikonit
import { ArrowLeft, Clock, Mic2, MonitorOff, Calendar, MapPin, ChevronLeft, ChevronRight, Users, StickyNote } from 'lucide-react';

export default function DayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dayIdNum = parseInt(resolvedParams.id);
  const [day, setDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const totalDays = 21; 

  useEffect(() => {
    setMounted(true);
    fetch(`/api/days/${dayIdNum}`)
      .then((res) => res.json())
      .then((data) => {
        setDay(data);
        setLoading(false);
      });
  }, [dayIdNum]);

  const getLionColor = (event: any) => {
    const searchText = `${event.city || ''} ${event.location || ''}`.toLowerCase();
    if (searchText.includes('oslo') && searchText.includes('mila')) return '#a855f7'; 
    if (searchText.includes('oslo')) return '#ef4444'; 
    if (searchText.includes('mila')) return '#009246'; 
    if (searchText.includes('loc')) return '#06b6d4'; 
    return '#64748b'; 
  };

  if (!mounted || loading || !day) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-black italic text-white animate-pulse tracking-tighter text-3xl">
      🦁 LION IS PREPARING...
    </div>
  );

  return (
    <main suppressHydrationWarning className="min-h-screen relative text-white bg-fixed bg-cover bg-center pb-20" style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.94), rgba(2, 6, 23, 0.98)), url('/og-background.jpg')" }}>
      <div className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
        
        <header className="mb-6">
          <Link href="/dashboard" className="group inline-flex items-center gap-2 text-cyan-400 font-black italic uppercase text-xs tracking-widest transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Schedule
          </Link>
        </header>

        <div className="flex items-center justify-between mb-8">
          {dayIdNum > 1 ? (
            <Link href={`/day/${dayIdNum - 1}`} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-pink-500" />
              <span className="text-[10px] font-black uppercase">Day {dayIdNum - 1}</span>
            </Link>
          ) : <div className="w-24" />}

          <div className="text-center">
             <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none drop-shadow-2xl">
              DAY <span className="text-pink-500">{day.dayId}</span>
            </h1>
          </div>

          {dayIdNum < totalDays ? (
            <Link href={`/day/${dayIdNum + 1}`} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              <span className="text-[10px] font-black uppercase">Day {dayIdNum + 1}</span>
              <ChevronRight className="w-5 h-5 text-pink-500" />
            </Link>
          ) : <div className="w-24" />}
        </div>

        <div className="flex items-center justify-center gap-3 mb-12 text-white/40 font-bold uppercase tracking-[0.3em] text-sm">
          <Calendar className="w-4 h-4 text-cyan-400" /> {day.label} | {day.date}
        </div>

        {/* PRODUCTION ALERTS */}
        {day.noStudio && day.noStudio.length > 0 && (
          <div className="mb-16 space-y-4">
            {day.noStudio.map((note: string, idx: number) => (
              <div key={idx} className="glass-card rounded-3xl border-l-[16px] border-l-amber-500 bg-amber-500/10 p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-8">
                  <MonitorOff className="w-12 h-12 text-amber-500" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-1">Production Alert</p>
                    <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">{note}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TUOTANTO-AIKATAULU */}
        <div className="space-y-10">
          {day.mainEvents && day.mainEvents.map((event: any, idx: number) => {
            const cardColor = getLionColor(event);
            return (
              <div 
                key={idx} 
                className="group relative glass-card rounded-[2.5rem] border border-white/5 bg-black/40 overflow-hidden shadow-2xl"
                style={{ borderLeft: `16px solid ${cardColor}` }}
              >
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  
                  {/* AIKA JA STATUS */}
                  <div className="flex flex-col items-center md:items-start gap-5 min-w-[160px]">
                    <div 
                      className="px-8 py-3 rounded-full font-black italic text-3xl tracking-tighter border border-white/10 shadow-lg"
                      style={{ color: cardColor, backgroundColor: `${cardColor}15` }}
                    >
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-60">
                      <MapPin className="w-3.5 h-3.5" style={{ color: cardColor }} />
                      <span style={{ color: cardColor }}>{event.city}: {event.location}</span>
                    </div>
                  </div>

                  {/* INFO SECTION */}
                  <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                      <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4 text-white">
                        {event.title}
                      </h3>
                      
                      {/* KOMMENTAATTORI JA EKSPERTIT */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                          <Mic2 className="w-4 h-4" style={{ color: cardColor }} />
                          <span className="text-sm font-black italic uppercase text-white/80">{event.commentator}</span>
                        </div>
                        
                        {event.experts && event.experts.length > 0 && event.experts[0] !== "" && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-bold italic uppercase text-cyan-400/80">
                              {Array.isArray(event.experts) ? event.experts.join(', ') : event.experts}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INTERNAL NOTE */}
                    {event.note && (
                      <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-start gap-3 max-w-xl mx-auto md:mx-0">
                        <StickyNote className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                        <p className="text-xs md:text-sm font-medium italic text-white/50 leading-relaxed">
                          {event.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}