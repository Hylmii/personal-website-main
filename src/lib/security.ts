import { NextRequest } from 'next/server';
import { writeSecurityLog } from './security-logger';
import { SECURITY_CONFIG as CONFIG } from './security-config';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const violationMap = new Map<string, { count: number; lastViolation: number }>();

// Rate limiting function
export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const windowStart = now - CONFIG.RATE_LIMIT.windowMs;
  
  // Check if IP is temporarily blocked due to violations
  const violations = violationMap.get(clientIP);
  if (violations && violations.count >= 5 && now - violations.lastViolation < 60 * 60 * 1000) { // 1 hour block
    return { allowed: false, remaining: 0 };
  }
  
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
  
  // Check for blocked user agents (more comprehensive)
  const isBlocked = CONFIG.BLOCKED_USER_AGENTS.some((blocked: string) => 
    userAgent.includes(blocked.toLowerCase())
  );
  
  if (isBlocked) {
    return false;
  }
  
  // Additional suspicious patterns
  const suspiciousPatterns = [
    /^[a-zA-Z0-9-_]+\/[0-9.]+$/,  // Simple tool pattern like "tool/1.0"
    /^\w+$/,                       // Single word user agents
    /test|api|client|tool|bot/i,   // Generic suspicious terms
    /^(curl|wget|postman|insomnia)/i,  // Common tools
  ];
  
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
    pattern.test(userAgent)
  );
  
  if (hasSuspiciousPattern) {
    return false;
  }
  
  return true;
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
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const connection = request.headers.get('connection') || '';
  
  // Browser typically sends these headers together
  const hasBrowserHeaders = 
    accept.includes('text/html') || 
    accept.includes('application/json') ||
    userAgent.includes('Mozilla') ||
    userAgent.includes('Chrome') ||
    userAgent.includes('Safari') ||
    userAgent.includes('Firefox') ||
    userAgent.includes('Edge');
    
  // Additional browser indicators
  const hasBrowserIndicators = 
    acceptLanguage.length > 0 ||  // Browsers send language preferences
    acceptEncoding.includes('gzip') ||  // Browsers support compression
    connection.toLowerCase() === 'keep-alive';  // Browser connection management
    
  // Browser user agent should be complex (not simple tool patterns)
  const hasComplexUserAgent = userAgent.length > 50 && userAgent.includes('(');
  
  // Strict browser check - all conditions must be met
  return hasBrowserHeaders && hasBrowserIndicators && hasComplexUserAgent;
}

// CSRF token validation (simple implementation)
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token');
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');
  
  // Check if request comes from same origin
  if (referer) {
    return CONFIG.ALLOWED_ORIGINS.some((allowedOrigin: string) => 
      referer.startsWith(allowedOrigin)
    );
  }
  
  if (origin) {
    return CONFIG.ALLOWED_ORIGINS.includes(origin);
  }
  
  // No referer or origin - suspicious for API calls
  return false;
}

// Check if IP is temporarily blocked
export function isIPBlocked(request: NextRequest): boolean {
  const clientIP = getClientIP(request);
  const violations = violationMap.get(clientIP);
  
  if (!violations) return false;
  
  // Check if block has expired (1 hour)
  const blockDuration = 60 * 60 * 1000; // 1 hour
  if (Date.now() - violations.lastViolation > blockDuration) {
    violationMap.delete(clientIP);
    return false;
  }
  
  // Block if 5 or more violations
  return violations.count >= 5;
}

