
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
    // It will only run when the loading state changes.
    // If loading is finished (!loading) and there is no user, then redirect.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // This is the crucial part. 
  // We show a loading indicator as long as the authentication is in progress (loading)
  // OR if there is no user. If there's no user, the useEffect above will trigger the redirect.
  // This prevents the children from rendering prematurely and causing a flash of content
  // before the redirect can happen.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If loading is complete and we have a user, then we can safely render the page content.
  return <>{children}</>;
}
