'use server';

/**
 * @fileOverview An AI agent for rewriting or enhancing selected text.
 *
 * - inlineAIEdit - A function that handles the text editing process.
 * - InlineAIEditInput - The input type for the inlineAIEdit function.
 * - InlineAIEditOutput - The return type for the inlineAIEdit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InlineAIEditInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user to be rewritten or enhanced.'),
  context: z.string().optional().describe('The surrounding context of the selected text.'),
  instruction: z.string().describe('Instruction on how to rewrite or enhance the text.'),
});
export type InlineAIEditInput = z.infer<typeof InlineAIEditInputSchema>;

const InlineAIEditOutputSchema = z.object({
  editedText: z.string().describe('The rewritten or enhanced text.'),
});
export type InlineAIEditOutput = z.infer<typeof InlineAIEditOutputSchema>;

export async function inlineAIEdit(input: InlineAIEditInput): Promise<InlineAIEditOutput> {
  return inlineAIEditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inlineAIEditPrompt',
  input: {schema: InlineAIEditInputSchema},
  output: {schema: InlineAIEditOutputSchema},
  prompt: `You are an AI text editor. You will rewrite or enhance the selected text based on the user's instruction and the surrounding context.

Context: {{{context}}}

Instruction: {{{instruction}}}

Selected text: {{{selectedText}}}

Edited text:`,
});

const inlineAIEditFlow = ai.defineFlow(
  {
    name: 'inlineAIEditFlow',
    inputSchema: InlineAIEditInputSchema,
    outputSchema: InlineAIEditOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      editedText: output!.editedText,
    };
  }
);
