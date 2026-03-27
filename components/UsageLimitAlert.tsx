'use client';

import { useState } from 'react';
import UpgradeModal from './UpgradeModal';

interface UsageLimitAlertProps {
  used: number;
  limit: number;
  plan: 'free' | 'pro' | 'business';
}

export default function UsageLimitAlert({ used, limit, plan }: UsageLimitAlertProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const percentage = Math.min((used / limit) * 100, 100);

  if (plan !== 'free' && plan !== 'pro') return null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Today's Usage
          </span>
          <span className="text-sm text-gray-500">
            {used}/{limit} analyses
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage > 90
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : percentage > 70
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Warning Message */}
        {percentage >= 80 && (
          <div className="flex items-center justify-between mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-sm text-yellow-800 font-medium">
                {percentage >= 100
                  ? "You've used all your free analyses today"
                  : `Almost there! ${limit - used} analyses remaining`}
              </span>
            </div>
            {percentage < 100 && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-sm text-purple-600 font-medium hover:text-purple-700 whitespace-nowrap ml-2"
              >
                Upgrade →
              </button>
            )}
          </div>
        )}

        {/* Limit Reached */}
        {percentage >= 100 && (
          <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-800 font-medium mb-2">
              Daily limit reached! 🎯
            </p>
            <p className="text-sm text-red-600 mb-3">
              Upgrade to Pro for unlimited analyses
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Upgrade to Pro - $9.99/mo
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Unlimited Analyses"
      />
    </>
  );
}
