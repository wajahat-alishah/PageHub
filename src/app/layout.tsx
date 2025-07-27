
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import MainLayout from './(main)/layout';


// export const metadata: Metadata = {
//   title: 'PageHub',
//   description: 'Generate beautiful websites with AI',
//   manifest: '/manifest.json',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>PageHub</title>
        <meta name="description" content="Generate beautiful websites with AI" />
        <meta name="manifest" content="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="application-name" content="PageHub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PageHub" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            {isAuthPage ? (
                children
            ) : (
                <MainLayout>{children}</MainLayout>
            )}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
