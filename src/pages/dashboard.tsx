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
      <header className="bg-gradient-to-r from-primary to-primary/90 border-b shadow-lg px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Platform Dashboard</h1>
            <p className="text-primary-foreground/80 mt-1">Automated AI-driven platform establishment</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <StatusIndicator status="healthy" />
              <span className="text-white font-medium">All systems operational</span>
            </div>
            <Button 
              onClick={handleDeploy} 
              className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Deploy Platform
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {/* Platform Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Agents</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.activeAgents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.completedTasks || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Setup Progress</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.progress || 0}%</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full mr-3"></span>
            AI Agent Configuration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Hand-off Workflow Visualization */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full mr-3"></span>
            Agent Hand-off Workflows
          </h2>
          <WorkflowDiagram workflows={workflows} />
        </div>

        {/* AI Text Annotation Testing */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full mr-3"></span>
                Advanced Annotation Widget
              </h3>
              <AnnotationWidget />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
                Simple Annotation Widget
              </h3>
              <SimpleAnnotationWidget />
            </CardContent>
          </Card>
        </div>

        {/* GitHub Organization Status */}
        <div className="mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full mr-3"></span>
                  GitHub Organization: @fanno
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repositories.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-sm">📦</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{repo.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{repo.isPrivate ? "Private" : "Public"}</p>
                      </div>
                    </div>
                    <StatusIndicator status={repo.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></span>
                Service Health
              </h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                    <div className="flex items-center space-x-3">
                      <StatusIndicator status={service.status} />
                      <span className="text-sm text-gray-600 capitalize font-medium">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-3"></span>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <StatusIndicator status={activity.type} className="mt-2" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
