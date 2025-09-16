import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import BrowserSecurity from '@/components/BrowserSecurity';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hylmi Rafif Rabbani - Technology & Cybersecurity Professional",
  description: "Technology and cybersecurity professional with expertise in leadership, innovation, and digital project management. Currently Chairperson at Nextzenith Ventures MiRoom.",
  keywords: ["Hylmi Rafif Rabbani", "cybersecurity", "technology", "project management", "leadership", "web development"],
  authors: [{ name: "Hylmi Rafif Rabbani" }],
  metadataBase: new URL('https://hylmirafif.me'),
  openGraph: {
    title: "Hylmi Rafif Rabbani - Technology & Cybersecurity Professional",
    description: "Technology and cybersecurity professional with expertise in leadership, innovation, and digital project management.",
    url: 'https://hylmirafif.me',
    siteName: 'Hylmi Rafif Rabbani',
    images: [
      {
        url: '/avatarhylmi.jpg',
        width: 800,
        height: 600,
        alt: 'Hylmi Rafif Rabbani - Technology & Cybersecurity Professional',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hylmi Rafif Rabbani - Technology & Cybersecurity Professional",
    description: "Technology and cybersecurity professional with expertise in leadership, innovation, and digital project management.",
    images: ['/avatarhylmi.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/avatarhylmi.jpg" />
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Browser Security Initialization
              (function() {
                // Import browser security functions
                const script = document.createElement('script');
                script.src = '/_next/static/chunks/browser-security.js';
                script.onload = function() {
                  if (typeof window.initializeBrowserSecurity === 'function') {
                    window.initializeBrowserSecurity();
                  }
                };
                document.head.appendChild(script);

                // Immediate basic protection
                let devtools = {open: false, orientation: null};
                
                // DevTools detection
                setInterval(function() {
                  if (window.outerHeight - window.innerHeight > 200 || 
                      window.outerWidth - window.innerWidth > 200) {
                    if (!devtools.open) {
                      devtools.open = true;
                      window.location.reload();
                    }
                  } else {
                    devtools.open = false;
                  }
                }, 500);

                // Disable right-click
                document.addEventListener('contextmenu', e => e.preventDefault());
                
                // Block common shortcuts
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'F12' || 
                      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
                      (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    return false;
                  }
                });

                // Console protection
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.log = function(...args) {
                  if (args.some(arg => typeof arg === 'string' && 
                      (arg.includes('security') || arg.includes('token') || arg.includes('key')))) {
                    return;
                  }
                  originalLog.apply(console, args);
                };
                
                console.error = function(...args) {
                  if (args.some(arg => typeof arg === 'string' && 
                      (arg.includes('security') || arg.includes('token') || arg.includes('key')))) {
                    return;
                  }
                  originalError.apply(console, args);
                };

                console.warn = function(...args) {
                  if (args.some(arg => typeof arg === 'string' && 
                      (arg.includes('security') || arg.includes('token') || arg.includes('key')))) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };

                // Text selection protection
                document.addEventListener('selectstart', e => e.preventDefault());
                document.addEventListener('dragstart', e => e.preventDefault());

                // Source view protection
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                    e.preventDefault();
                    return false;
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
      >
        <BrowserSecurity />
        {children}
      </body>
    </html>
  );
}
