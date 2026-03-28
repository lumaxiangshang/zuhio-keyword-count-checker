'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PayPalOneTimePaymentProps {
  credits: number;
  price: number;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalOneTimePayment({
  credits,
  price,
  onSuccess,
}: PayPalOneTimePaymentProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const paypalRef = useRef<any>(null);

  console.log('[PayPalOneTimePayment] Render - clientId:', clientId ? 'SET' : 'NOT SET', 'error:', error);

  // 获取 PayPal Client ID
  useEffect(() => {
    console.log('[PayPalOneTimePayment] Fetching config...');
    fetch('/api/paypal/config')
      .then(res => {
        console.log('[PayPalOneTimePayment] Config response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('[PayPalOneTimePayment] Config data:', data);
        if (data.clientId) {
          console.log('[PayPalOneTimePayment] Client ID found, setting state');
          setClientId(data.clientId);
        } else {
          console.error('[PayPalOneTimePayment] Client ID missing in response');
          setError('PayPal Client ID not configured');
        }
      })
      .catch(err => {
        console.error('[PayPalOneTimePayment] Fetch error:', err);
        setError('Failed to load PayPal configuration');
      });
  }, []);

  // 加载 PayPal SDK
  useEffect(() => {
    console.log('[PayPalOneTimePayment] SDK load effect - clientId:', clientId ? 'SET' : 'NOT SET');
    
    if (!clientId) {
      console.log('[PayPalOneTimePayment] No clientId, skipping SDK load');
      return;
    }

    // 检查是否已加载
    if (window.paypal) {
      console.log('[PayPalOneTimePayment] PayPal SDK already loaded');
      setLoaded(true);
      return;
    }

    console.log('[PayPalOneTimePayment] Loading PayPal SDK...');
    // 动态加载 PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => {
      console.log('[PayPalOneTimePayment] PayPal SDK loaded successfully');
      setLoaded(true);
    };
    script.onerror = () => {
      console.error('[PayPalOneTimePayment] PayPal SDK load error');
      setError('Failed to load PayPal SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientId]);

  // 渲染 PayPal 按钮
  useEffect(() => {
    console.log('[PayPalOneTimePayment] Render buttons effect - loaded:', loaded, 'clientId:', clientId ? 'SET' : 'NOT SET');
    
    if (!loaded || !window.paypal || !containerRef.current) {
      console.log('[PayPalOneTimePayment] Skipping button render - conditions not met');
      return;
    }

    // 清理之前的按钮
    if (paypalRef.current) {
      console.log('[PayPalOneTimePayment] Closing previous PayPal buttons');
      paypalRef.current.close();
    }

    try {
      console.log('[PayPalOneTimePayment] Initializing PayPal buttons...');
      paypalRef.current = window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'pay',
        },
        createOrder: async function(data: any, actions: any) {
          console.log('[PayPalOneTimePayment] Creating order - credits:', credits, 'price:', price);
          
          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credits,
              price: price.toString(),
            }),
          });

          const result = await response.json();
          console.log('[PayPalOneTimePayment] Create order response:', result);
          
          if (result.success && result.orderId) {
            console.log('[PayPalOneTimePayment] Order created:', result.orderId);
            return result.orderId;
          } else {
            console.error('[PayPalOneTimePayment] Failed to create order:', result.error);
            throw new Error(result.error || 'Failed to create order');
          }
        },
        onApprove: async function(data: any, actions: any) {
          console.log('[PayPalOneTimePayment] Payment approved:', data);
          
          try {
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderID,
              }),
            });

            const result = await response.json();
            console.log('[PayPalOneTimePayment] Capture response:', result);
            
            if (result.success) {
              console.log('[PayPalOneTimePayment] Payment captured successfully');
              if (onSuccess) onSuccess();
              router.push(`/dashboard?payment=success&credits=${credits}`);
            } else {
              console.error('[PayPalOneTimePayment] Capture failed:', result.error);
              setError(result.error || 'Payment failed. Please try again.');
            }
          } catch (err: any) {
            console.error('[PayPalOneTimePayment] Capture error:', err);
            setError('Network error. Please try again.');
          }
        },
        onError: function(err: any) {
          console.error('[PayPalOneTimePayment] PayPal Error:', err);
          setError('Payment failed. Please try again or use a different payment method.');
        },
      });

      console.log('[PayPalOneTimePayment] Rendering PayPal buttons to container');
      paypalRef.current.render('#paypal-button-container-onetime');
    } catch (err: any) {
      console.error('[PayPalOneTimePayment] Failed to initialize PayPal buttons:', err);
      setError('Failed to initialize PayPal. Please refresh the page.');
    }

    return () => {
      if (paypalRef.current) {
        console.log('[PayPalOneTimePayment] Cleaning up PayPal buttons');
        paypalRef.current.close();
      }
    };
  }, [loaded, credits, price, router, onSuccess]);

  if (error) {
    console.log('[PayPalOneTimePayment] Rendering error state:', error);
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

  if (!loaded || !clientId) {
    console.log('[PayPalOneTimePayment] Rendering loading state - loaded:', loaded, 'clientId:', clientId ? 'SET' : 'NOT SET');
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  console.log('[PayPalOneTimePayment] Rendering PayPal container');
  return (
    <div className="w-full">
      <div ref={containerRef} id="paypal-button-container-onetime" className="w-full"></div>
      
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
