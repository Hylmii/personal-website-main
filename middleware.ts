import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateRequest, logSecurityEvent, passesAdvancedAPIToolDetection, getClientIP } from '@/lib/security';

// Middleware function
export function middleware(request: NextRequest) {
  // BLOCK POSTMAN AND API TOOLS FROM ALL ROUTES (including HTML pages)
  if (!passesAdvancedAPIToolDetection(request)) {
    logSecurityEvent(request, 'MIDDLEWARE_BLOCKED', {
      reason: 'API testing tool detected - blocked from accessing any content',
      endpoint: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      ip: getClientIP(request),
      method: request.method
    });
    
    // Return JSON error for ALL blocked requests (no HTML access)
    return new Response(JSON.stringify({ 
      error: 'Access Denied',
      message: 'Automated tools are not permitted to access this website',
      code: 'API_TOOL_BLOCKED',
      timestamp: new Date().toISOString(),
      blocked_reason: 'API testing tool detection'
    }), { 
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'X-Security-Policy': 'strict-no-tools',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  }

  // Apply additional security to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    // Skip security for database test endpoint (for admin use)
    if (request.nextUrl.pathname === '/api/database/test') {
      return NextResponse.next();
    }
    
    // Perform security validation
    const securityCheck = validateRequest(request);
    
    if (!securityCheck.valid) {
      logSecurityEvent(request, 'MIDDLEWARE_BLOCKED', {
        reason: securityCheck.reason,
        endpoint: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      });
      
      // Return a minimal error response (not HTML)
      return new Response(JSON.stringify({ 
        error: 'Access Denied',
        message: 'This request has been blocked by our security system',
        code: 'SECURITY_BLOCK',
        timestamp: new Date().toISOString()
      }), { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': securityCheck.rateLimitInfo?.remaining.toString() || '0',
          'X-Security-Policy': 'strict',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        }
      });
    }
    
    // Log successful request
    logSecurityEvent(request, 'MIDDLEWARE_ALLOWED', {
      endpoint: request.nextUrl.pathname,
      remaining: securityCheck.rateLimitInfo?.remaining
    });
    
    // Add security headers to response
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-RateLimit-Remaining', securityCheck.rateLimitInfo?.remaining.toString() || '0');
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on - APPLY TO ALL ROUTES
export const config = {
  matcher: [
    // Apply to ALL routes to block API tools from accessing ANY content
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
};
