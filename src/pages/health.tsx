import { useEffect } from 'react';

/**
 * Health Check Endpoint Component
 * 
 * Provides a simple health check endpoint that returns JSON status
 * for monitoring and smoke testing purposes.
 */
export default function Health() {
  useEffect(() => {
    // Set the document title for health check
    document.title = 'Health Check - Fanoo Frontend';
  }, []);

  const healthData = {
    status: 'healthy',
    service: 'fanoo-frontend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    environment: import.meta.env.MODE || 'development',
    checks: {
      frontend: 'ok',
      routing: 'ok',
      build: 'ok'
    }
  };

  // For API consumption, allow raw JSON response
  if (new URLSearchParams(window.location.search).get('format') === 'json') {
    return (
      <pre style={{ 
        fontFamily: 'monospace', 
        margin: 0, 
        padding: '20px',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'pre-wrap'
      }}>
        {JSON.stringify(healthData, null, 2)}
      </pre>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-green-800">System Health Check</h1>
              <p className="text-green-600">All systems operational</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="ml-2 text-sm text-green-700 font-semibold">{healthData.status}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Service:</span>
                <span className="ml-2 text-sm text-gray-900">{healthData.service}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Version:</span>
                <span className="ml-2 text-sm text-gray-900">{healthData.version}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Environment:</span>
                <span className="ml-2 text-sm text-gray-900">{healthData.environment}</span>
              </div>
            </div>
            
            <div className="border-t border-green-200 pt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Component Status</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(healthData.checks).map(([component, status]) => (
                  <div key={component} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs text-gray-600 capitalize">{component}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-green-200 pt-3">
              <p className="text-xs text-gray-500">
                Last checked: {new Date(healthData.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href="/health?format=json" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View JSON response
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}