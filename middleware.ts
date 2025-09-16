import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateRequest, logSecurityEvent, passesAdvancedAPIToolDetection, getClientIP } from './src/lib/security';

// Middleware function
export function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  
  // For API routes, apply strict security
  if (isApiRoute) {
    // Skip security for database test endpoint (for admin use)
    if (request.nextUrl.pathname === '/api/database/test') {
      return NextResponse.next();
    }
    
    // STRICT BLOCKING for API routes - block all API tools
    if (!passesAdvancedAPIToolDetection(request)) {
      logSecurityEvent(request, 'MIDDLEWARE_BLOCKED', {
        reason: 'API testing tool detected - blocked from API access',
        endpoint: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: getClientIP(request),
        method: request.method
      });
      
      // Return JSON error for blocked API requests
      return new Response(JSON.stringify({ 
        error: 'Access Denied',
        message: 'Automated tools are not permitted to access this API',
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

    // Apply full security validation for API routes
    const securityCheck = validateRequest(request);
    
    if (!securityCheck.valid) {
      logSecurityEvent(request, 'MIDDLEWARE_BLOCKED', {
        reason: securityCheck.reason,
        endpoint: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: getClientIP(request)
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
  
  // For non-API routes (HTML pages), only block obvious API tools
  else {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    
    // Only block very obvious API tools from HTML pages
    const obviousApiTools = [
      'postman',
      'newman', 
      'insomnia',
      'curl',
      'wget',
      'httpie',
      'python-requests'
    ];
    
    const isObviousApiTool = obviousApiTools.some(tool => userAgent.includes(tool)) ||
                           request.headers.get('postman-token') ||
                           request.headers.get('x-postman-');
    
    if (isObviousApiTool) {
      logSecurityEvent(request, 'MIDDLEWARE_BLOCKED', {
        reason: 'Known API tool blocked from HTML access',
        endpoint: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: getClientIP(request)
      });
      
      return new Response(JSON.stringify({ 
        error: 'Access Denied',
        message: 'API tools are not permitted to access this website',
        code: 'API_TOOL_BLOCKED'
      }), { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to API routes with strict security
    '/api/:path*',
    // Apply lighter security to all other routes (simplified pattern)
    '/((?!_next|favicon.ico|static).*)'
  ],
  runtime: 'edge'
};
