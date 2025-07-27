
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
    // We only want to redirect if loading is complete and there's no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, or if there's no user yet (and we're about to redirect),
  // show a loading screen. This prevents the redirect loop.
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

  // If loading is complete and we have a user, render the children.
  return <>{children}</>;
}