// Comprehensive security check
export function validateRequest(request: NextRequest): {
  valid: boolean;
  reason?: string;
  rateLimitInfo?: { allowed: boolean; remaining: number };
} {
  // Check for blocked IPs first
  if (isIPBlocked(request)) {
    return {
      valid: false,
      reason: 'IP temporarily blocked due to repeated violations'
    };
  }

  // Rate limiting check
  const rateLimitInfo = checkRateLimit(request);
  if (!rateLimitInfo.allowed) {
    return {
      valid: false,
      reason: 'Rate limit exceeded',
      rateLimitInfo
    };
  }
  
  // Advanced API tool detection
  if (!passesAdvancedAPIToolDetection(request)) {
    return {
      valid: false,
      reason: 'Detected API testing tool - advanced pattern analysis',
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

// Advanced detection for API testing tools
export function passesAdvancedAPIToolDetection(request: NextRequest): boolean {
  const headers = request.headers;
  const userAgent = headers.get('user-agent')?.toLowerCase() || '';
  const accept = headers.get('accept') || '';
  const acceptLanguage = headers.get('accept-language') || '';
  const acceptEncoding = headers.get('accept-encoding') || '';
  const origin = headers.get('origin') || '';
  const referer = headers.get('referer') || '';
  const secFetchSite = headers.get('sec-fetch-site') || '';
  const secFetchMode = headers.get('sec-fetch-mode') || '';
  const secFetchDest = headers.get('sec-fetch-dest') || '';
  
  // Check for API tool indicators
  const apiToolIndicators = [
    // Missing or suspicious browser headers
    !acceptLanguage.match(/^[a-z]{2}(-[A-Z]{2})?(,[a-z]{2}(-[A-Z]{2})?)*$/),
    !acceptEncoding.includes('gzip'),
    !accept.includes('text/html'),
    
    // Suspicious user agents
    userAgent.includes('postman'),
    userAgent.includes('insomnia'),
    userAgent.includes('thunder'),
    userAgent.includes('paw'),
    userAgent.includes('httpie'),
    userAgent.includes('curl'),
    userAgent.includes('wget'),
    userAgent.includes('axios'),
    userAgent.includes('node-fetch'),
    userAgent.includes('python-requests'),
    userAgent.includes('okhttp'),
    userAgent.match(/rest[_\-\s]?client/i),
    userAgent.match(/api[_\-\s]?test/i),
    userAgent.match(/http[_\-\s]?client/i),
    userAgent.length < 20 && !userAgent.includes('bot'),
    
    // Missing security headers (modern browsers always send these)
    !secFetchSite,
    !secFetchMode,
    !secFetchDest,
    
    // Suspicious combinations
    origin === '' && referer === '' && !userAgent.includes('bot'),
    accept === '*/*' && !acceptLanguage,
    userAgent.includes('electron') && !origin,
    
    // Check for automation frameworks
    userAgent.includes('selenium'),
    userAgent.includes('puppeteer'),
    userAgent.includes('playwright'),
    userAgent.includes('cypress'),
    userAgent.includes('webdriver'),
    
    // Check for development tools
    userAgent.includes('newman'),
    userAgent.includes('insomnia'),
    userAgent.includes('postman'),
    headers.get('postman-token'),
    headers.get('x-postman-'),
    headers.get('user-agent')?.includes('Postman'),
    
    // Generic API client patterns
    /^[a-z\-]+\/[\d\.]+$/.test(userAgent),
    userAgent.match(/^[a-zA-Z\-]+$/) && userAgent.length < 15,
  ];
  
  // Count indicators
  const indicatorCount = apiToolIndicators.filter(Boolean).length;
  
  // Additional suspicious patterns
  const suspiciousPatterns = [
    // No browser-like characteristics
    !userAgent.includes('Mozilla') && !userAgent.includes('Safari') && !userAgent.includes('Chrome'),
    
    // Missing typical browser headers
    !headers.has('sec-ch-ua'),
    !headers.has('sec-ch-ua-mobile'),
    !headers.has('sec-ch-ua-platform'),
    
    // Unusual accept headers for web requests
    accept === 'application/json' && !origin && !referer,
    accept === '*/*' && userAgent.length < 30,
    
    // Missing connection header
    !headers.has('connection') && !headers.has('keep-alive'),
  ];
  
  const suspiciousCount = suspiciousPatterns.filter(Boolean).length;
  
  // Fail if too many indicators (threshold: 3 or more)
  return indicatorCount < 3 && suspiciousCount < 2;
}// Log security events
export function logSecurityEvent(
  request: NextRequest, 
  event: string, 
  details?: any
): void {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Track violations for IP blocking
  if (event === 'MIDDLEWARE_BLOCKED') {
    const violations = violationMap.get(clientIP) || { count: 0, lastViolation: 0 };
    violations.count++;
    violations.lastViolation = Date.now();
    violationMap.set(clientIP, violations);
  }
  
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
