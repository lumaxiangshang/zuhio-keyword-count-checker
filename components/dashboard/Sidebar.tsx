'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/dashboard/history',
      label: 'History',
      icon: '📜',
    },
    {
      path: '/dashboard/subscription',
      label: 'Subscription',
      icon: '💎',
    },
    {
      path: '/dashboard/settings',
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 使用进度 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Daily Usage</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: '70%' }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">7/10 analyses used</div>
        </div>
      </nav>
    </aside>
  );
}
