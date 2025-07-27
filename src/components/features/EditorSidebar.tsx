'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, FileText, Pilcrow } from 'lucide-react';
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
  prompt: z.string().optional(),
  file: z.instanceof(File).optional(),
  sections: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one section.',
    }),
  parallax: z.boolean().default(true),
}).refine(data => !!data.prompt || !!data.file, {
    message: "Either a prompt or a file is required.",
    path: ["prompt"], // you can use any field name here
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let finalPrompt = values.prompt || '';
    if (values.file) {
        try {
            finalPrompt = await values.file.text();
        } catch (e) {
            form.setError('file', { type: 'manual', message: 'Could not read the file.' });
            return;
        }
    }
    
    if (!finalPrompt) {
        form.setError('prompt', { type: 'manual', message: 'A prompt is required if no file is uploaded.' });
        return;
    }

    onGenerate({ ...values, prompt: finalPrompt });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompt"><Pilcrow className="mr-2" />Prompt</TabsTrigger>
              <TabsTrigger value="file"><FileText className="mr-2"/>File</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt">
                <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                    <FormItem className="mt-4">
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
            </TabsContent>
            <TabsContent value="file">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest }}) => (
                    <FormItem className="mt-4">
                        <FormLabel className="font-headline text-base">Upload a file</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept=".txt,.md"
                                onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} 
                                {...rest}
                            />
                        </FormControl>
                        <FormDescription>
                            Upload a text or markdown file to use as the prompt.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </TabsContent>
          </Tabs>
          

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
