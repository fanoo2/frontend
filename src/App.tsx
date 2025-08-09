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
import Health from "@/pages/health";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";
// Remove the problematic import for now
// import { createRoomClient, setLogLevel } from '@fanno/webrtc-client';

function Router() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/health" component={Health} />
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
  // ← health‐check state
  const [healthMsg, setHealthMsg] = useState<string>("Checking backend…");

  // WebRTC state
  const [room, _setRoom] = useState<any>(null);
  const [peers, _setPeers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser] = useState(`guest_${Date.now()}`);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  console.log('📡 HEALTH URL →', HEALTH);

  useEffect(() => {
    fetch(HEALTH)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON - likely received HTML error page');
        }
        return res.json();
      })
      .then((data) => setHealthMsg(`${data.status} @ ${new Date(data.timestamp).toLocaleTimeString()}`))
      .catch((err) => {
        console.error('Fetch error:', err);
        setHealthMsg(`Backend unreachable: ${err.message}`);
      });
  }, []);

  // WebRTC setup and cleanup - temporarily disabled due to import issues
  useEffect(() => {
    async function joinRoom(roomName: string = 'my-room', identity: string = currentUser) {
      try {
        console.log('🔄 Attempting to join WebRTC room...');
        
        // 1️⃣ Hit your token endpoint using the full API URL
        const tokenUrl = `${API_URL}/api/livekit/token`;
        console.log('🔗 Token endpoint:', tokenUrl);
        
        const resp = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName, identity })
        });

        // 2️⃣ Make sure we got a 200
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Token request failed (${resp.status}): ${text}`);
        }

        // 3️⃣ Check if response is JSON
        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await resp.text();
          throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
        }

        // 4️⃣ Try to parse JSON
        let data;
        try {
          data = await resp.json();
        } catch {
          const text = await resp.text();
          throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
        }

        const { token, url } = data;
        if (!token) {
          throw new Error(`Token missing in response: ${JSON.stringify(data)}`);
        }

        console.log('✅ Got WebRTC token and URL');
        console.log('🎯 Would connect to room with:', { token: 'present', url });
        
        // TODO: Re-enable when @fanno/webrtc-client export issues are resolved
        // const client = createRoomClient({ url });
        // await client.connect(token);
        // setRoom(client);
        // setIsConnected(true);
        
      } catch (error: any) {
        console.error('Failed to join room:', error);
        setIsConnected(false);
      }
    }

    joinRoom();
  }, [currentUser, API_URL]);



  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* ─── Health Check Banner ─── */}
        <div className="bg-white text-sm text-gray-700 p-2 border-b flex items-center justify-between">
          <div>
            <strong>Backend:</strong> {healthMsg}
            {isConnected && <span className="ml-2 text-green-600">• WebRTC Connected</span>}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => alert("Hello from @fanno/design-system!")}>
              Test Design System
            </Button>
            <Button 
              disabled
              variant={isConnected ? "secondary" : "outline"}
            >
              {isConnected ? "Connected to Room" : "Connecting..."}
            </Button>
          </div>
        </div>

        {/* ─── WebRTC Video Section ─── */}
        {isConnected && (
          <div className="bg-gray-100 p-4 border-b">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">WebRTC Video Chat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Local Video */}
                <div className="bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={el => room && el && room.attachLocalVideo(el)} 
                    autoPlay 
                    muted 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2 bg-white">
                    <span className="text-sm font-medium">You ({currentUser})</span>
                  </div>
                </div>

                {/* Remote Videos */}
                {peers.map(participant => (
                  <div key={participant.sid} className="bg-black rounded-lg overflow-hidden">
                    <video
                      ref={el => room && el && participant.videoTrack && room.attachTrack(participant.videoTrack, el)}
                      autoPlay
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-white">
                      <span className="text-sm font-medium">{participant.identity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {peers.length === 0 && (
                <p className="text-gray-600 mt-4">No other participants in the room yet.</p>
              )}
            </div>
          </div>
        )}

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;