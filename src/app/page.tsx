'use client';
import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { EditorSidebar } from '@/components/features/EditorSidebar';
import { WebsitePreview } from '@/components/features/WebsitePreview';
import { PageHubLogo } from '@/components/shared/PageHubLogo';
import { CustomDomainDialog } from '@/components/features/CustomDomainDialog';
import type { WebsiteContent, GenerateWebsiteParams } from '@/lib/types';
import { generateWebsiteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerateWebsite = async (params: GenerateWebsiteParams) => {
    setLoading(true);
    setWebsiteContent(null);
    try {
      const result = await generateWebsiteAction(params);
      if (result) {
        setWebsiteContent(result);
      } else {
        throw new Error('Failed to generate content.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContent = (newContent: WebsiteContent) => {
    setWebsiteContent(newContent);
  }

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <PageHubLogo />
        </SidebarHeader>
        <SidebarContent>
          <EditorSidebar
            onGenerate={handleGenerateWebsite}
            loading={loading}
          />
        </SidebarContent>
        <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2" />
                Sign Out
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg font-semibold">
              Website Preview
            </h1>
          </div>
          <CustomDomainDialog />
        </header>
        <main className="flex-1">
          <WebsitePreview
            content={websiteContent}
            loading={loading}
            onUpdate={handleUpdateContent}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
