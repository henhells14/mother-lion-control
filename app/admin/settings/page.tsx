'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Save, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Lock, KeyRound } from 'lucide-react';

export default function AdminSettings() {
    const [password, setPassword] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setPassword(data.viewerPassword || '');
                setAdminPassword(data.adminPassword || '');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    viewerPassword: password,
                    adminPassword: adminPassword
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'SECURITY PROTOCOLS UPDATED!' });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'ACCESS DENIED: UPDATE FAILED' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'SYSTEM ERROR: CONNECTION LOST' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-black italic uppercase tracking-tighter text-2xl">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-12 w-12 text-cyan-400" />
                    <span className="animate-pulse">Loading Security Protocols...</span>
                </div>
            </div>
        );
    }

    return (
        <main 
            className="min-h-screen relative text-white bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.98)), url('/og-background.jpg')" }}
        >
            <div className="max-w-3xl mx-auto p-6 md:p-12 relative z-10">
                
                {/* HEADER */}
                <header className="mb-16">
                    <Link href="/admin" className="group flex items-center gap-2 text-cyan-400 font-black italic uppercase text-xs tracking-widest mb-6 transition-transform hover:-translate-x-1">
                        <ArrowLeft className="w-4 h-4" /> Control Center
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-pink-500/20 rounded-3xl border border-pink-500/30">
                            <Shield className="w-10 h-10 md:w-14 md:h-14 text-pink-500" />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                                SECURITY <span className="text-cyan-400">VAULT</span>
                            </h1>
                            <p className="text-white/30 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Mother Lion Access Management
                            </p>
                        </div>
                    </div>
                </header>

                <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="bg-white/5 p-8 border-b border-white/5">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Access Protocol</h2>
                        <p className="text-white/40 text-xs font-bold mt-1 uppercase tracking-widest">
                            Authorized personnel only. Changes are applied globally.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="p-8 space-y-10">
                        {/* Viewer Password */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-cyan-400" />
                                <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Viewer Access Code</label>
                            </div>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                                placeholder="VIEWER_PASS_2026"
                            />
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest pl-2 italic">Standard access for production crew.</p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Admin Password */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-pink-500" />
                                <label className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Master Lion Password</label>
                            </div>
                            <input
                                type="text"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-mono text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 transition-all"
                                placeholder="ADMIN_MASTER_PASS"
                            />
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest pl-2 italic">Master key for dashboard and settings.</p>
                        </div>

                        {/* Feedback Message */}
                        {message.text && (
                            <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in-95 duration-300 ${
                                message.type === 'success' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                                <span className="text-sm font-black italic uppercase tracking-tighter">{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full group relative flex items-center justify-center gap-3 py-5 bg-white text-black font-black italic uppercase tracking-tighter rounded-2xl transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50 shadow-xl"
                        >
                            {saving ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : <Save className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />}
                            <span className="text-xl">Save All Protocols</span>
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
                        Milano Cortina 2026 • Encrypted Production Link
                    </p>
                </div>
            </div>
        </main>
    );
}