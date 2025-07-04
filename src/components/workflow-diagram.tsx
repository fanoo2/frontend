import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@shared/schema";

interface WorkflowDiagramProps {
  workflows: Workflow[];
}

export default function WorkflowDiagram({ workflows }: WorkflowDiagramProps) {
  const getAgentIcon = (agentName: string) => {
    if (agentName.includes("UI/UX") || agentName.includes("Design")) return "🎨";
    if (agentName.includes("WebRTC")) return "📡";
    if (agentName.includes("Backend")) return "⚙️";
    if (agentName.includes("Frontend")) return "💻";
    if (agentName.includes("Payment")) return "💳";
    if (agentName.includes("Moderation")) return "🛡️";
    if (agentName.includes("DevOps")) return "🚀";
    return "📄";
  };

  const getAgentBgColor = (agentName: string) => {
    if (agentName.includes("UI/UX") || agentName.includes("Design")) return "bg-purple-100";
    if (agentName.includes("WebRTC")) return "bg-blue-100";
    if (agentName.includes("Backend")) return "bg-green-100";
    if (agentName.includes("Frontend")) return "bg-indigo-100";
    if (agentName.includes("Payment")) return "bg-emerald-100";
    if (agentName.includes("Moderation")) return "bg-red-100";
    if (agentName.includes("DevOps")) return "bg-orange-100";
    return "bg-gray-100";
  };

  const getStatusBadge = (status: string, artifact: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white text-xs">{artifact}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-white text-xs">{artifact}</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{artifact}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Hand-off Workflows</h2>
      <div className="space-y-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${getAgentBgColor(workflow.fromAgent)} rounded-lg flex items-center justify-center`}>
                <span className="text-sm">{getAgentIcon(workflow.fromAgent)}</span>
              </div>
              <span className="text-sm font-medium">{workflow.fromAgent}</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">{workflow.toAgent}</span>
              <div className={`w-8 h-8 ${getAgentBgColor(workflow.toAgent)} rounded-lg flex items-center justify-center`}>
                <span className="text-sm">{getAgentIcon(workflow.toAgent)}</span>
              </div>
            </div>
            <div className="ml-4">
              {getStatusBadge(workflow.status, workflow.artifact)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
