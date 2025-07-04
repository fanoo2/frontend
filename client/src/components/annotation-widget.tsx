import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface AnnotationResponse {
  annotations: string[];
}

export default function AnnotationWidget() {
  const [text, setText] = useState("");

  const annotateMutation = useMutation({
    mutationFn: async (text: string): Promise<AnnotationResponse> => {
      const response = await fetch("/api/annotate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      annotateMutation.mutate(text);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Text Annotation</CardTitle>
        <CardDescription>
          Test the AI annotation service by entering text below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze and annotate..."
              className="min-h-[100px]"
              maxLength={10000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {text.length}/10,000 characters
            </p>
          </div>
          <Button 
            type="submit" 
            disabled={!text.trim() || annotateMutation.isPending}
            className="w-full"
          >
            {annotateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Annotate Text"
            )}
          </Button>
        </form>

        {annotateMutation.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              Error: {annotateMutation.error instanceof Error ? annotateMutation.error.message : "Failed to annotate text"}
            </p>
          </div>
        )}

        {annotateMutation.data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Generated Annotations</h4>
              <Badge variant="outline">
                {annotateMutation.data.annotations.length} annotations
              </Badge>
            </div>
            <div className="space-y-2">
              {annotateMutation.data.annotations.map((annotation, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-md border text-sm"
                >
                  <span className="text-muted-foreground mr-2">•</span>
                  {annotation}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}