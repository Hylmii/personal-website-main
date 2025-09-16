'use client';

import { useEffect } from 'react';

export default function BrowserSecurity() {
  useEffect(() => {
    // Advanced DevTools detection
    let devtools = { open: false, orientation: null };
    
    const detectDevTools = () => {
      const threshold = 160;
      
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect or reload when DevTools detected
          window.location.href = 'about:blank';
        }
      } else {
        devtools.open = false;
      }
    };

    // Check every 100ms for better detection
    const devToolsInterval = setInterval(detectDevTools, 100);

    // Console protection - override console methods
    const originalConsole = { ...console };
    
    const protectedConsole = {
      log: (...args: any[]) => {
        if (args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('csrf') || arg.includes('token') || arg.includes('security') || 
           arg.includes('key') || arg.includes('password') || arg.includes('api'))
        )) {
          return; // Block sensitive logs
        }
        originalConsole.log(...args);
      },
      error: (...args: any[]) => {
        if (args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('csrf') || arg.includes('token') || arg.includes('security') ||
           arg.includes('error') || arg.includes('failed'))
        )) {
          return; // Block error logs that might reveal info
        }
        originalConsole.error(...args);
      },
      warn: (...args: any[]) => {
        if (args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('csrf') || arg.includes('token') || arg.includes('security'))
        )) {
          return; // Block warning logs
        }
        originalConsole.warn(...args);
      },
      info: (...args: any[]) => {
        if (args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('csrf') || arg.includes('token') || arg.includes('security'))
        )) {
          return; // Block info logs
        }
        originalConsole.info(...args);
      }
    };

    // Replace console methods
    Object.assign(console, protectedConsole);

    // Keyboard shortcuts protection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+C (Element inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+U (View source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+Shift+K (Console on Firefox)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+Shift+E (Network tab)
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+S (Save page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
    };

    // Right-click protection
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Text selection protection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Drag protection
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);

    // Disable text selection via CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as any).msUserSelect = 'none';

    // Cleanup function
    return () => {
      clearInterval(devToolsInterval);
      
      // Restore original console (optional)
      Object.assign(console, originalConsole);
      
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
