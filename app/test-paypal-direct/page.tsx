'use client';

import { useState } from 'react';

export default function TestPaypalDirectPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testCreateOrder = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/paypal/create-order-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits: 100,
          price: 9.99,
        }),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = JSON.parse(text);
      setResult(data);
    } catch (err: any) {
      console.error('Test error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          PayPal API 直接测试
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            测试 create-order-lite API
          </h2>

          <button
            onClick={testCreateOrder}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '测试中...' : '运行测试'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2">❌ 错误</h3>
              <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">✅ 成功</h3>
              <pre className="text-green-700 text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            使用说明
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>点击 "运行测试" 按钮</li>
            <li>查看返回结果</li>
            <li>如果成功，应该看到 orderId 和 approvalUrl</li>
            <li>如果失败，查看错误信息并报告</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">📋 测试详情</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>API: /api/paypal/create-order-lite</li>
              <li>方法：POST</li>
              <li>参数：credits=100, price=9.99</li>
              <li>不依赖数据库</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
