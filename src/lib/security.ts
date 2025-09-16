import { NextRequest } from 'next/server';
import { writeSecurityLog } from './security-logger';
import { SECURITY_CONFIG as CONFIG } from './security-config';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const windowStart = now - CONFIG.RATE_LIMIT.windowMs;
  
  // Clean old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(clientIP) || { count: 0, resetTime: now + CONFIG.RATE_LIMIT.windowMs };
  
  if (current.resetTime < now) {
    // Reset window
    current.count = 1;
    current.resetTime = now + CONFIG.RATE_LIMIT.windowMs;
  } else {
    current.count++;
  }
  
  rateLimitMap.set(clientIP, current);
  
  return {
    allowed: current.count <= CONFIG.RATE_LIMIT.maxRequests,
    remaining: Math.max(0, CONFIG.RATE_LIMIT.maxRequests - current.count)
  };
}

// Get client IP
export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         request.headers.get('cf-connecting-ip') ||
         'unknown';
}

// Check if origin is allowed
export function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Allow same-origin requests (no origin header)
  if (!origin && !referer) {
    return true;
  }
  
  // Check origin
  if (origin && CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }
  
  // Check referer as fallback
  if (referer) {
    return CONFIG.ALLOWED_ORIGINS.some((allowedOrigin: string) => 
      referer.startsWith(allowedOrigin)
    );
  }
  
  return false;
}

// Check user agent for suspicious tools
export function checkUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Block empty user agents
  if (!userAgent) {
    return false;
  }
  
  // Check for blocked user agents
  return !CONFIG.BLOCKED_USER_AGENTS.some((blocked: string) => 
    userAgent.includes(blocked.toLowerCase())
  );
}

// Validate required headers
export function validateHeaders(request: NextRequest): boolean {
  for (const [header, required] of Object.entries(CONFIG.REQUIRED_HEADERS)) {
    if (required && !request.headers.get(header)) {
      return false;
    }
  }
  return true;
}

// Check if request looks like it's from a browser
export function checkBrowserRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  
  // Browser typically sends these
  const hasBrowserHeaders = 
    accept.includes('text/html') || 
    accept.includes('application/json') ||
    userAgent.includes('Mozilla') ||
    userAgent.includes('Chrome') ||
    userAgent.includes('Safari') ||
    userAgent.includes('Firefox') ||
    userAgent.includes('Edge');
    
  return hasBrowserHeaders;
}

// CSRF token validation (simple implementation)
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token');
  const referer = request.headers.get('referer');
  
  // For now, just check if request comes from same origin
  if (referer) {
    return CONFIG.ALLOWED_ORIGINS.some((origin: string) => 
      referer.startsWith(origin)
    );
  }
  
  return false;
}

// Comprehensive security check
export function validateRequest(request: NextRequest): {
  valid: boolean;
  reason?: string;
  rateLimitInfo?: { allowed: boolean; remaining: number };
} {
  // Rate limiting check
  const rateLimitInfo = checkRateLimit(request);
  if (!rateLimitInfo.allowed) {
    return {
      valid: false,
      reason: 'Rate limit exceeded',
      rateLimitInfo
    };
  }
  
  // Origin check
  if (!checkOrigin(request)) {
    return {
      valid: false,
      reason: 'Invalid origin',
      rateLimitInfo
    };
  }
  
  // User agent check
  if (!checkUserAgent(request)) {
    return {
      valid: false,
      reason: 'Blocked user agent',
      rateLimitInfo
    };
  }
  
  // Headers validation
  if (!validateHeaders(request)) {
    return {
      valid: false,
      reason: 'Missing required headers',
      rateLimitInfo
    };
  }
  
  // Browser request check
  if (!checkBrowserRequest(request)) {
    return {
      valid: false,
      reason: 'Request does not appear to be from a browser',
      rateLimitInfo
    };
  }
  
  // For POST requests, validate CSRF
  if (request.method === 'POST' && !validateCSRFToken(request)) {
    return {
      valid: false,
      reason: 'CSRF validation failed',
      rateLimitInfo
    };
  }
  
  return {
    valid: true,
    rateLimitInfo
  };
}

// Log security events
export function logSecurityEvent(
  request: NextRequest, 
  event: string, 
  details?: any
): void {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Determine severity based on event type
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  if (event.includes('BLOCKED')) {
    if (details?.reason?.includes('user agent') || details?.reason?.includes('Rate limit')) {
      severity = 'high';
    } else if (details?.reason?.includes('origin') || details?.reason?.includes('CSRF')) {
      severity = 'critical';
    } else {
      severity = 'medium';
    }
  }
  
  const logEntry = {
    timestamp,
    event,
    clientIP,
    userAgent,
    method: request.method,
    url: request.url,
    details,
    severity
  };
  
  // Log to console
  console.log('SECURITY EVENT:', logEntry);
  
  // Log to file
  writeSecurityLog(logEntry);
}
