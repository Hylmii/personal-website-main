import { NextRequest, NextResponse } from 'next/server';
import { analyzeSecurityLogs, getSecurityLogs } from '@/lib/security-logger';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/security/logs - Get security logs (admin only)
export async function GET(request: NextRequest) {
  try {
    // Simple admin authentication
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Basic ${Buffer.from('hylmi:admin2024').toString('base64')}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'logs';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    if (action === 'analyze') {
      const analysis = analyzeSecurityLogs();
      return NextResponse.json({
        success: true,
        data: analysis
      });
    } else {
      const logs = getSecurityLogs(limit);
      return NextResponse.json({
        success: true,
        data: logs
      });
    }
    
  } catch (error) {
    console.error('Error fetching security logs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch security logs' 
    }, { status: 500 });
  }
}
