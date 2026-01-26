'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6" suppressHydrationWarning>
            {/* 1. Lisätty suppressHydrationWarning formiin */}
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col gap-4" 
                suppressHydrationWarning
            >
                <div className="relative">
                    {/* 2. Lisätty suppressHydrationWarning ja autoComplete inputiin */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to view the schedule"
                        autoComplete="current-password"
                        suppressHydrationWarning
                        className="w-full px-6 py-3 bg-white text-slate-900 rounded-md shadow-lg border-2 border-transparent focus:border-[hsl(var(--milano-blue))] outline-none placeholder:text-slate-400 font-medium"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#00FFCC] hover:bg-[#00E6B8] text-slate-900 font-bold rounded-md shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-[#00BFA5]"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Enter-view the schedule'
                    )}
                </button>
            </form>
            {error && (
                <p className="text-red-500 bg-white/90 px-4 py-2 rounded-md text-sm font-bold text-center border-2 border-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}