"use client";

import React, { useState, useEffect } from 'react';
import { getResolutionSuggestions, type ResolutionSuggestionsInput, type ResolutionSuggestionsOutput } from '@/ai/flows/ticket-resolution-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TicketResolutionSuggestionsProps {
  ticketQuery: string;
}

const TicketResolutionSuggestions: React.FC<TicketResolutionSuggestionsProps> = ({ ticketQuery }) => {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    if (!ticketQuery) return;
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const input: ResolutionSuggestionsInput = { query: ticketQuery };
      const output: ResolutionSuggestionsOutput = await getResolutionSuggestions(input);
      setSuggestions(output.suggestions);
    } catch (err) {
      console.error("Error fetching resolution suggestions:", err);
      setError("Failed to load suggestions. Please try again.");
       toast({
        title: "AI Suggestion Error",
        description: "Could not fetch AI-powered resolution suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch suggestions automatically on component mount or query change
    // fetchSuggestions(); 
    // For now, let's make it on-demand via button.
  }, [ticketQuery]);


  return (
    <Card className="bg-accent/20 dark:bg-accent/10 border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-lg">AI Resolution Suggestions</CardTitle>
            </div>
            <Button onClick={fetchSuggestions} disabled={isLoading || !ticketQuery} size="sm">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Suggestions
            </Button>
        </div>
        <CardDescription>
          Powered by GenAI to help you resolve this ticket faster. Click "Get Suggestions".
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-2">Loading suggestions...</p>
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestions && suggestions.length > 0 && (
          <ul className="space-y-2 list-disc list-inside text-sm">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        )}
        {suggestions && suggestions.length === 0 && !isLoading && (
          <p className="text-muted-foreground">No specific suggestions found for this query.</p>
        )}
        {!suggestions && !isLoading && !error && (
            <p className="text-sm text-muted-foreground">Click the button above to generate AI suggestions for this ticket's query.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketResolutionSuggestions;
