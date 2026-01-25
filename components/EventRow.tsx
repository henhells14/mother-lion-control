'use client';

import { Clock, MapPin, Users, Info } from 'lucide-react';

interface EventRowProps {
  title: string;
  time: string;
  location: string;
  city: string;
  commentator: string | string[];
  experts: string[];
  note?: string;
}

export default function EventRow({ title, time, location, city, commentator, experts, note }: EventRowProps) {
  const isOslo = city?.toLowerCase() === 'oslo';
  
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      {/* Sijaintipalkki sivussa */}
      <div className={`absolute top-0 left-0 bottom-0 w-2 ${isOslo ? 'bg-orange-500' : 'bg-cyan-500'}`} />
      
      <div className="p-6 md:p-8 ml-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* VASEN: Aika ja Otsikko */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className={`px-4 py-1 rounded-full text-xs font-black italic uppercase tracking-tighter ${isOslo ? 'bg-orange-500 text-white' : 'bg-cyan-500 text-black'}`}>
                {city}: {location}
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-black italic tracking-tighter text-xl">
                <Clock className="w-4 h-4" /> {time}
              </div>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
          </div>

          {/* OIKEA: Tiimi */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users className="w-3 h-3" /> Selostaja
              </span>
              <p className="text-xl font-black italic uppercase text-white truncate">
                {Array.isArray(commentator) ? commentator.join(' + ') : commentator}
              </p>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users className="w-3 h-3" /> Asiantuntijat
              </span>
              <div className="flex flex-wrap gap-2">
                {experts.map((exp, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-black italic uppercase border border-white/10">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HUOMAUTUS ALHAALLA */}
        {note && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-cyan-400/5 rounded-xl border border-cyan-400/20">
            <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <p className="text-sm font-bold italic text-cyan-100/70">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}