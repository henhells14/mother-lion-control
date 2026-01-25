import { NextResponse } from 'next/server';
import ProductionDay from '@/models/ProductionDay';
import mongoose from 'mongoose';

export async function GET() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const stats = await ProductionDay.aggregate([
            {
                $project: {
                    mainEventsCount: { $size: "$mainEvents" },
                    noStudioCount: { $size: { $ifNull: ["$noStudio", []] } }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMainEvents: { $sum: "$mainEventsCount" },
                    totalNoStudio: { $sum: "$noStudioCount" }
                }
            }
        ]);

        const totalEvents = stats.length > 0
            ? stats[0].totalMainEvents + stats[0].totalNoStudio
            : 0;

        return NextResponse.json({ totalEvents });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
