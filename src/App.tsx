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
import { createRoomClient } from '@org/webrtc-client';

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
  // ← health‐check state
  const [healthMsg, setHealthMsg] = useState<string>("Checking backend…");
  
  // WebRTC state
  const [room, setRoom] = useState<any>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  
  const API_BASE = import.meta.env.VITE_API_URL;

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

  // WebRTC setup and cleanup
  useEffect(() => {
    if (room) {
      const handleParticipantConnected = () => {
        setRemoteParticipants(room.getRemoteParticipants());
      };
      
      const handleTrackPublished = () => {
        setRemoteParticipants(room.getRemoteParticipants());
      };

      room.on('participantConnected', handleParticipantConnected);
      room.on('trackPublished', handleTrackPublished);
      
      return () => {
        room.disconnect();
        setIsConnected(false);
      };
    }
  }, [room]);

  const handleJoinRoom = async () => {
    try {
      // Fetch token from backend
      const response = await fetch(`${API_BASE}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: currentUser })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
      
      const { token } = await response.json();
      
      // Create and connect room client
      const roomClient = createRoomClient();
      await roomClient.connect(token);
      
      setRoom(roomClient);
      setIsConnected(true);
      setRemoteParticipants(roomClient.getRemoteParticipants());
      
    } catch (error) {
      console.error('Failed to join room:', error);
      setHealthMsg('WebRTC connection failed');
    }
  };

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
              onClick={handleJoinRoom} 
              disabled={isConnected}
              variant={isConnected ? "secondary" : "default"}
            >
              {isConnected ? "Connected to Room" : "Join WebRTC Room"}
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
                {remoteParticipants.map(participant => (
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
              
              {remoteParticipants.length === 0 && (
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