'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import AdminEventForm from '@/components/AdminEventForm';
import { ArrowLeft, Plus, Trash2, Edit3, Calendar, Clock, MapPin } from 'lucide-react';

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
                setIsAdding(false);
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Failed to save changes'}`);
            }
        } catch (error) {
            console.error('Failed to save day:', error);
            alert('Network error. Please try again.');
        }
    };

    const deleteEvent = (index: number) => {
        if (!day) return;
        const newEvents = [...day.mainEvents];
        newEvents.splice(index, 1);
        handleSave({ ...day, mainEvents: newEvents });
    };

    const updateEvent = (index: number, event: Event) => {
        if (!day) return;
        const newEvents = [...day.mainEvents];
        newEvents[index] = event;
        handleSave({ ...day, mainEvents: newEvents });
    };

    const addEvent = (event: Event) => {
        if (!day) return;
        handleSave({ ...day, mainEvents: [...day.mainEvents, event] });
    };

    if (loading || !day) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-black italic uppercase text-2xl tracking-tighter">
                <div className="animate-pulse">Accessing Day {dayId}...</div>
            </div>
        );
    }

    return (
        <main 
            className="min-h-screen relative text-white bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.98)), url('/og-background.jpg')" }}
        >
            <div className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
                
                {/* HEADER - ROCK STYLE */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <Link href="/admin" className="group flex items-center gap-2 text-cyan-400 font-black italic uppercase text-xs tracking-widest mb-4 transition-transform hover:-translate-x-1">
                            <ArrowLeft className="w-4 h-4" /> Control Center
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            EDIT <span className="text-pink-500">DAY {day.dayId}</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-4 text-white/50 font-bold uppercase tracking-widest text-sm">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            {day.label} <span className="mx-2 text-white/10">|</span> {day.date}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full md:w-auto px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black italic uppercase tracking-tighter shadow-lg shadow-pink-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add New Event
                    </button>
                </header>

                {/* ADD NEW EVENT FORM SECTION */}
                {isAdding && (
                    <div className="mb-12 glass-card p-8 rounded-3xl border-2 border-cyan-400/30 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h2 className="text-2xl font-black italic text-cyan-400 uppercase tracking-tighter mb-6">Create New Production</h2>
                        <AdminEventForm
                            onSave={addEvent}
                            onCancel={() => setIsAdding(false)}
                        />
                    </div>
                )}

                {/* EVENTS LIST */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">Live Production Timeline</h2>
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="bg-white/5 text-white/50 text-[10px] font-black px-3 py-1 rounded-full border border-white/10">
                            {day.mainEvents.length} TOTAL
                        </span>
                    </div>

                    {day.mainEvents.length === 0 && !isAdding && (
                        <div className="text-center py-20 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl">
                            <p className="text-xl font-black italic uppercase text-white/20 tracking-widest">No productions scheduled.</p>
                        </div>
                    )}

                    {day.mainEvents.map((event, idx) => (
                        <div key={idx} className="group glass-card rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/30">
                            {editingIndex === idx ? (
                                <div className="p-8 bg-black/40">
                                    <h3 className="text-xl font-black italic text-pink-500 uppercase mb-6">Editing Production #{idx + 1}</h3>
                                    <AdminEventForm
                                        initialEvent={event}
                                        onSave={(updated) => updateEvent(idx, updated)}
                                        onCancel={() => setEditingIndex(null)}
                                    />
                                </div>
                            ) : (
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                    {/* Event Info Display */}
                                    <div className="flex-1 text-center md:text-left space-y-2">
                                        <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2 px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full font-black italic tracking-tighter">
                                                <Clock className="w-4 h-4" /> {event.time}
                                            </div>
                                            <div className="text-xs font-black uppercase tracking-widest text-pink-500">
                                                {event.city}: {event.location}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center justify-center md:justify-start gap-3 text-white/50 font-bold italic text-sm">
                                            <MapPin className="w-4 h-4" /> {event.commentator}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button
                                            onClick={() => setEditingIndex(idx)}
                                            className="flex-1 md:flex-none p-4 md:p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 font-black italic uppercase text-xs"
                                        >
                                            <Edit3 className="w-4 h-4 text-cyan-400" /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this event?')) {
                                                    deleteEvent(idx);
                                                }
                                            }}
                                            className="flex-1 md:flex-none p-4 md:p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 flex items-center justify-center gap-2 font-black italic uppercase text-xs"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* BOTTOM NAV */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link href="/admin" className="text-white/30 hover:text-white font-black italic uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Command Center
                    </Link>
                </div>
            </div>
        </main>
    );
}