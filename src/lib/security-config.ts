// Security configuration that can be easily updated
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    maxRequests: 5, // Reduced back to 5 for stricter control
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Allowed origins - add your domain here
  ALLOWED_ORIGINS: [
    'https://hylmirafif.me',
    'https://www.hylmirafif.me',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add development URLs if needed
    'https://pwbs-hylmii.vercel.app',
  ],
  
  // Required headers for legitimate requests
  REQUIRED_HEADERS: {
    'user-agent': true,
    'accept': true,
    'content-type': true, // For POST requests
  },
  
  // Blocked user agents (tools commonly used for API testing)
  BLOCKED_USER_AGENTS: [
    'postman',
    'insomnia',
    'httpie',
    'curl',
    'wget',
    'python-requests',
    'go-http-client',
    'axios/',  // Standalone axios (not browser)
    'node-fetch',
    'fetch/',
    'ruby',
    'perl',
    'java',
    'okhttp',
    'apache-httpclient',
    'newman',  // Postman CLI
    'postmanruntime',
    'thunderclient',
    'restclient',
    'httpclient',
    'node.js',
    'node/',
    'python/',
    'php/',
    'go/',
    'rust/',
    'dart/',
    'swift/',
    'kotlin/',
    'c#',
    'c++',
    'powershell',
    'batch',
    'shell',
    'bash',
    'zsh',
    'fish',
    'restsharp',
    'unirest',
    'request',
    'http',
    'https',
    'fetch',
    'api',
    'client',
    'tool',
    'test',
    'bot',
    'crawler',
    'spider',
    'scraper',
  ],
  
  // Browser indicators - requests should have at least one
  BROWSER_INDICATORS: [
    'mozilla',
    'chrome',
    'safari',
    'firefox',
    'edge',
    'opera',
  ],
  
  // Security features
  FEATURES: {
    BLOCK_BOTS: true,
    REQUIRE_REFERER: true,
    STRICT_ORIGIN_CHECK: true,
    LOG_ALL_REQUESTS: true,
    BLOCK_SUSPICIOUS_PATTERNS: true,
  },
  
  // Suspicious patterns in requests
  SUSPICIOUS_PATTERNS: {
    USER_AGENTS: [
      'bot',
      'spider',
      'crawler',
      'scraper',
      'test',
      'monitor',
    ],
    HEADERS: [
      'x-api-key',
      'x-auth-token',
      'authorization', // Except for admin endpoints
    ]
  }
};

// Export individual configs for easy import
export const { 
  RATE_LIMIT, 
  ALLOWED_ORIGINS, 
  REQUIRED_HEADERS, 
  BLOCKED_USER_AGENTS,
  BROWSER_INDICATORS,
  FEATURES,
  SUSPICIOUS_PATTERNS
} = SECURITY_CONFIG;
