import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ViWorkS Admin Panel Frontend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    message: 'Frontend is running successfully!'
  });
}
