'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';
import type { GenerateWebsiteParams } from '@/lib/types';

const sections = [
  { id: 'header', label: 'Header' },
  { id: 'hero', label: 'Hero Section' },
  { id: 'features', label: 'Features' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta', label: 'Call to Action' },
  { id: 'footer', label: 'Footer' },
];

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt of at least 10 characters.'),
  sections: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one section.',
    }),
  parallax: z.boolean().default(true),
});

type EditorSidebarProps = {
  onGenerate: (params: GenerateWebsiteParams) => void;
  loading: boolean;
};

export function EditorSidebar({ onGenerate, loading }: EditorSidebarProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      sections: ['hero', 'features', 'footer'],
      parallax: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-headline text-base">
                  Your Website Idea
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A landing page for a new AI-powered photo editing app"
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your vision in a few sentences.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sections"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="font-headline text-base">
                    Page Sections
                  </FormLabel>
                  <FormDescription>
                    Select the sections to include in your webpage.
                  </FormDescription>
                </div>
                <div className="space-y-3 rounded-md border p-4 shadow-sm">
                  {sections.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="sections"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parallax"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="font-headline text-base">
                    Parallax Effect
                  </FormLabel>
                  <FormDescription>
                    Enable a modern parallax scrolling effect for section backgrounds.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="border-t p-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            Generate Website
          </Button>
        </div>
      </form>
    </Form>
  );
}
