'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import AdminEventForm from '@/components/AdminEventForm';
import { ArrowLeft, Plus, Trash2, Edit3, Calendar, Clock, Mic2, Check, X, MonitorOff } from 'lucide-react';

interface Event {
    title: string;
    time: string;
    location: string;
    city: string;
    commentator: string;
    experts: string[];
    note: string;
}

interface ProductionDay {
    dayId: number;
    label: string;
    date: string;
    noStudio?: string[];
    mainEvents: Event[];
}

export default function AdminDayEditor({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const dayId = resolvedParams.id;
    const [day, setDay] = useState<ProductionDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    // STUDIO-MUOKKAUSTILAT
    const [newStudioNote, setNewStudioNote] = useState('');
    const [editingStudioIndex, setEditingStudioIndex] = useState<number | null>(null);
    const [tempStudioText, setTempStudioText] = useState('');

    useEffect(() => {
        fetch(`/api/days/${dayId}`)
            .then((res) => res.json())
            .then((data) => {
                setDay(data);
                setLoading(false);
            });
    }, [dayId]);

    const handleSave = async (updatedDay: ProductionDay) => {
        try {
            const res = await fetch(`/api/days/${dayId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDay),
            });
            if (res.ok) {
                const savedData = await res.json();
                setDay(savedData);
                setEditingIndex(null);
                setEditingStudioIndex(null);
                setIsAdding(false);
            }
        } catch (error) { console.error('Save failed:', error); }
    };

    // STUDIO-HALLINTA
    const addStudioNote = () => {
        if (!day || !newStudioNote.trim()) return;
        const updatedNoStudio = [...(day.noStudio || []), newStudioNote.trim()];
        handleSave({ ...day, noStudio: updatedNoStudio });
        setNewStudioNote('');
    };

    const startEditingStudio = (idx: number, text: string) => {
        setEditingStudioIndex(idx);
        setTempStudioText(text);
    };

    const saveEditedStudio = (idx: number) => {
        if (!day || !day.noStudio) return;
        const updatedNoStudio = [...day.noStudio];
        updatedNoStudio[idx] = tempStudioText;
        handleSave({ ...day, noStudio: updatedNoStudio });
    };

    const removeStudioNote = (index: number) => {
        if (!day || !day.noStudio) return;
        if (confirm('Poistetaanko tämä status-päivitys?')) {
            const updatedNoStudio = day.noStudio.filter((_, i) => i !== index);
            handleSave({ ...day, noStudio: updatedNoStudio });
        }
    };

    // EVENT-HALLINTA
    const deleteEvent = (index: number) => {
        if (!day) return;
        if (confirm('Poistetaanko tapahtuma?')) {
            const newEvents = [...day.mainEvents];
            newEvents.splice(index, 1);
            handleSave({ ...day, mainEvents: newEvents });
        }
    };

    const updateEvent = (index: number, event: Event) => {
        if (!day) return;
        const newEvents = [...day.mainEvents];
        newEvents[index] = event;
        handleSave({ ...day, mainEvents: newEvents });
    };

    if (loading || !day) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-black italic uppercase text-2xl animate-pulse">🦁 Lion is preparing the stage...</div>;

    return (
        <main className="min-h-screen relative text-white bg-fixed bg-cover bg-center pb-20" style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.92), rgba(2, 6, 23, 0.98)), url('/og-background.jpg')" }}>
            <div className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
                
                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <Link href="/admin" className="group flex items-center gap-2 text-cyan-400 font-black italic uppercase text-xs tracking-widest mb-4 transition-transform hover:-translate-x-1">
                            <ArrowLeft className="w-4 h-4" /> Control Center
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            EDIT <span className="text-pink-500">DAY {day.dayId}</span>
                        </h1>
                    </div>
                    <button onClick={() => setIsAdding(true)} className="w-full md:w-auto px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black italic uppercase tracking-tighter shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" /> Add New Event
                    </button>
                </header>

                {/* --- PRODUCTION STATUS (GOLD CARDS) --- */}
                <section className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 italic">Production Status & Updates</h2>
                        <div className="h-px flex-1 bg-amber-500/20" />
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 mb-8">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newStudioNote}
                                onChange={(e) => setNewStudioNote(e.target.value)}
                                placeholder="Esim: STUDIO 1: REMOTE - T. SELÄNNE"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all font-bold italic"
                            />
                            <button onClick={addStudioNote} className="px-6 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black italic uppercase text-xs transition-all">
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {(day.noStudio || []).map((note, idx) => (
                            <div key={idx} className="relative group overflow-hidden glass-card rounded-3xl border-l-8 border-l-amber-500 border-y border-r border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent p-6 transition-all">
                                {editingStudioIndex === idx ? (
                                    <div className="flex w-full gap-4 items-center">
                                        <input 
                                            autoFocus 
                                            value={tempStudioText} 
                                            onChange={(e) => setTempStudioText(e.target.value)}
                                            className="flex-1 bg-white/10 border-2 border-amber-500/50 rounded-2xl px-4 py-3 text-xl font-black italic uppercase text-white outline-none"
                                        />
                                        <button onClick={() => saveEditedStudio(idx)} className="p-3 bg-green-500 rounded-xl text-black transition-transform hover:scale-110"><Check /></button>
                                        <button onClick={() => setEditingStudioIndex(null)} className="p-3 bg-white/10 rounded-xl text-white transition-transform hover:scale-110"><X /></button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
                                                <MonitorOff className="w-3 h-3" /> Production Status Update
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                                                {note}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditingStudio(idx, note)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-amber-500"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => removeStudioNote(idx)} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-all text-red-500"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- PRODUCTION TIMELINE --- */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">Live Production Timeline</h2>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {isAdding && (
                        <div className="mb-12 glass-card p-8 rounded-3xl border-2 border-cyan-400/30 animate-in fade-in slide-in-from-top-4 duration-500">
                            <AdminEventForm onSave={(event) => {
                                handleSave({ ...day, mainEvents: [...day.mainEvents, event] });
                                setIsAdding(false);
                            }} onCancel={() => setIsAdding(false)} />
                        </div>
                    )}

                    {day.mainEvents.map((event, idx) => (
                        <div key={idx} className="group glass-card rounded-3xl border border-white/10 overflow-hidden transition-all duration-300">
                            {editingIndex === idx ? (
                                <div className="p-8 bg-black/40">
                                    <AdminEventForm initialEvent={event} onSave={(updated) => updateEvent(idx, updated)} onCancel={() => setEditingIndex(null)} />
                                </div>
                            ) : (
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                                            <div className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full font-black italic tracking-tighter text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {event.time}
                                            </div>
                                            <div className="text-xs font-black uppercase text-pink-500">
                                                {event.city}: {event.location}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-3 text-white/50 font-bold italic text-sm">
                                            <Mic2 className="w-4 h-4 text-cyan-400/50" /> {event.commentator}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button onClick={() => setEditingIndex(idx)} className="flex-1 md:flex-none p-4 md:p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 font-black italic uppercase text-xs">
                                            <Edit3 className="w-4 h-4 text-cyan-400" /> Edit
                                        </button>
                                        <button onClick={() => deleteEvent(idx)} className="flex-1 md:flex-none p-4 md:p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 flex items-center justify-center gap-2 font-black italic uppercase text-xs">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}