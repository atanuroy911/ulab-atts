import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    mongodbUriConfigured: !!process.env.MONGODB_URI,
    mongodbConnection: 'unknown' as 'connected' | 'failed' | 'unknown',
    mongodbPing: false,
    error: null as string | null,
    errorCode: null as string | null,
  };

  // Don't expose the actual URI, just check if it exists
  if (!diagnostics.mongodbUriConfigured) {
    diagnostics.mongodbConnection = 'failed';
    diagnostics.error = 'MONGODB_URI environment variable is not set';
    return NextResponse.json(diagnostics, { status: 500 });
  }

  try {
    // Try to connect with 8 second timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 8 seconds')), 8000)
    );

    const client = await Promise.race([
      clientPromise,
      timeoutPromise
    ]);

    diagnostics.mongodbConnection = 'connected';

    // Try to ping the database
    const db = client.db('attendance_system');
    await db.command({ ping: 1 });
    diagnostics.mongodbPing = true;

  } catch (error: any) {
    diagnostics.mongodbConnection = 'failed';
    diagnostics.error = error.message;
    diagnostics.errorCode = error.code || error.name;
  }

  const status = diagnostics.mongodbPing ? 200 : 500;
  
  return NextResponse.json(diagnostics, { status });
}
