import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hiring-diagnostic.vercel.app'
  ),
  title: 'The Hiring Funnel Diagnostic',
  description:
    'A 7-minute diagnostic that scores your hiring across five stages and surfaces your worst leak. Built by James MacDonald.',
  openGraph: {
    title: 'The Hiring Funnel Diagnostic',
    description:
      'Seven minutes. Twenty questions. Five stages. You finish with a scored funnel, your worst leak, and the artefact that fixes it.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'The Hiring Funnel Diagnostic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hiring Funnel Diagnostic',
    description:
      'Seven minutes. Twenty questions. Five stages. You finish with a scored funnel, your worst leak, and the artefact that fixes it.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
