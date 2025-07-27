
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect handles redirection.
    // It will only run on the client, and only when the loading state changes.
    // If loading is finished (!loading) and there is still no user, then redirect.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // This is the crucial part.
  // We show a loading indicator as long as the authentication check is in progress.
  // This prevents the children (the actual page) from rendering prematurely
  // and flashing content before the redirect can happen.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If loading is complete AND we have a user, then we can safely render the page content.
  // If there's no user, the page will be blank for a moment while the useEffect above
  // performs the redirect.
  if (user) {
    return <>{children}</>;
  }

  // This return is for the brief moment after loading is false but before the redirect effect runs.
  return null;
}
