import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        const mongoose = await import('mongoose');
        const Config = (await import('@/models/Config')).default;

        if (mongoose.default.connection.readyState === 0) {
            await mongoose.default.connect(process.env.MONGODB_URI!);
        }

        const config = await Config.findOne({ key: 'adminPassword' });
        // Default admin password if not set
        const correctPassword = config?.value || 'admin123';

        if (password === correctPassword) {
            // Set session cookie
            const cookieStore = await cookies();
            cookieStore.set('milano_admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
