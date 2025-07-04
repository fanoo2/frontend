import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/status-indicator";
import type { Repository } from "@shared/schema";

export default function Organization() {
  const { data: repositories = [] } = useQuery<Repository[]>({
    queryKey: ["/api/repositories"],
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Setup</h1>
            <p className="text-sm text-gray-500">GitHub organization and repository management</p>
          </div>
          <Button variant="outline">Sync Repositories</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Organization Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>GitHub Organization: @fanno</span>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{repositories.length}</div>
                  <div className="text-sm text-gray-600">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {repositories.filter(r => r.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {repositories.filter(r => r.isPrivate).length}
                  </div>
                  <div className="text-sm text-gray-600">Private</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <Card key={repo.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-white">📦</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                        <p className="text-sm text-gray-600">
                          {repo.isPrivate ? "Private" : "Public"}
                        </p>
                      </div>
                    </div>
                    <StatusIndicator status={repo.status} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="capitalize font-medium">{repo.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-medium">
                        {repo.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Namespace Configuration */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Namespace Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">NPM Scope</h4>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <code className="text-sm">@fanno</code>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    All packages will be published under this scope
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Docker Registry</h4>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <code className="text-sm">registry.fanno.com</code>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Container images will be stored in this registry
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
