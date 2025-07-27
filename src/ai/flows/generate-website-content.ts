'use server';

/**
 * @fileOverview An AI agent that generates website content based on a user prompt.
 *
 * - generateWebsiteContent - A function that generates website content.
 * - GenerateWebsiteContentInput - The input type for the generateWebsiteContent function.
 * - GenerateWebsiteContentOutput - The return type for the generateWebsiteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteContentInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the website idea.'),
});
export type GenerateWebsiteContentInput = z.infer<
  typeof GenerateWebsiteContentInputSchema
>;

const GenerateWebsiteContentOutputSchema = z.object({
  websiteContent: z
    .string()
    .describe('The generated website content including text.'),
  imagePrompt: z
    .string()
    .describe('A prompt for generating an image for the website.'),
  layoutSuggestion: z
    .string()
    .describe('A suggestion for the layout of the website.'),
});
export type GenerateWebsiteContentOutput = z.infer<
  typeof GenerateWebsiteContentOutputSchema
>;

export async function generateWebsiteContent(
  input: GenerateWebsiteContentInput
): Promise<GenerateWebsiteContentOutput> {
  return generateWebsiteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteContentPrompt',
  input: {schema: GenerateWebsiteContentInputSchema},
  output: {schema: GenerateWebsiteContentOutputSchema},
  prompt: `You are an AI website content generator. Generate website content, an image prompt, and a layout suggestion based on the user's prompt.\n\nUser Prompt: {{{prompt}}}\n\nContent:`,
});

const generateWebsiteContentFlow = ai.defineFlow(
  {
    name: 'generateWebsiteContentFlow',
    inputSchema: GenerateWebsiteContentInputSchema,
    outputSchema: GenerateWebsiteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
