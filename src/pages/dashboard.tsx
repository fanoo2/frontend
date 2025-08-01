import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhaseProgress from "@/components/phase-progress";
import AgentCard from "@/components/agent-card";
import WorkflowDiagram from "@/components/workflow-diagram";
import StatusIndicator from "@/components/status-indicator";
import AnnotationWidget from "@/components/annotation-widget";
import SimpleAnnotationWidget from "@/components/simple-annotation-widget";
import { useToast } from "@/hooks/use-toast";
import type { Agent, Phase, Repository, Service, Activity, Workflow } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: stats } = useQuery<{ activeAgents: number; completedTasks: number; progress: number }>({
    queryKey: ["/api/stats"],
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ["/api/phases"],
  });

  const { data: repositories = [] } = useQuery<Repository[]>({
    queryKey: ["/api/repositories"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: workflows = [] } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
  });

  const handleDeploy = () => {
    toast({
      title: "Platform Deployment Initiated",
      description: "Starting automated deployment of all configured agents and services.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
            <p className="text-sm text-gray-500">Automated AI-driven platform establishment</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <StatusIndicator status="healthy" />
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
            <Button onClick={handleDeploy} className="bg-primary hover:bg-blue-600">
              Deploy Platform
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Platform Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-xl">🤖</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Agents</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeAgents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.completedTasks || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Setup Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.progress || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mb-8">
          <PhaseProgress phases={phases} />
        </div>

        {/* Agent Configuration Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Configuration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Hand-off Workflow Visualization */}
        <div className="mb-8">
          <WorkflowDiagram workflows={workflows} />
        </div>

        {/* AI Text Annotation Testing */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Advanced Annotation Widget</h3>
            <AnnotationWidget />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Simple Annotation Widget</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <SimpleAnnotationWidget />
            </div>
          </div>
        </div>

        {/* GitHub Organization Status */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">GitHub Organization: @fanno</h2>
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repositories.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{repo.name}</p>
                      <p className="text-xs text-gray-500">{repo.isPrivate ? "Private" : "Public"}</p>
                    </div>
                  </div>
                  <StatusIndicator status={repo.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Health</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <StatusIndicator status={service.status} />
                    <span className="text-sm text-gray-600 capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <StatusIndicator status={activity.type} className="mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
