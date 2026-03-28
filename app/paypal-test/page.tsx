'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PayPalTestPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/paypal/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 PayPal Configuration Test
          </h1>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading configuration...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">❌ Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {config && (
            <div className="space-y-6">
              {/* Client ID */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <h2 className="text-xl font-bold text-green-800">Client ID 配置正确</h2>
                </div>
                <div className="bg-white rounded p-3 font-mono text-sm text-gray-700 break-all">
                  {config.clientId}
                </div>
              </div>

              {/* Plan IDs */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Subscription Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-900 mb-1">Pro Monthly</div>
                    <div className="text-sm text-blue-700 font-mono break-all">
                      {config.plans.proMonthly || 'Not configured'}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">$9.99/month</div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-900 mb-1">Pro Yearly</div>
                    <div className="text-sm text-blue-700 font-mono break-all">
                      {config.plans.proYearly || 'Not configured'}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">$99/year</div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="font-semibold text-purple-900 mb-1">Business Monthly</div>
                    <div className="text-sm text-purple-700 font-mono break-all">
                      {config.plans.businessMonthly || 'Not configured'}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">$29.99/month</div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="font-semibold text-purple-900 mb-1">Business Yearly</div>
                    <div className="text-sm text-purple-700 font-mono break-all">
                      {config.plans.businessYearly || 'Not configured'}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">$299/year</div>
                  </div>
                </div>
              </div>

              {/* API URL */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="font-semibold text-gray-900 mb-1">🌐 API URL</div>
                <div className="text-sm text-gray-700 font-mono">
                  {config.apiUrl}
                </div>
              </div>

              {/* Quick Links */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Quick Links</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/pricing"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Go to Pricing Page
                  </Link>
                  <Link
                    href="/credits"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Credits Page
                  </Link>
                  <a
                    href="https://developer.paypal.com/dashboard/accounts"
                    target="_blank"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    PayPal Sandbox Accounts
                  </a>
                </div>
              </div>

              {/* Debug Info */}
              <div className="border-t pt-6">
                <details className="cursor-pointer">
                  <summary className="text-sm font-semibold text-gray-700 mb-2">
                    📝 Raw Configuration (Debug)
                  </summary>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          {/* Test Checklist */}
          <div className="border-t mt-8 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Test Checklist</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={config?.clientId ? 'text-green-600' : 'text-red-600'}>
                  {config?.clientId ? '✓' : '✗'}
                </span>
                <span className={config?.clientId ? 'text-gray-700' : 'text-red-600'}>
                  Client ID is configured
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={config?.plans?.proMonthly ? 'text-green-600' : 'text-red-600'}>
                  {config?.plans?.proMonthly ? '✓' : '✗'}
                </span>
                <span className={config?.plans?.proMonthly ? 'text-gray-700' : 'text-red-600'}>
                  Pro Monthly Plan ID is set
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={config?.plans?.proYearly ? 'text-green-600' : 'text-red-600'}>
                  {config?.plans?.proYearly ? '✓' : '✗'}
                </span>
                <span className={config?.plans?.proYearly ? 'text-gray-700' : 'text-red-600'}>
                  Pro Yearly Plan ID is set
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={config?.plans?.businessMonthly ? 'text-green-600' : 'text-red-600'}>
                  {config?.plans?.businessMonthly ? '✓' : '✗'}
                </span>
                <span className={config?.plans?.businessMonthly ? 'text-gray-700' : 'text-red-600'}>
                  Business Monthly Plan ID is set
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={config?.plans?.businessYearly ? 'text-green-600' : 'text-red-600'}>
                  {config?.plans?.businessYearly ? '✓' : '✗'}
                </span>
                <span className={config?.plans?.businessYearly ? 'text-gray-700' : 'text-red-600'}>
                  Business Yearly Plan ID is set
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
