import DayCard from '@/components/DayCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getScheduleData() {
    try {
        const mongoose = await import('mongoose');
        const ProductionDay = (await import('@/models/ProductionDay')).default;

        // Connect to MongoDB
        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const days = await ProductionDay.find({}).sort({ dayId: 1 }).lean();
        return days;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return [];
    }
}

export default async function DashboardPage() {
    const days = await getScheduleData();

    // Determine current day (for demo purposes, you can adjust this logic)
    const today = new Date();
    const currentDayId = 0; // You can calculate this based on actual dates

    if (days.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">No Schedule Data</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Please seed the database first by visiting{' '}
                        <Link href="/api/seed" className="text-[hsl(var(--milano-blue))] underline">
                            /api/seed
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--card))]">
            {/* Header */}
            <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="relative flex items-center justify-between">
                        {/* Left: Back Button */}
                        <div className="flex items-center min-w-[80px]">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Back</span>
                            </Link>
                        </div>

                        {/* Center: Title */}
                        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black uppercase tracking-widest text-center whitespace-nowrap bg-gradient-to-r from-[hsl(var(--milano-blue))] to-[hsl(var(--oslo-orange))] bg-clip-text text-transparent">
                            Production Schedule
                        </h1>

                        {/* Right: Day Count */}
                        <div className="flex items-center justify-end min-w-[80px] text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                            {days.length} Days
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {days.map((day: any) => {
                        const dayId = day.dayId;
                        const isCurrent = dayId === currentDayId;
                        const isPast = dayId < currentDayId;
                        const eventCount = (day.mainEvents?.length || 0) + (day.noStudio?.length || 0);

                        return (
                            <DayCard
                                key={day._id.toString()}
                                dayId={dayId}
                                date={day.date}
                                label={day.label}
                                eventCount={eventCount}
                                isCurrent={isCurrent}
                                isPast={isPast}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
