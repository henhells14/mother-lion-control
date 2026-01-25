'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, Edit3, LayoutDashboard } from 'lucide-react';

interface ProductionDay {
    dayId: number;
    label: string;
    date: string;
    mainEvents: any[];
}

export default function AdminDashboard() {
    const [days, setDays] = useState<ProductionDay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/days')
            .then((res) => res.json())
            .then((data) => {
                setDays(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-black italic uppercase tracking-tighter text-3xl">
                <div className="animate-pulse">Loading Command Center...</div>
            </div>
        );
    }

    return (
        <main 
            className="min-h-screen relative text-white bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.95)), url('/og-background.jpg')" }}
        >
            <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                
                {/* ROCK HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-pink-500 font-black uppercase tracking-[0.3em] text-xs mb-2">
                            <LayoutDashboard className="w-4 h-4" /> Admin Access
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            Control <span className="text-cyan-400">Center</span> 🦁
                        </h1>
                        <p className="text-white/40 mt-4 font-bold italic uppercase tracking-widest text-sm">
                            Milano Cortina 2026 Production Management
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Link
                            href="/admin/settings"
                            className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-black italic uppercase tracking-tighter flex items-center justify-center gap-2"
                        >
                            <Settings className="w-4 h-4 text-pink-500" /> Settings
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 md:flex-none px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl transition-all font-black italic uppercase tracking-tighter shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Exit
                        </Link>
                    </div>
                </header>

                {/* GRID OF DAYS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {days.map((day) => (
                        <div
                            key={day.dayId}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 transition-all duration-500 hover:border-cyan-400/50 hover:-translate-y-2 shadow-2xl"
                        >
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-500 opacity-30 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                                        Day {day.dayId}
                                    </div>
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mt-1">{day.label}</p>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-white/30 bg-white/5 px-2 py-1 rounded">
                                    {day.date}
                                </div>
                            </div>

                            {/* Stat-rivi */}
                            <div className="flex items-center gap-6 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Productions</span>
                                    <span className="text-2xl font-black italic text-cyan-400 leading-none mt-1">
                                        {day.mainEvents.length}
                                    </span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status</span>
                                    <span className="text-[10px] font-black italic text-green-500 uppercase tracking-tighter mt-1">
                                        ● Online
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/admin/day/${day.dayId}`}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black hover:bg-cyan-400 hover:text-black transition-all rounded-2xl font-black italic uppercase tracking-tighter"
                            >
                                <Edit3 className="w-4 h-4" /> Edit Schedule
                            </Link>

                            {/* Hover-valo */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}