import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@fanno/design-system";
import { HEALTH } from "@/lib/api";
import Dashboard from "@/pages/dashboard";
import Organization from "@/pages/organization";
import AgentConfig from "@/pages/agent-config";
import Workflows from "@/pages/workflows";
import Monitoring from "@/pages/monitoring";
import AnnotationLogs from "@/pages/annotation-logs";
import Checkout from "@/pages/checkout";
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
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  // ← new health‐check state
  const [healthMsg, setHealthMsg] = useState<string>("Checking backend…");

  console.log('📡 HEALTH URL →', HEALTH);

  useEffect(() => {
    fetch(HEALTH)
      .then((res) => res.json())
      .then((data) => setHealthMsg(`${data.status} @ ${new Date(data.timestamp).toLocaleTimeString()}`))
      .catch((err) => {
        console.error('Fetch error:', err);
        setHealthMsg('Backend unreachable');
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* ─── Health Check Banner ─── */}
        <div className="bg-white text-sm text-gray-700 p-2 border-b flex items-center justify-between">
          <div>
            <strong>Backend:</strong> {healthMsg}
          </div>
          <Button onClick={() => alert("Hello from @fanno/design-system!")}>
            Test Design System
          </Button>
        </div>

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;