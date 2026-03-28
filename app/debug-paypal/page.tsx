'use client';

import { useState, useEffect } from 'react';

export default function DebugPayPalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('=== Page loaded, starting tests ===');
    
    // Test 1: Fetch config
    addLog('Test 1: Fetching /api/paypal/config...');
    fetch('/api/paypal/config')
      .then(res => {
        addLog(`✓ Response status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        addLog(`✓ Response data received`);
        setConfig(data);
        addLog(`✓ Client ID from config: ${data.clientId ? data.clientId.substring(0, 20) + '...' : 'NULL'}`);
        
        if (data.clientId) {
          setClientId(data.clientId);
          addLog('✅ CONFIG TEST PASSED: Client ID is valid');
        } else {
          addLog('❌ CONFIG TEST FAILED: Client ID is empty');
        }
      })
      .catch(err => {
        addLog(`❌ CONFIG TEST FAILED: ${err.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono text-sm">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          🔍 PayPal Debug Console
        </h1>

        {/* Config Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">📋 Configuration Status</h2>
          
          {!config && (
            <div className="text-yellow-400">⏳ Loading configuration...</div>
          )}
          
          {config && (
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Client ID:</div>
                <div className={clientId ? 'text-green-400' : 'text-red-400'}>
                  {clientId ? '✅ ' : '❌ '}{clientId || 'NOT SET'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Pro Monthly:</div>
                  <div className="text-blue-400 text-xs">{config.plans.proMonthly || 'NOT SET'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Pro Yearly:</div>
                  <div className="text-blue-400 text-xs">{config.plans.proYearly || 'NOT SET'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Business Monthly:</div>
                  <div className="text-blue-400 text-xs">{config.plans.businessMonthly || 'NOT SET'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Business Yearly:</div>
                  <div className="text-blue-400 text-xs">{config.plans.businessYearly || 'NOT SET'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Logs */}
        <div className="bg-black rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">📝 Live Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 && (
              <div className="text-gray-500">Waiting for logs...</div>
            )}
            {logs.map((log, index) => (
              <div key={index} className="border-b border-gray-800 pb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <a
            href="/credits"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Credits Page
          </a>
          <a
            href="/pricing"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Pricing Page
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/30 border border-blue-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">📖 How to debug:</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>Open this page: http://localhost:3001/debug-paypal</li>
            <li>Check the "Configuration Status" section</li>
            <li>Look at the "Live Logs" for detailed output</li>
            <li>Open browser Console (F12) for more details</li>
            <li>If Client ID shows ✅, the configuration is correct</li>
            <li>If Client ID shows ❌, check .env.local file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
