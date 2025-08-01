import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Agent } from "@shared/schema";

interface AgentCardProps {
  agent: Agent;
  onConfigChange?: (config: any) => void;
}

export default function AgentCard({ agent, onConfigChange }: AgentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "configuring":
        return <Badge className="bg-yellow-600 text-white">Configuring</Badge>;
      case "error":
        return <Badge className="bg-red-600 text-white">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "ui-ux":
        return "bg-purple-100";
      case "webrtc":
        return "bg-blue-100";
      case "backend":
        return "bg-green-100";
      case "frontend":
        return "bg-indigo-100";
      case "payment":
        return "bg-emerald-100";
      case "moderation":
        return "bg-red-100";
      case "devops":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  const renderConfigFields = () => {
    const config = agent.config as any;

    switch (agent.type) {
      case "ui-ux":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Uizard Project Link</Label>
              <Input
                type="url"
                placeholder="https://app.uizard.io/project/..."
                value={config.uizardProject || ""}
                onChange={(e) => onConfigChange?.({ ...config, uizardProject: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Figma Access Token</Label>
              <Input
                type="password"
                placeholder="figd_..."
                value={config.figmaToken || ""}
                onChange={(e) => onConfigChange?.({ ...config, figmaToken: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Figma File Key</Label>
              <Input
                placeholder="ABC123DEF456..."
                value={config.figmaFileKey || ""}
                onChange={(e) => onConfigChange?.({ ...config, figmaFileKey: e.target.value })}
              />
            </div>
          </div>
        );

      case "webrtc":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/webhook"
                value={config.webhookUrl || ""}
                onChange={(e) => onConfigChange?.({ ...config, webhookUrl: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">TURN/STUN Secrets</Label>
              <Input
                type="password"
                placeholder="•••••••••••••"
                value={config.turnStunSecrets || ""}
                onChange={(e) => onConfigChange?.({ ...config, turnStunSecrets: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">SFU Cluster Config</Label>
              <Input
                placeholder="cluster.fanno.com"
                value={config.sfuClusterConfig || ""}
                onChange={(e) => onConfigChange?.({ ...config, sfuClusterConfig: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">JWT Secret</Label>
              <Input
                type="password"
                placeholder="•••••••••••••"
                value={config.jwtSecret || ""}
                onChange={(e) => onConfigChange?.({ ...config, jwtSecret: e.target.value })}
              />
            </div>
          </div>
        );

      case "backend":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">OpenAPI Schema Location</Label>
              <Input
                placeholder="./docs/openapi.yaml"
                value={config.openapiLocation || ""}
                onChange={(e) => onConfigChange?.({ ...config, openapiLocation: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Database Connection</Label>
              <Input
                type="password"
                placeholder="postgresql://..."
                value={config.dbConnection || ""}
                onChange={(e) => onConfigChange?.({ ...config, dbConnection: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Kafka Broker URL</Label>
              <Input
                placeholder="kafka.fanno.com:9092"
                value={config.kafkaBroker || ""}
                onChange={(e) => onConfigChange?.({ ...config, kafkaBroker: e.target.value })}
              />
            </div>
          </div>
        );

      case "frontend":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">NPM Tokens (@fanno/*)</Label>
              <Input
                type="password"
                placeholder="npm_..."
                value={config.npmTokens || ""}
                onChange={(e) => onConfigChange?.({ ...config, npmTokens: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">API Base URL</Label>
              <Input
                type="url"
                placeholder="https://api.fanno.com"
                value={config.apiBaseUrl || ""}
                onChange={(e) => onConfigChange?.({ ...config, apiBaseUrl: e.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chat"
                  checked={config.features?.chat || false}
                  onCheckedChange={(checked) =>
                    onConfigChange?.({
                      ...config,
                      features: { ...config.features, chat: checked },
                    })
                  }
                />
                <Label htmlFor="chat" className="text-sm text-gray-700">Chat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gifts"
                  checked={config.features?.gifts || false}
                  onCheckedChange={(checked) =>
                    onConfigChange?.({
                      ...config,
                      features: { ...config.features, gifts: checked },
                    })
                  }
                />
                <Label htmlFor="gifts" className="text-sm text-gray-700">Gifts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="livePreview"
                  checked={config.features?.livePreview || false}
                  onCheckedChange={(checked) =>
                    onConfigChange?.({
                      ...config,
                      features: { ...config.features, livePreview: checked },
                    })
                  }
                />
                <Label htmlFor="livePreview" className="text-sm text-gray-700">Live Preview</Label>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Stripe API Keys</Label>
              <Input
                type="password"
                placeholder="sk_live_..."
                value={config.stripeKeys || ""}
                onChange={(e) => onConfigChange?.({ ...config, stripeKeys: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Webhook Secret</Label>
              <Input
                type="password"
                placeholder="whsec_..."
                value={config.webhookSecret || ""}
                onChange={(e) => onConfigChange?.({ ...config, webhookSecret: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Currency</Label>
                <Select
                  value={config.currency || "USD"}
                  onValueChange={(value) => onConfigChange?.({ ...config, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Payout Threshold</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={config.payoutThreshold || ""}
                  onChange={(e) => onConfigChange?.({ ...config, payoutThreshold: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );

      case "moderation":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">OpenAI API Key</Label>
              <Input
                type="password"
                placeholder="sk-..."
                value={config.openaiKey || ""}
                onChange={(e) => onConfigChange?.({ ...config, openaiKey: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Perspective API Key</Label>
              <Input
                type="password"
                placeholder="AIza..."
                value={config.perspectiveKey || ""}
                onChange={(e) => onConfigChange?.({ ...config, perspectiveKey: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Toxicity Threshold</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.8"
                  value={config.toxicityThreshold || ""}
                  onChange={(e) => onConfigChange?.({ ...config, toxicityThreshold: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Adult Content</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.7"
                  value={config.adultContentThreshold || ""}
                  onChange={(e) => onConfigChange?.({ ...config, adultContentThreshold: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Configuration interface not yet implemented for this agent type.
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getIconBgColor(agent.type))}>
            <span className="text-lg">{agent.emoji}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.provider}</p>
          </div>
        </div>
        {getStatusBadge(agent.status)}
      </div>
      {renderConfigFields()}
    </div>
  );
}
