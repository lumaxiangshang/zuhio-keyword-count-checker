'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PayPalCheckoutProps {
  planId: string;
  planName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  onSuccess?: () => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalCheckout({
  planId,
  planName,
  price,
  billingCycle,
  onSuccess,
}: PayPalCheckoutProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载 PayPal SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      setError('PayPal Client ID not configured');
      return;
    }

    // 检查是否已加载
    if (window.paypal) {
      setLoaded(true);
      return;
    }

    // 动态加载 PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=subscription`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError('Failed to load PayPal SDK');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleApprove = async (data: any, actions: any) => {
    try {
      // 捕获订单
      const details = await actions.order.capture();
      
      if (details.status === 'COMPLETED') {
        // 调用后端 API 记录订阅
        const response = await fetch('/api/paypal/activate-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderID,
            planId,
            details,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          // 成功，跳转到 Dashboard
          if (onSuccess) onSuccess();
          router.push('/dashboard?subscription=success');
        } else {
          setError(result.error || 'Failed to activate subscription');
        }
      }
    } catch (err: any) {
      console.error('PayPal Approval Error:', err);
      setError('Payment failed. Please try again.');
    }
  };

  const handleError = (err: any) => {
    console.error('PayPal Error:', err);
    setError('Payment failed. Please try again or use a different payment method.');
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="paypal-button-container" className="w-full"></div>
      
      {/* PayPal 按钮会通过 SDK 自动渲染到上面的容器中 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'blue',
                layout: 'vertical',
                label: 'subscribe',
              },
              createSubscription: function(data, actions) {
                return actions.subscription.create({
                  plan_id: '${planId}'
                });
              },
              onApprove: function(data, actions) {
                return fetch('/api/paypal/activate-subscription', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    subscriptionID: data.subscriptionID,
                    planId: '${planId}'
                  })
                }).then(function(res) {
                  return res.json();
                }).then(function(result) {
                  if (result.success) {
                    window.location.href = '/dashboard?subscription=success';
                  } else {
                    alert('Failed to activate subscription: ' + result.error);
                  }
                });
              },
              onError: function(err) {
                console.error('PayPal Error:', err);
                alert('Payment failed. Please try again.');
              }
            }).render('#paypal-button-container');
          `,
        }}
      />
      
      {/* 信任标识 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Buyer Protection
        </span>
      </div>
    </div>
  );
}
