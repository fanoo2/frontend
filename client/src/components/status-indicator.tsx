import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: string;
  className?: string;
}

export default function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
      case "healthy":
      case "complete":
        return "bg-green-500";
      case "warning":
      case "configuring":
      case "degraded":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "pending":
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <span
      className={cn("w-2 h-2 rounded-full", getStatusStyles(status), className)}
    />
  );
}
