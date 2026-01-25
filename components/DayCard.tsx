'use client';

import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

interface DayCardProps {
    dayId: number;
    date: string | Date; // Mongoose saattaa palauttaa Date-objektin
    label: string;
    eventCount: number;
    isCurrent?: boolean;
    isPast?: boolean;
}

export default function DayCard({ dayId, label, eventCount, isCurrent, isPast }: DayCardProps) {
    // Luodaan "glassy" tyyli joka vastaa etusivua
    const cardClasses = `
    group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-2
    ${isCurrent 
        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
        : 'border-white/10 bg-black/40 backdrop-blur-md hover:border-white/40'
    }
    ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}
  `;

    return (
        <Link href={`/day/${dayId}`} className="block">
            <div className={cardClasses}>
                {/* Koristeviiva yläreunassa */}
                <div className={`h-1.5 w-full ${isCurrent ? 'bg-cyan-500' : 'bg-white/10 group-hover:bg-white/30'}`} />

                <div className="p-6 space-y-6">
                    {/* Päivän numero isolla - sama fontti kuin etusivulla */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={`text-5xl font-black italic tracking-tighter ${isCurrent ? 'text-cyan-400' : 'text-white'}`}>
                                DAY {dayId}
                            </div>
                            {isCurrent && (
                                <span className="inline-block mt-2 px-3 py-0.5 text-[10px] font-black bg-cyan-500 text-black uppercase rounded-full tracking-tighter">
                                    LIVE NOW
                                </span>
                            )}
                        </div>
                        <ChevronRight className={`w-6 h-6 ${isCurrent ? 'text-cyan-400' : 'text-white/20 group-hover:text-white'}`} />
                    </div>

                    {/* Tiedot */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-white/70">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
                        </div>

                        <div className="flex items-center gap-3 text-white">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            <span className="text-sm font-black uppercase tracking-tight">
                                {eventCount} {eventCount === 1 ? 'Production' : 'Productions'}
                            </span>
                        </div>
                    </div>

                    {/* Alareunan tila-indikaattori */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                            {isPast ? 'Archived' : isCurrent ? 'Active' : 'Scheduled'}
                        </span>
                        {!isPast && (
                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
                        )}
                    </div>
                </div>

                {/* Hover-efekti taustalle */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </Link>
    );
}