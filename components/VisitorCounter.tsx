'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/i18n';

interface VisitorCounterProps {
  language: Language;
}

export default function VisitorCounter({ language }: VisitorCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 从 localStorage 获取上次访问计数
    const stored = localStorage.getItem('zuhio_visitor_count');
    const lastVisit = localStorage.getItem('zuhio_last_visit');
    const now = Date.now();
    
    // 如果是新访客或超过 24 小时，增加计数
    if (!lastVisit || (now - parseInt(lastVisit)) > 24 * 60 * 60 * 1000) {
      // 模拟访客计数（实际应该用后端 API）
      const baseCount = 12580; // 基础访客数
      const dailyVisitors = Math.floor(Math.random() * 50) + 100; // 每日新增
      const newCount = baseCount + dailyVisitors;
      setVisitorCount(newCount);
      localStorage.setItem('zuhio_visitor_count', newCount.toString());
      localStorage.setItem('zuhio_last_visit', now.toString());
    } else {
      // 使用存储的计数
      setVisitorCount(parseInt(stored || '12580'));
    }
  }, []);

  const visitorText = language === 'zh' 
    ? `${visitorCount.toLocaleString()}+ ${language === 'zh' ? '访客' : 'visitors'}`
    : language === 'fr'
    ? `${visitorCount.toLocaleString()}+ visiteurs`
    : language === 'de'
    ? `${visitorCount.toLocaleString()}+ Besucher`
    : `${visitorCount.toLocaleString()}+ visitors`;

  if (!isClient) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 border border-purple-200">
        <div className="flex items-center gap-3">
          {/* 在线图标 */}
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          
          {/* 访客数 */}
          <div className="text-sm">
            <div className="text-gray-500 text-xs">
              {language === 'zh' ? '今日访客' : language === 'fr' ? 'Visiteurs aujourd\'hui' : language === 'de' ? 'Besucher heute' : 'Visitors today'}
            </div>
            <div className="font-bold text-gray-800">{visitorText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
