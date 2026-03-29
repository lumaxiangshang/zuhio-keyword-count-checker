'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }
      setUser(firebaseUser);
      
      // 获取数据库用户信息
      fetch(`/api/auth/callback?email=${encodeURIComponent(firebaseUser.email!)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbUser(data.user);
          }
        })
        .catch(err => console.error('Get user error:', err))
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
              <Link href="/" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
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
            Here's your account overview.
          </p>
        </div>

        {/* 用户信息卡片 */}
        {dbUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 积分卡片 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{dbUser.credits}</p>
                </div>
              </div>
            </div>

            {/* 订阅计划卡片 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="text-2xl font-bold text-gray-900">{dbUser.subscriptionPlan || 'FREE'}</p>
                </div>
              </div>
            </div>

            {/* 订阅状态卡片 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900">{dbUser.subscriptionStatus || 'INACTIVE'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 购买积分 */}
          <Link href="/credits" className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">💰 Buy Credits</h3>
            <p className="text-white/80 mb-4">Purchase credits for keyword analysis</p>
            <span className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg font-medium">
              Get Started →
            </span>
          </Link>

          {/* 订阅计划 */}
          <Link href="/pricing" className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">📈 Subscription Plans</h3>
            <p className="text-white/80 mb-4">Unlimited analyses with Pro plan</p>
            <span className="inline-block px-4 py-2 bg-white text-green-600 rounded-lg font-medium">
              View Plans →
            </span>
          </Link>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">1</span>
              <div>
                <p className="font-medium text-gray-900">Analyze Text</p>
                <p>Use our free keyword density checker on the home page</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">2</span>
              <div>
                <p className="font-medium text-gray-900">Buy Credits</p>
                <p>Purchase credits when you need more analyses</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</span>
              <div>
                <p className="font-medium text-gray-900">Upgrade Plan</p>
                <p>Get unlimited analyses with Pro or Business subscription</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
