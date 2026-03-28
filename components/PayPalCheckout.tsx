'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import paypalConfig from '@/lib/paypal-config';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const paypalRef = useRef<any>(null);

  // 加载 PayPal SDK
  useEffect(() => {
    const clientId = paypalConfig.clientId;
    
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
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=subscription&vault=true`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError('Failed to load PayPal SDK');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 渲染 PayPal 按钮
  useEffect(() => {
    if (!loaded || !window.paypal || !containerRef.current) {
      return;
    }

    // 清理之前的按钮
    if (paypalRef.current) {
      paypalRef.current.close();
    }

    try {
      paypalRef.current = window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: function(data: any, actions: any) {
          console.log('Creating subscription with plan:', planId);
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: async function(data: any, actions: any) {
          console.log('Subscription approved:', data);
          
          try {
            const response = await fetch('/api/paypal/activate-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionID: data.subscriptionID,
                planId,
              }),
            });

            const result = await response.json();
            
            if (result.success) {
              console.log('Subscription activated:', result);
              if (onSuccess) onSuccess();
              router.push('/dashboard?subscription=success');
            } else {
              console.error('Activation failed:', result.error);
              setError(result.error || 'Failed to activate subscription');
            }
          } catch (err: any) {
            console.error('Activation error:', err);
            setError('Network error. Please try again.');
          }
        },
        onError: function(err: any) {
          console.error('PayPal Error:', err);
          setError('Payment failed. Please try again or use a different payment method.');
        },
      });

      paypalRef.current.render('#paypal-button-container');
    } catch (err: any) {
      console.error('Failed to initialize PayPal buttons:', err);
      setError('Failed to initialize PayPal. Please refresh the page.');
    }

    return () => {
      if (paypalRef.current) {
        paypalRef.current.close();
      }
    };
  }, [loaded, planId, router, onSuccess]);

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
      <div ref={containerRef} id="paypal-button-container" className="w-full"></div>
      
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
