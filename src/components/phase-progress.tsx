import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Phase } from "@shared/schema";

interface PhaseProgressProps {
  phases: Phase[];
}

export default function PhaseProgress({ phases }: PhaseProgressProps) {
  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status: string, _progress: number) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-600 text-white">Complete</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Phases</h2>
      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={cn(
              "flex items-center justify-between p-4 border rounded-lg",
              getPhaseStatusColor(phase.status)
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                {phase.status === "complete" ? (
                  <span className="text-green-600 text-sm">✓</span>
                ) : (
                  <span className="text-gray-600 text-sm">{phase.order + 1}</span>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{phase.name}</h3>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {phase.status === "in-progress" && (
                <div className="w-24">
                  <Progress value={phase.progress} className="h-2" />
                </div>
              )}
              {getStatusBadge(phase.status, phase.progress)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
