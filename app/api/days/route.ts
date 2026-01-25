import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductionDay from '@/models/ProductionDay';

export async function GET() {
    try {
        const mongoose = await import('mongoose');
        const ProductionDay = (await import('@/models/ProductionDay')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const days = await ProductionDay.find({}).sort({ dayId: 1 });
        return NextResponse.json(days);
    } catch (error) {
        console.error('Fetch all days error:', error);
        return NextResponse.json({ error: 'Failed to fetch production days' }, { status: 500 });
    }
}
