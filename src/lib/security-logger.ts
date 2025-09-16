interface SecurityLog {
  timestamp: string;
  event: string;
  clientIP: string;
  userAgent: string;
  method: string;
  url: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// In-memory storage for security logs (replace with database in production)
let securityLogs: SecurityLog[] = [];
const MAX_LOGS = 1000; // Keep last 1000 logs in memory

// Write security log to memory
export function writeSecurityLog(log: SecurityLog) {
  try {
    securityLogs.push(log);
    
    // Keep only the last MAX_LOGS entries
    if (securityLogs.length > MAX_LOGS) {
      securityLogs = securityLogs.slice(-MAX_LOGS);
    }
  } catch (error) {
    console.error('Failed to write security log:', error);
  }
}

// Get security logs from memory
export function getSecurityLogs(limit: number = 100): SecurityLog[] {
  try {
    return securityLogs
      .slice(-limit)
      .reverse(); // Most recent first
  } catch (error) {
    console.error('Failed to read security logs:', error);
    return [];
  }
}

// Analyze security patterns
export function analyzeSecurityLogs(): {
  totalRequests: number;
  blockedRequests: number;
  topBlockedIPs: Array<{ ip: string; count: number }>;
  topBlockedUserAgents: Array<{ userAgent: string; count: number }>;
  recentThreats: SecurityLog[];
} {
  const logs = getSecurityLogs(1000);
  
  const blockedLogs = logs.filter(log => log.event.includes('BLOCKED'));
  const ipCounts = new Map<string, number>();
  const userAgentCounts = new Map<string, number>();
  
  blockedLogs.forEach(log => {
    ipCounts.set(log.clientIP, (ipCounts.get(log.clientIP) || 0) + 1);
    userAgentCounts.set(log.userAgent, (userAgentCounts.get(log.userAgent) || 0) + 1);
  });
  
  const topBlockedIPs = Array.from(ipCounts.entries())
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
    
  const topBlockedUserAgents = Array.from(userAgentCounts.entries())
    .map(([userAgent, count]) => ({ userAgent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
    
  const recentThreats = logs
    .filter(log => log.severity === 'high' || log.severity === 'critical')
    .slice(0, 20);
  
  return {
    totalRequests: logs.length,
    blockedRequests: blockedLogs.length,
    topBlockedIPs,
    topBlockedUserAgents,
    recentThreats
  };
}
