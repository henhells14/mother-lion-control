'use client';

import { useState } from 'react';
import { Plus, X, Check, Save, Undo2 } from 'lucide-react';

interface Event {
    title: string;
    time: string;
    location: string;
    city: string;
    commentator: string;
    experts: string[];
    note: string;
}

interface AdminEventFormProps {
    initialEvent?: Event;
    onSave: (event: Event) => void;
    onCancel: () => void;
}

export default function AdminEventForm({ initialEvent, onSave, onCancel }: AdminEventFormProps) {
    const [event, setEvent] = useState<Event>(
        initialEvent || {
            title: '',
            time: '',
            location: 'H1',
            city: 'Milano',
            commentator: '',
            experts: [],
            note: '',
        }
    );

    const [expertValue, setExpertValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(event);
    };

    const addExpert = () => {
        if (expertValue.trim()) {
            setEvent({ ...event, experts: [...event.experts, expertValue.trim().toUpperCase()] });
            setExpertValue('');
        }
    };

    const removeExpert = (index: number) => {
        const newExperts = [...event.experts];
        newExperts.splice(index, 1);
        setEvent({ ...event, experts: newExperts });
    };

    // Apumuuttuja yhteiselle input-tyylille
    const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all font-bold";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* TITLE */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] ml-1">Event Title</label>
                    <input
                        type="text"
                        required
                        className={inputStyle}
                        value={event.title}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                        placeholder="e.g. FIN-SWE (m)"
                    />
                </div>

                {/* TIME RANGE */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] ml-1">Broadcast Time</label>
                    <input
                        type="text"
                        required
                        className={inputStyle}
                        value={event.time}
                        onChange={(e) => setEvent({ ...event, time: e.target.value })}
                        placeholder="e.g. 17.00-20.15"
                    />
                </div>

                {/* LOCATION */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] ml-1">Location</label>
                    <select
                        className={`${inputStyle} appearance-none cursor-pointer`}
                        value={event.location}
                        onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    >
                        <option value="H1">H1</option>
                        <option value="H2">H2</option>
                        <option value="Studio">Studio</option>
                        <option value="MFR">MFR</option>
                        <option value="TBC">TBC</option>
                        <option value="H1/2">H1/2</option>
                    </select>
                </div>

                {/* CITY */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] ml-1">Production City</label>
                    <select
                        className={`${inputStyle} appearance-none cursor-pointer`}
                        value={event.city}
                        onChange={(e) => setEvent({ ...event, city: e.target.value })}
                    >
                        <option value="Milano">Milano</option>
                        <option value="Oslo">Oslo</option>
                        <option value="Local">Local</option>
                        <option value="TBC">TBC</option>
                        <option value="-">-</option>
                        <option value="Milano/Oslo">Milano/Oslo</option>
                    </select>
                </div>

                {/* COMMENTATOR */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] ml-1">Commentator ID</label>
                    <input
                        type="text"
                        required
                        className={inputStyle}
                        value={event.commentator}
                        onChange={(e) => setEvent({ ...event, commentator: e.target.value })}
                        placeholder="e.g. SAA"
                    />
                </div>

                {/* NOTE */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Internal Note</label>
                    <input
                        type="text"
                        className={inputStyle}
                        value={event.note}
                        onChange={(e) => setEvent({ ...event, note: e.target.value })}
                        placeholder="e.g. S JOS MAHD"
                    />
                </div>
            </div>

            {/* EXPERTS SECTION */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    Expert Team <span className="text-white/20">(Press Add)</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className={`${inputStyle} flex-1`}
                        value={expertValue}
                        onChange={(e) => setExpertValue(e.target.value)}
                        placeholder="Expert ID (e.g. TIM)"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpert())}
                    />
                    <button
                        type="button"
                        onClick={addExpert}
                        className="px-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-black italic uppercase text-xs"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Expert Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {event.experts.map((expert, idx) => (
                        <span
                            key={idx}
                            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black italic uppercase tracking-tighter shadow-lg shadow-cyan-500/5 animate-in zoom-in-75 duration-300"
                        >
                            <span>{expert}</span>
                            <button
                                type="button"
                                onClick={() => removeExpert(idx)}
                                className="text-cyan-400/50 hover:text-pink-500 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {event.experts.length === 0 && (
                        <p className="text-[10px] italic text-white/20 uppercase tracking-widest pl-1">No experts assigned</p>
                    )}
                </div>
            </div>

            {/* FORM FOOTER BUTTONS */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-6 py-3 text-white/40 hover:text-white transition-colors font-black italic uppercase text-xs tracking-widest"
                >
                    <Undo2 className="w-4 h-4" /> Discard
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl font-black italic uppercase tracking-tighter transition-all hover:scale-105 shadow-xl shadow-cyan-500/20"
                >
                    <Save className="w-5 h-5" /> 
                    {initialEvent ? 'Update Production' : 'Deploy Production'}
                </button>
            </div>
        </form>
    );
}