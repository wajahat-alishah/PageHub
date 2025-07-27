
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
    // This effect handles the redirection. It runs only on the client-side.
    // If the authentication check is complete (!loading) and there's still no user,
    // then it's safe to redirect to the login page.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While the authentication check is running, we display a loading screen.
  // This is the key part of the fix: it prevents any premature rendering or
  // redirection until the user's status is confirmed.
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
  if (user) {
    return <>{children}</>;
  }

  // If loading is complete but there is no user, the useEffect above will handle the redirect.
  // We return null here to prevent a brief flash of unstyled content before the redirect happens.
  return null;
}
