// Security monitoring and alerting system
import { NextRequest } from 'next/server';

interface SecurityAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  details: Record<string, any>;
}

// In-memory storage for security events (in production, use database/Redis)
const securityEvents = new Map<string, SecurityAlert[]>();
const suspiciousIPs = new Set<string>();

export function logSecurityEvent(alert: SecurityAlert) {
  const key = alert.ip;
  const events = securityEvents.get(key) || [];
  events.push(alert);
  
  // Keep only last 100 events per IP
  if (events.length > 100) {
    events.shift();
  }
  
  securityEvents.set(key, events);
  
  // Mark IP as suspicious if too many alerts
  if (events.length >= 5) {
    suspiciousIPs.add(alert.ip);
  }
  
  // Log to console for immediate visibility
  console.warn(`[SECURITY ALERT - ${alert.level}] ${alert.type}`, {
    ip: alert.ip,
    userAgent: alert.userAgent,
    details: alert.details,
    timestamp: alert.timestamp
  });
}

export function isSuspiciousIP(ip: string): boolean {
  return suspiciousIPs.has(ip);
}

export function getSecurityEvents(ip?: string): SecurityAlert[] {
  if (ip) {
    return securityEvents.get(ip) || [];
  }
  
  // Return all events from last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const allEvents: SecurityAlert[] = [];
  
  for (const events of securityEvents.values()) {
    allEvents.push(...events.filter(event => event.timestamp > oneDayAgo));
  }
  
  return allEvents.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function analyzeSecurityThreat(request: NextRequest): {
  threatLevel: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  reasons: string[];
} {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const reasons: string[] = [];
  
  // Check if IP is already flagged
  if (isSuspiciousIP(ip)) {
    reasons.push('IP previously flagged for suspicious activity');
  }
  
  // Analyze User Agent
  const suspiciousUAPatterns = [
    /postman/i, /insomnia/i, /curl/i, /wget/i, /python/i, /bot/i,
    /scanner/i, /crawler/i, /spider/i, /scraper/i, /exploit/i
  ];
  
  if (suspiciousUAPatterns.some(pattern => pattern.test(userAgent))) {
    reasons.push('Suspicious user agent detected');
  }
  
  // Check for missing common browser headers
  const commonHeaders = ['accept', 'accept-language', 'accept-encoding'];
  const missingHeaders = commonHeaders.filter(header => !request.headers.get(header));
  
  if (missingHeaders.length >= 2) {
    reasons.push('Missing common browser headers');
  }
  
  // Determine threat level
  let threatLevel: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' = 'SAFE';
  
  if (reasons.length >= 3) {
    threatLevel = 'DANGEROUS';
  } else if (reasons.length >= 1) {
    threatLevel = 'SUSPICIOUS';
  }
  
  return { threatLevel, reasons };
}

export function createSecurityAlert(
  level: SecurityAlert['level'],
  type: string,
  request: NextRequest,
  details: Record<string, any> = {}
): SecurityAlert {
  return {
    level,
    type,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: new Date().toISOString(),
    details: {
      ...details,
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url
    }
  };
}
