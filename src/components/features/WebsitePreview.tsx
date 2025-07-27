'use client';
import type { WebsiteContent, WebsiteSection } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Wand2, Edit } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { InlineEditMenu } from './InlineEditMenu';
import { rewriteTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


type WebsitePreviewProps = {
  content: WebsiteContent | null;
  loading: boolean;
  onUpdate: (newContent: WebsiteContent) => void;
};

type SelectionState = {
  x: number;
  y: number;
  text: string;
  sectionId: string;
  element: HTMLElement | null;
};

const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-12 md:py-20">
    <Skeleton className="mb-4 h-12 w-1/2" />
    <Skeleton className="mb-6 h-6 w-3/4" />
    <Skeleton className="h-[400px] w-full rounded-lg" />
  </div>
);

const SectionComponent = ({ section, parallax, onSelectText }: { section: WebsiteSection, parallax: boolean, onSelectText: (sectionId: string, element: HTMLElement) => void }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const handleMouseUp = () => {
    if (sectionRef.current) {
        onSelectText(section.id, sectionRef.current);
    }
  };
  
  const backgroundStyle: React.CSSProperties = parallax ? {
    backgroundImage: `url(https://placehold.co/1920x1080.png)`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  } : {};

  const contentClasses = "relative z-10 rounded-lg p-8 bg-background/80 backdrop-blur-sm";

  return (
    <section 
      ref={sectionRef}
      onMouseUp={handleMouseUp}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-16 md:py-24" 
      style={backgroundStyle}
      data-ai-hint={section.imagePrompt}
    >
      {!parallax && (
        <Image
          src={`https://placehold.co/1920x1080.png`}
          alt={section.imagePrompt}
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
          data-ai-hint={section.imagePrompt}
        />
      )}
      <div className="container mx-auto px-4">
        <div className={contentClasses}>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4 text-primary-darker">{section.title}</h2>
          <p className="text-lg md:text-xl text-foreground/90 whitespace-pre-wrap">{section.content}</p>
        </div>
      </div>
    </section>
  );
};


export function WebsitePreview({ content, loading, onUpdate }: WebsitePreviewProps) {
    const [selection, setSelection] = useState<SelectionState | null>(null);
    const { toast } = useToast();

    const handleTextSelection = (sectionId: string, element: HTMLElement) => {
        const sel = window.getSelection();
        const selectedText = sel?.toString().trim();

        if (selectedText && selectedText.length > 5) {
            const range = sel!.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            setSelection({
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY,
                text: selectedText,
                sectionId: sectionId,
                element: element,
            });
        } else {
            setSelection(null);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = () => setSelection(null);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRewrite = async (instruction: string) => {
        if (!selection || !content) return;
    
        const { text, sectionId } = selection;
        const sectionToUpdate = content.sections.find(s => s.id === sectionId);
        if (!sectionToUpdate) return;
    
        try {
            const rewrittenText = await rewriteTextAction(text, instruction, sectionToUpdate.content);
            
            const updatedContent = sectionToUpdate.content.replace(text, rewrittenText);
            
            const newSections = content.sections.map(s => 
                s.id === sectionId ? { ...s, content: updatedContent } : s
            );

            onUpdate({ ...content, sections: newSections });

            toast({
                title: 'Content updated!',
                description: 'The selected text has been rewritten.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Rewrite failed',
                description: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        } finally {
            setSelection(null);
        }
    };

    if (loading) {
        return (
        <div>
            <SectionSkeleton />
            <SectionSkeleton />
        </div>
        );
    }

  if (!content) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center p-4">
        <div className="p-8 border-2 border-dashed rounded-xl">
          <Wand2 className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 font-headline text-2xl font-semibold">
            Let&apos;s build your website
          </h2>
          <p className="mt-2 text-muted-foreground">
            Use the sidebar to describe your idea and generate your new website with AI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background" onMouseDown={(e) => e.stopPropagation()}>
        {content.sections.map((section) => (
            <SectionComponent 
                key={section.id} 
                section={section} 
                parallax={content.parallax}
                onSelectText={handleTextSelection}
            />
        ))}
        {selection && (
            <InlineEditMenu 
                selection={selection}
                onRewrite={handleRewrite}
                onClose={() => setSelection(null)}
            />
        )}
    </div>
  );
}
