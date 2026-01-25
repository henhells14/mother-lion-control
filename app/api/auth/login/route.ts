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

        const config = await Config.findOne({ key: 'viewerPassword' });
        const correctPassword = config?.value || 'milano2026';

        if (password === correctPassword) {
            // Set session cookie
            const cookieStore = await cookies();
            cookieStore.set('milano_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
