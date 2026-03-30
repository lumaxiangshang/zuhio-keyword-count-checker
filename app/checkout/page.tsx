'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import paypalConfig, { type PlanKey } from '@/lib/paypal-config';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planKey = (searchParams.get('plan') as PlanKey) || 'proMonthly';
  const plan = paypalConfig.plans[planKey] || paypalConfig.plans.proMonthly;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // 未登录，重定向到登录页
        router.push('/?login=true');
        return;
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubscribe = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 调用 API 创建订阅
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.success && data.approvalUrl) {
        // 重定向到 PayPal 审批页面
        window.location.href = data.approvalUrl;
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (err: any) {
      console.error('Subscribe error:', err);
      setError(err.message || 'Network error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-white/80 hover:text-white">
            <span className="text-2xl">←</span>
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Checkout Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Plan Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Subscription
            </h1>
            <p className="text-gray-600">
              You're subscribing to the <span className="font-semibold text-purple-600">{plan.name}</span> plan
            </p>
          </div>

          {/* Plan Details */}
          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Plan</span>
              <span className="text-lg font-bold text-gray-900">{plan.name} {plan.billingCycle}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Price</span>
              <span className="text-2xl font-bold text-purple-600">
                ${plan.price}
                <span className="text-sm text-gray-500">/{plan.billingCycle === 'MONTHLY' ? 'month' : 'year'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Billing</span>
              <span className="text-gray-900">
                {plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'} 
                {plan.billingCycle === 'YEARLY' && <span className="ml-2 text-green-600 text-sm font-medium">(Save 17%)</span>}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included:</h3>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* User Email */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Subscribing with:</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={processing || !user}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              `Subscribe with PayPal - $${plan.price}`
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure payment processed by PayPal
            </p>
            <p className="text-xs text-gray-400 mt-2">
              You'll be redirected to PayPal to complete your subscription
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <Link href="/pricing" className="hover:text-white underline">
            Compare Plans
          </Link>
          <span className="mx-2">•</span>
          <Link href="/" className="hover:text-white underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
