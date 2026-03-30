'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import paypalConfig from '@/lib/paypal-config';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [usageStats, setUsageStats] = useState({ today: 0, total: 0, limit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }
      setUser(firebaseUser);
      
      // 获取用户完整信息（包括订阅）
      fetch(`/api/user/me`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setDbUser(data.user);
            setSubscription(data.subscription);
            setUsageStats(data.usageStats || { today: 0, total: 0, limit: 0 });
          }
        })
        .catch(err => {
          console.error('Get user error:', err);
          // 如果 API 不存在，使用本地数据
          setDbUser({
            subscriptionPlan: 'FREE',
            subscriptionStatus: 'INACTIVE',
          });
        })
        .finally(() => setLoading(false));
    });

    return () => unsubscribe();
  }, [router]);

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

  const isSubscribed = dbUser?.subscriptionStatus === 'ACTIVE' && 
                       (dbUser?.subscriptionPlan === 'PRO');
  
  const planName = dbUser?.subscriptionPlan || 'FREE';
  const subscriptionStatus = dbUser?.subscriptionStatus || 'INACTIVE';
  
  // 计算剩余次数
  const remainingToday = isSubscribed ? '∞' : Math.max(0, 3 - usageStats.today);
  const resetTime = 'Tomorrow at 00:00';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <span className="text-xl">🔍</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Zuhio</span>
            </Link>

            {/* 用户信息 */}
            <div className="flex items-center gap-4">
              {isSubscribed && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  PRO
                </span>
              )}
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border-2 border-purple-200"
                />
              )}
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                退出
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎语 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your account overview
          </p>
        </div>

        {/* 订阅状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 订阅计划 */}
          <div className={`rounded-xl shadow-sm border p-6 ${
            isSubscribed 
              ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white border-transparent' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <span className={`text-sm ${isSubscribed ? 'text-white/80' : 'text-gray-600'}`}>Plan</span>
            </div>
            <p className="text-2xl font-bold">{planName}</p>
            {isSubscribed && (
              <p className="text-sm text-white/80 mt-1">Active Subscription</p>
            )}
          </div>

          {/* 今日使用 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📈</span>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {usageStats.today} / {remainingToday}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isSubscribed ? 'Unlimited' : `Resets ${resetTime}`}
            </p>
          </div>

          {/* 总使用量 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{usageStats.total}</p>
            <p className="text-sm text-gray-500 mt-1">Analyses performed</p>
          </div>
        </div>

        {/* 订阅升级提示（非订阅用户） */}
        {!isSubscribed && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 Upgrade to Pro for Unlimited Access</h3>
                <p className="text-white/80">
                  Get unlimited keyword analyses, export reports, and 30-day history
                </p>
              </div>
              <Link 
                href="/pricing"
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                View Plans →
              </Link>
            </div>
          </div>
        )}

        {/* 订阅详情（订阅用户） */}
        {isSubscribed && subscription && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <p className="text-lg font-semibold text-gray-900">
                  PRO {subscription.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.currentPeriodEnd 
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${subscription.amount}/{subscription.billingCycle === 'MONTHLY' ? 'mo' : 'yr'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 开始分析 */}
          <Link href="/" className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">🔍 Start Analyzing</h3>
            <p className="text-white/80 mb-4">
              {isSubscribed ? 'Unlimited keyword density checks' : `${remainingToday} checks remaining today`}
            </p>
            <span className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg font-medium">
              Go to Analyzer →
            </span>
          </Link>

          {/* 订阅管理 */}
          <Link href="/pricing" className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">📈 Manage Subscription</h3>
            <p className="text-white/80 mb-4">
              {isSubscribed ? 'Upgrade or change your plan' : 'Unlock unlimited analyses'}
            </p>
            <span className="inline-block px-4 py-2 bg-white text-green-600 rounded-lg font-medium">
              {isSubscribed ? 'Manage Plan →' : 'View Plans →'}
            </span>
          </Link>
        </div>

        {/* 定价计划对比 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`border rounded-xl p-6 ${
              planName === 'FREE' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">$0</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  3 analyses / day
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Basic keyword density
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Word count stats
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-300">✗</span>
                  Export results
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-300">✗</span>
                  History tracking
                </li>
              </ul>
              {planName === 'FREE' && (
                <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  Current Plan
                </button>
              )}
            </div>

            {/* Pro Plan */}
            <div className={`border-2 rounded-xl p-6 ${
              planName === 'PRO' ? 'border-purple-500 bg-purple-50' : 'border-purple-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  Popular
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">$9.99</p>
              <p className="text-sm text-gray-500 mb-4">/ month</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Unlimited analyses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Export PDF/CSV
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  30-day history
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Advanced reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Email support
                </li>
              </ul>
              {planName === 'PRO' ? (
                <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  Current Plan
                </button>
              ) : (
                <Link href="/pricing?plan=proMonthly" className="block w-full py-2 bg-purple-600 text-white text-center rounded-lg font-medium hover:bg-purple-700">
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">1</span>
              <div>
                <p className="font-medium text-gray-900">Analyze Text</p>
                <p>Use our keyword density checker on the home page</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">2</span>
              <div>
                <p className="font-medium text-gray-900">Track Usage</p>
                <p>Monitor your daily and total analyses in this dashboard</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</span>
              <div>
                <p className="font-medium text-gray-900">Upgrade to Pro</p>
                <p>Get unlimited analyses for just $9.99/month</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
