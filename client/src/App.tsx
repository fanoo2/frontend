import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Organization from "@/pages/organization";
import AgentConfig from "@/pages/agent-config";
import Workflows from "@/pages/workflows";
import Monitoring from "@/pages/monitoring";
import AnnotationLogs from "@/pages/annotation-logs";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/organization" component={Organization} />
          <Route path="/agent/:type" component={AgentConfig} />
          <Route path="/workflows" component={Workflows} />
          <Route path="/monitoring" component={Monitoring} />
          <Route path="/annotation-logs" component={AnnotationLogs} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
