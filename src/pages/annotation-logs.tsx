import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Annotation {
  id: number;
  inputText: string;
  resultJson: {
    annotations: string[];
    analysisMethod: string;
    timestamp: string;
    inputLength: number;
    annotationCount: number;
  };
  createdAt: string;
}

export default function AnnotationLogs() {
  const { data: annotations, isLoading } = useQuery<Annotation[]>({
    queryKey: ["/api/annotations"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Annotation Logs</h1>
          <p className="text-muted-foreground">Monitor text annotation API usage and results</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Annotation Logs</h1>
        <p className="text-muted-foreground">
          Monitor text annotation API usage and results
        </p>
      </div>

      {annotations && annotations.length > 0 ? (
        <div className="space-y-4">
          {annotations.map((annotation) => (
            <Card key={annotation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Annotation #{annotation.id}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(annotation.createdAt), "PPpp")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={annotation.resultJson.analysisMethod === 'openai' ? 'default' : 'secondary'}>
                      {annotation.resultJson.analysisMethod === 'openai' ? 'AI Powered' : 'Basic Analysis'}
                    </Badge>
                    <Badge variant="outline">
                      {annotation.resultJson.inputLength} chars
                    </Badge>
                    <Badge variant="outline">
                      {annotation.resultJson.annotationCount} annotations
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Input Text:</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {annotation.inputText}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Generated Annotations:</h4>
                  <ul className="space-y-2">
                    {annotation.resultJson.annotations.map((ann, index) => (
                      <li key={index} className="text-sm bg-background border rounded-md p-3">
                        <span className="text-muted-foreground mr-2">•</span>
                        {ann}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No Annotations Yet</h3>
            <p className="text-muted-foreground">
              Annotation logs will appear here when the API is used.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}