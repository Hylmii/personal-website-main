import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateRequest, logSecurityEvent } from '@/lib/security';

// Middleware function
export function middleware(request: NextRequest) {
  // Only apply security to API routes
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
        endpoint: request.nextUrl.pathname
      });
      
      return NextResponse.json({ 
        message: 'Access denied',
        error: 'Request blocked by security policy'
      }, { 
        status: 403,
        headers: {
          'X-RateLimit-Remaining': securityCheck.rateLimitInfo?.remaining.toString() || '0',
          'X-Security-Policy': 'strict'
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

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*'
  ]
};
