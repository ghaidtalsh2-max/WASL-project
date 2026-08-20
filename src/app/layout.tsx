import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { JourneyProvider } from '@/lib/state/JourneyContext';

export const metadata: Metadata = {
  title: 'WASL — وصل | AI Cultural Travel & Relocation Companion',
  description:
    'WASL is an intelligent global travel and relocation companion helping people understand culture, language, religious context, and digital safety before arrival.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#070A14] text-white selection:bg-pink-500 selection:text-white font-sans">
        <LanguageProvider>
          <ThemeProvider>
            <JourneyProvider>{children}</JourneyProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
