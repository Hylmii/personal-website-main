import { NextRequest, NextResponse } from 'next/server';

// Simple debug endpoint to check environment variables
export async function GET(request: NextRequest) {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    emailUser: process.env.EMAIL_USER ? 'SET' : 'MISSING',
    emailPass: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
    timestamp: new Date().toISOString()
  });
}
