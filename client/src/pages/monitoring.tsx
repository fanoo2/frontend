import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusIndicator from "@/components/status-indicator";
import type { Service, Activity, Agent } from "@shared/schema";

export default function Monitoring() {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const healthyServices = services.filter(s => s.status === 'healthy').length;
  const healthPercentage = services.length > 0 ? (healthyServices / services.length) * 100 : 0;

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const agentHealthPercentage = agents.length > 0 ? (activeAgents / agents.length) * 100 : 0;

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-sm text-gray-500">Service health and system activity monitoring</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(healthPercentage)}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">💚</span>
                </div>
              </div>
              <Progress value={healthPercentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agent Status</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(agentHealthPercentage)}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🤖</span>
                </div>
              </div>
              <Progress value={agentHealthPercentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900">{healthyServices}/{services.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⚙️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Health */}
          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusIndicator status={service.status} />
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-500">
                          Last checked: {new Date(service.lastCheck).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium capitalize text-gray-600">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Status */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{agent.emoji}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(agent.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium status-${agent.status}`}>
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <StatusIndicator status={activity.type} className="mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium status-${activity.type} mt-1 inline-block`}>
                        {activity.type}
                      </span>
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
