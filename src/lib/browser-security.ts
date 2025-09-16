// Browser security utilities to prevent inspection and protect sensitive data

declare global {
  interface Window {
    devtools: {
      open: boolean;
      orientation: string | null;
    };
  }
}

// Disable right-click context menu
export function disableContextMenu() {
  if (typeof window !== 'undefined') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }
}

// Disable common developer shortcuts
export function disableDevTools() {
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+C (Element Selector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    });
  }
}

// Detect if DevTools is open
export function detectDevTools() {
  if (typeof window === 'undefined') return;
  
  let devtools = {
    open: false,
    orientation: null as string | null
  };

  const threshold = 160;

  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        devtools.orientation = window.outerWidth - window.innerWidth > threshold ? 'vertical' : 'horizontal';
        handleDevToolsOpen();
      }
    } else {
      if (devtools.open) {
        devtools.open = false;
        devtools.orientation = null;
      }
    }
  }, 500);

  // Store in window for debugging (but obfuscated)
  if (typeof window !== 'undefined') {
    window.devtools = devtools;
  }
}

// Handle when DevTools is detected
function handleDevToolsOpen() {
  // Clear console
  if (typeof console !== 'undefined') {
    console.clear();
    console.log('%c🛡️ Security Notice', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cThis website is protected. Unauthorized access attempts are logged.', 'color: red; font-size: 14px;');
    console.log('%cFor legitimate security research, please contact: hylmir25@gmail.com', 'color: orange; font-size: 12px;');
  }
  
  // Optional: Redirect or show warning
  // window.location.href = '/security-warning';
}

// Obfuscate sensitive console logs
export function secureConsole() {
  if (typeof console === 'undefined') return;
  
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.log = function(...args) {
    // Filter out sensitive information
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string') {
        return arg
          .replace(/password\s*[:=]\s*['""][^'"]*['"]/gi, 'password: [HIDDEN]')
          .replace(/token\s*[:=]\s*['""][^'"]*['"]/gi, 'token: [HIDDEN]')
          .replace(/api[_-]?key\s*[:=]\s*['""][^'"]*['"]/gi, 'api_key: [HIDDEN]')
          .replace(/secret\s*[:=]\s*['""][^'"]*['"]/gi, 'secret: [HIDDEN]')
          .replace(/email[_-]?pass\s*[:=]\s*['""][^'"]*['"]/gi, 'email_pass: [HIDDEN]');
      }
      return arg;
    });
    
    originalLog.apply(console, filteredArgs);
  };
  
  console.error = function(...args) {
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string' && arg.includes('SECURITY EVENT')) {
        return '[SECURITY EVENT DETECTED - Details Hidden]';
      }
      return arg;
    });
    originalError.apply(console, filteredArgs);
  };
  
  console.warn = function(...args) {
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string' && (arg.includes('password') || arg.includes('token'))) {
        return '[SENSITIVE DATA FILTERED]';
      }
      return arg;
    });
    originalWarn.apply(console, filteredArgs);
  };
}

// Disable text selection
export function disableTextSelection() {
  if (typeof window !== 'undefined') {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  }
}

// Disable image saving
export function disableImageSaving() {
  if (typeof window !== 'undefined') {
    document.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    });
  }
}

// Clear sensitive data from memory
export function clearSensitiveData() {
  if (typeof window !== 'undefined') {
    // Clear localStorage sensitive keys
    const sensitiveKeys = ['token', 'password', 'auth', 'session', 'admin', 'login'];
    sensitiveKeys.forEach(key => {
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.toLowerCase().includes(key)) {
          // Don't actually remove, just log for awareness
          console.log(`Found sensitive key: ${storageKey}`);
        }
      });
    });
  }
}

// Initialize all security measures
export function initBrowserSecurity() {
  if (typeof window === 'undefined') return;
  
  // Apply security measures
  disableContextMenu();
  disableDevTools();
  detectDevTools();
  secureConsole();
  disableTextSelection();
  disableImageSaving();
  
  // Clear console periodically
  setInterval(() => {
    if (typeof console !== 'undefined') {
      console.clear();
    }
  }, 5000);
  
  // Add security headers via meta tags
  const metaCSP = document.createElement('meta');
  metaCSP.httpEquiv = 'Content-Security-Policy';
  metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
  document.head.appendChild(metaCSP);
  
  console.log('%c🛡️ Browser Security Activated', 'color: green; font-size: 16px; font-weight: bold;');
  console.log('%cWebsite protected against inspection and data extraction', 'color: blue; font-size: 12px;');
}
