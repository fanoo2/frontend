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
    ],
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Fanno Platform</h1>
            <p className="text-xs text-gray-500">AI Agent Orchestration</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    location === item.href
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">@fanno</p>
          </div>
        </div>
      </div>
    </div>
  );
}
