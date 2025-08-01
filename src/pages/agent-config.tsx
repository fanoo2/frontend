import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/agent-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@shared/schema";

export default function AgentConfig() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  // Mock agents for testing when backend is unreachable
  const mockAgents: Agent[] = [
    {
      id: 1,
      name: "WebRTC Agent",
      type: "webrtc",
      description: "Real-time communication and media streaming agent",
      status: "configuring",
      config: {
        webhookUrl: "",
        turnStunSecrets: "",
        sfuClusterConfig: "",
        jwtSecret: ""
      },
      emoji: "📡",
      provider: "Fanno",
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: "Payment Agent",
      type: "payment",
      description: "Payment processing and webhook management agent",
      status: "configuring",
      config: {
        stripeKeys: "",
        webhookSecret: "",
        currency: "USD",
        payoutThreshold: 100
      },
      emoji: "💳",
      provider: "Fanno",
      lastUpdated: new Date()
    }
  ];

  const agent = agents.find(a => a.type === type) || mockAgents.find(a => a.type === type);

  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, config }: { id: number; config: any }) => {
      const response = await apiRequest("PATCH", `/api/agents/${id}`, { config });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Configuration Updated",
        description: "Agent configuration has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update agent configuration.",
        variant: "destructive",
      });
    },
  });

  const handleConfigChange = (config: any) => {
    if (agent) {
      updateAgentMutation.mutate({ id: agent.id, config });
    }
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Validating agent configuration and testing connectivity...",
    });
  };

  if (!agent) {
    return (
      <>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Agent Not Found</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600">The requested agent configuration could not be found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agent.name} Configuration</h1>
            <p className="text-sm text-gray-500">{agent.description}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleTestConnection}>
              Test Connection
            </Button>
            <Button 
              onClick={() => handleConfigChange(agent.config)}
              disabled={updateAgentMutation.isPending}
            >
              {updateAgentMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <AgentCard agent={agent} onConfigChange={handleConfigChange} />
          
          {/* Configuration Guide */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Guide</h3>
            <div className="prose prose-sm text-gray-600">
              {getConfigGuide(agent.type)}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function getConfigGuide(agentType: string) {
  switch (agentType) {
    case "ui-ux":
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Setting up UI/UX Agent</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a Uizard project and copy the share link</li>
            <li>Generate a Figma personal access token from your settings</li>
            <li>Create a new Figma file and copy the file key from the URL</li>
            <li>Install the Figma Tokens plugin in your Figma workspace</li>
          </ol>
        </div>
      );
    case "webrtc":
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Setting up WebRTC Agent</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Configure the webhook URL for receiving WebRTC events and notifications</li>
            <li>Install LiveKit CLI or set up an Agora account</li>
            <li>Configure TURN/STUN server credentials</li>
            <li>Set up your SFU cluster configuration</li>
            <li>Generate a JWT secret for session authentication</li>
          </ol>
        </div>
      );
    case "backend":
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Setting up Backend Agent</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create an OpenAPI specification file</li>
            <li>Set up your database connection string</li>
            <li>Configure Kafka broker for event streaming</li>
            <li>Set up JWT secret for API authentication</li>
          </ol>
        </div>
      );
    default:
      return (
        <p>Configuration guide for this agent type is coming soon.</p>
      );
  }
}
