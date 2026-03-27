'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { Language } from '@/lib/i18n';
import Sidebar from '@/components/dashboard/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  // 模拟用户数据（后续会从 Firestore 获取）
  const [stats, setStats] = useState({
    todayUsage: 7,
    dailyLimit: 10,
    plan: 'free' as const,
    totalAnalyses: 42,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (!currentUser) {
        router.push('/');
        return;
      }
      setUser(currentUser);
      setLoading(false);
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
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <span className="text-xl">🔍</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Zuhio</span>
            </div>

            {/* 用户信息 */}
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-800">
                ← Back to Home
              </a>
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边栏 */}
          <Sidebar currentPath="dashboard" />

          {/* 主内容区 */}
          <main className="flex-1">
            {/* 欢迎语 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your account today.
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard
                label="Today's Usage"
                value={`${stats.todayUsage}/${stats.dailyLimit}`}
                description="Analyses used today"
                icon="📊"
                color="purple"
              />
              <StatsCard
                label="Current Plan"
                value={stats.plan === 'free' ? 'Free' : stats.plan === 'pro' ? 'Pro' : 'Enterprise'}
                description={stats.plan === 'free' ? 'Upgrade for more features' : 'Active subscription'}
                icon="💎"
                color={stats.plan === 'free' ? 'gray' : 'blue'}
              />
              <StatsCard
                label="Total Analyses"
                value={stats.totalAnalyses.toLocaleString()}
                description="All time"
                icon="📈"
                color="green"
              />
            </div>

            {/* 最近活动 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <a href="/dashboard/history" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View all →
                </a>
              </div>
              <RecentActivity />
            </div>

            {/* 升级提示 */}
            {stats.plan === 'free' && (
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-white/80 mb-4">
                      Get unlimited analyses, export reports, and access advanced features.
                    </p>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-center gap-2">
                        <span>✅</span> Unlimited analyses
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✅</span> Export to PDF/CSV
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✅</span> 30-day history
                      </li>
                    </ul>
                  </div>
                  <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-white/90 transition-colors">
                    Upgrade - $4.99/mo
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
