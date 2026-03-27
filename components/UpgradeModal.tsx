'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-2xl font-bold mb-2">
            {feature ? `Unlock ${feature}` : 'Upgrade to Pro'}
          </h2>
          <p className="text-white/80">
            Get unlimited access to all features
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-purple-600 rounded-full relative transition-colors"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                billingCycle === 'yearly' ? 'left-6' : 'left-0.5'
              }`}></div>
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs ml-1">-17%</span>
            </span>
          </div>

          {/* Features List */}
          <ul className="space-y-3 mb-6">
            {[
              'Unlimited analyses',
              'Export reports (PDF/CSV)',
              '30-day history',
              'Bulk analysis (5 articles)',
              'Keyword templates',
              'Priority support',
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">
                ${billingCycle === 'monthly' ? '9.99' : '99'}
              </span>
              <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-green-600 text-sm font-medium">
                Save $20.88 per year
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/pricing')}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Start 7-Day Free Trial
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure payment
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              7-day refund
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.5 15.5L12 12m0 0l-3.5-3.5M12 12l3.5 3.5M12 12l-3.5-3.5" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
