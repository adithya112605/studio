// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides resolution suggestions for support tickets.
 *
 * - getResolutionSuggestions - A function that suggests resolution steps based on the ticket query.
 * - ResolutionSuggestionsInput - The input type for the getResolutionSuggestions function.
 * - ResolutionSuggestionsOutput - The return type for the getResolutionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolutionSuggestionsInputSchema = z.object({
  query: z
    .string()
    .describe('The query from the support ticket for which suggestions are needed.'),
});
export type ResolutionSuggestionsInput = z.infer<typeof ResolutionSuggestionsInputSchema>;

const ResolutionSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested resolution steps for the ticket query.'),
});
export type ResolutionSuggestionsOutput = z.infer<typeof ResolutionSuggestionsOutputSchema>;

export async function getResolutionSuggestions(
  input: ResolutionSuggestionsInput
): Promise<ResolutionSuggestionsOutput> {
  return resolutionSuggestionsFlow(input);
}

const resolutionSuggestionsPrompt = ai.definePrompt({
  name: 'resolutionSuggestionsPrompt',
  input: {schema: ResolutionSuggestionsInputSchema},
  output: {schema: ResolutionSuggestionsOutputSchema},
  prompt: `You are an expert support agent providing resolution steps for support tickets.

  Based on the following query, provide a list of suggested resolution steps that an HR representative can take to quickly resolve the issue.

  Query: {{{query}}}

  Format the output as a JSON array of strings.`,
});

const resolutionSuggestionsFlow = ai.defineFlow(
  {
    name: 'resolutionSuggestionsFlow',
    inputSchema: ResolutionSuggestionsInputSchema,
    outputSchema: ResolutionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await resolutionSuggestionsPrompt(input);
    return output!;
  }
);
