import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WorkflowDiagram from "@/components/workflow-diagram";
import type { Workflow } from "@shared/schema";

export default function Workflows() {
  const { data: workflows = [] } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case "complete":
        return <Badge className="bg-blue-600 text-white">Complete</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Workflows</h1>
          <p className="text-sm text-gray-500">Hand-off patterns and integration blueprints</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Workflow Visualization */}
        <div className="mb-8">
          <WorkflowDiagram workflows={workflows} />
        </div>

        {/* Workflow Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Details</h2>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{workflow.fromAgent} → {workflow.toAgent}</span>
                    {getStatusBadge(workflow.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Artifact</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <code className="text-sm">{workflow.artifact}</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Points */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Integration Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Design → Frontend</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    UI Agent publishes design tokens and component library to npm registry
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">NPM Package</span>
                    <code className="text-xs">@fanno/design-system</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">API Spec → SDKs</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Backend Agent commits OpenAPI specification, triggering SDK generation
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">OpenAPI</span>
                    <code className="text-xs">openapi.yaml</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">WebRTC → Frontend</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    WebRTC Agent publishes real-time communication client library
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">NPM Package</span>
                    <code className="text-xs">@fanno/webrtc-client</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payments → Backend</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Payment Agent deploys service and emits Kafka events for user credits
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Kafka Topic</span>
                    <code className="text-xs">payment.completed</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Chat → Moderation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Frontend sends chat messages to Moderation service for filtering
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Kafka Topics</span>
                    <code className="text-xs">chat.broadcast, chat.review</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
