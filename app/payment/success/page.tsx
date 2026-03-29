'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const credits = searchParams.get('credits');

    if (orderId && credits) {
      // 调用 API 捕获支付
      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            setMessage(`支付成功！${credits} 积分已添加到您的账户。`);
          } else {
            setStatus('error');
            setMessage(data.error || '支付处理失败');
          }
        })
        .catch(err => {
          console.error('Capture error:', err);
          setStatus('error');
          setMessage('网络错误，请稍后重试');
        });
    } else {
      setStatus('error');
      setMessage('缺少订单信息');
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">处理支付中...</h1>
          <p className="text-gray-600">请稍候，我们正在确认您的支付</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">支付成功！</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              前往 Dashboard
            </Link>
            <Link
              href="/credits"
              className="block w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              继续购买积分
            </Link>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">支付处理失败</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              href="/credits"
              className="block w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              重试支付
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              返回 Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">加载中...</h1>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
