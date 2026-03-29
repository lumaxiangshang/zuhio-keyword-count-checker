'use client';

import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import GoogleLogin from './GoogleLogin';
import { Language } from '@/lib/i18n';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - 左侧 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl block leading-tight">Zuhio</span>
              <span className="text-white/60 text-xs block -mt-1">SEO Tool</span>
            </div>
          </div>

          {/* Desktop Navigation - 右侧：登录 + 语言 */}
          <div className="hidden md:flex items-center gap-4">
            {/* 登录组件 */}
            <GoogleLogin />
            
            {/* 分隔线 */}
            <div className="w-px h-8 bg-white/20"></div>
            
            {/* 语言切换器 */}
            <LanguageSwitcher 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/20 space-y-4 animate-fade-in">
            {/* 登录组件（移动端） */}
            <div className="flex justify-center">
              <GoogleLogin />
            </div>
            
            {/* 分隔线 */}
            <div className="w-full h-px bg-white/20"></div>
            
            {/* 语言切换器（移动端） */}
            <div className="flex justify-center">
              <LanguageSwitcher 
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
