import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductionDay from '@/models/ProductionDay';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const mongoose = await import('mongoose');
        const ProductionDay = (await import('@/models/ProductionDay')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const day = await ProductionDay.findOne({ dayId: parseInt(id) });
        if (!day) {
            return NextResponse.json({ error: 'Day not found' }, { status: 404 });
        }
        return NextResponse.json(day);
    } catch (error) {
        console.error('Fetch day error:', error);
        return NextResponse.json({ error: 'Failed to fetch day' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const mongoose = await import('mongoose');
        const ProductionDay = (await import('@/models/ProductionDay')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const body = await request.json();

        // Remove system fields that shouldn't be updated manually
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.__v;

        const day = await ProductionDay.findOneAndUpdate(
            { dayId: parseInt(id) },
            { $set: body },
            { new: true, runValidators: true }
        );
        if (!day) {
            return NextResponse.json({ error: 'Day not found' }, { status: 404 });
        }
        return NextResponse.json(day);
    } catch (error) {
        console.error('Update day error:', error);
        return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
    }
}
