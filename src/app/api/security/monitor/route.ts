import { NextRequest, NextResponse } from 'next/server';
import { getSecurityEvents } from '../../../../lib/security-monitor';
import { passesAdvancedAPIToolDetection } from '../../../../lib/security';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Only allow browser access
    if (!passesAdvancedAPIToolDetection(request)) {
      return new Response(
        '<!DOCTYPE html><html><head><title>Access Denied</title></head><body><h1>403 Forbidden</h1></body></html>',
        { 
          status: 403,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Simple auth check (in production, use proper authentication)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-security-key') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const ip = url.searchParams.get('ip');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const events = getSecurityEvents(ip || undefined).slice(0, limit);

    return NextResponse.json({
      success: true,
      totalEvents: events.length,
      events: events.map(event => ({
        ...event,
        // Remove sensitive header info for security
        details: {
          ...event.details,
          headers: event.details.headers ? 
            Object.keys(event.details.headers).reduce((acc, key) => {
              if (['user-agent', 'referer', 'accept'].includes(key.toLowerCase())) {
                acc[key] = event.details.headers[key];
              }
              return acc;
            }, {} as Record<string, string>) : {}
        }
      }))
    });

  } catch (error: any) {
    console.error('Security monitoring API error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
