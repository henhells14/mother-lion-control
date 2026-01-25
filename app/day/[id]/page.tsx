import EventRow from '@/components/EventRow';
import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getDayData(dayId: number) {
    try {
        const mongoose = await import('mongoose');
        const ProductionDay = (await import('@/models/ProductionDay')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const day = await ProductionDay.findOne({ dayId }).lean();
        return day;
    } catch (error) {
        console.error('Error fetching day data:', error);
        return null;
    }
}

export default async function DayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dayId = parseInt(id);

    if (isNaN(dayId) || dayId < 1 || dayId > 21) notFound();

    const day: any = await getDayData(dayId);
    if (!day) notFound();

    return (
        <main 
            className="min-h-screen relative text-white bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.95)), url('/og-background.jpg')" }}
        >
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="group flex items-center gap-2 text-cyan-400 font-black italic uppercase tracking-tighter transition-all hover:scale-110">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                        Dashboard
                    </Link>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none mb-1">Olympic Production</div>
                        <div className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                            Day <span className="text-cyan-400">{day.dayId}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* DAY TITLE SECTION */}
                <div className="mb-16 text-center md:text-left relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 mb-4">
                        <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none drop-shadow-2xl">
                            DAY {day.dayId}
                        </h1>
                        <div className="flex items-center gap-2 text-xl md:text-3xl font-black italic text-cyan-400 uppercase tracking-tighter pb-1 md:pb-2">
                            <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                            {day.label}
                        </div>
                    </div>
                    <div className="h-2 w-full max-w-sm bg-gradient-to-r from-[#009246] via-white to-[#ce2b37] rounded-full" />
                </div>

                {/* NO STUDIO EVENTS */}
                {day.noStudio && day.noStudio.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-4">
                            <span>No Studio Productions</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {day.noStudio.map((event: string, index: number) => (
                                <div key={index} className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold italic text-white/60 hover:bg-white/10 transition-colors">
                                    {event}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* MAIN EVENTS */}
                <section className="space-y-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 flex items-center gap-4">
                        <span>Main Event Timeline</span>
                        <div className="h-px flex-1 bg-cyan-400/20" />
                    </h2>
                    
                    {day.mainEvents && day.mainEvents.length > 0 ? (
                        <div className="space-y-8">
                            {day.mainEvents.map((event: any, index: number) => (
                                <EventRow key={index} {...event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                            <p className="text-xl font-black italic uppercase text-white/20">No main events scheduled</p>
                        </div>
                    )}
                </section>

                {/* FOOTER NAVIGATION */}
                <nav className="mt-24 flex items-center justify-between border-t border-white/10 pt-10 px-4">
                    {day.dayId > 1 ? (
                        <Link href={`/day/${day.dayId - 1}`} className="flex flex-col group">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-pink-500 transition-colors">Previous Day</span>
                            <div className="flex items-center gap-2 text-2xl font-black italic uppercase text-white group-hover:text-cyan-400 transition-colors">
                                <ChevronLeft className="w-6 h-6" /> Day {day.dayId - 1}
                            </div>
                        </Link>
                    ) : <div />}

                    {day.dayId < 21 ? (
                        <Link href={`/day/${day.dayId + 1}`} className="flex flex-col items-end group">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-pink-500 transition-colors text-right">Next Day</span>
                            <div className="flex items-center gap-2 text-2xl font-black italic uppercase text-white group-hover:text-cyan-400 transition-colors">
                                Day {day.dayId + 1} <ChevronRight className="w-6 h-6" />
                            </div>
                        </Link>
                    ) : <div />}
                </nav>
            </div>
        </main>
    );
}