import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Platform Setup",
    items: [
      { name: "Dashboard", href: "/", icon: "📊" },
      { name: "Organization", href: "/organization", icon: "🏢" },
    ],
  },
  {
    title: "AI Agents",
    items: [
      { name: "UI/UX Agent", href: "/agent/ui-ux", icon: "🎨" },
      { name: "WebRTC Agent", href: "/agent/webrtc", icon: "📡" },
      { name: "Backend Agent", href: "/agent/backend", icon: "⚙️" },
      { name: "Frontend Agent", href: "/agent/frontend", icon: "💻" },
      { name: "Payment Agent", href: "/agent/payment", icon: "💳" },
      { name: "Moderation Agent", href: "/agent/moderation", icon: "🛡️" },
      { name: "DevOps Agent", href: "/agent/devops", icon: "🚀" },
    ],
  },
  {
    title: "Integration",
    items: [
      { name: "Workflows", href: "/workflows", icon: "🔄" },
      { name: "Monitoring", href: "/monitoring", icon: "📈" },
      { name: "Annotation Logs", href: "/annotation-logs", icon: "📝" },
      { name: "Checkout", href: "/checkout", icon: "🛒" }, // Added checkout link
    ],
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-primary/90">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Fanno Platform</h1>
            <p className="text-sm text-primary-foreground/80">AI Agent Orchestration</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-6">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 border-l-2 border-gray-200">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer group",
                    location === item.href
                      ? "text-white bg-gradient-to-r from-primary to-primary/90 shadow-lg"
                      : "text-gray-700 hover:text-primary hover:bg-primary/10 hover:shadow-md"
                  )}
                >
                  <span className="w-6 h-6 mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500 font-medium">@fanno</p>
          </div>
        </div>
      </div>
    </div>
  );
}