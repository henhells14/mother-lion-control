import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const mongoose = await import('mongoose');
        const Config = (await import('@/models/Config')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const configViewer = await Config.findOne({ key: 'viewerPassword' });
        const configAdmin = await Config.findOne({ key: 'adminPassword' });

        return NextResponse.json({
            viewerPassword: configViewer?.value || 'milano2026',
            adminPassword: configAdmin?.value || 'admin123'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { viewerPassword, adminPassword } = await request.json();

        const mongoose = await import('mongoose');
        const Config = (await import('@/models/Config')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        // Update Viewer Password
        if (viewerPassword && viewerPassword.length >= 4) {
            await Config.findOneAndUpdate(
                { key: 'viewerPassword' },
                { value: viewerPassword },
                { upsert: true, new: true }
            );
        }

        // Update Admin Password
        if (adminPassword && adminPassword.length >= 4) {
            await Config.findOneAndUpdate(
                { key: 'adminPassword' },
                { value: adminPassword },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
