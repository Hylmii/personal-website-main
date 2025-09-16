import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
