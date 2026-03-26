'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔍</span>
            <span className="text-white font-bold text-xl">Zuhio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="https://github.com/lumaxiangshang/zuhio-keyword-count-checker" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-white/80 hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white/80 hover:text-white"
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
          <div className="md:hidden py-4 border-t border-white/20">
            <a href="#features" className="block py-2 text-white/80 hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="block py-2 text-white/80 hover:text-white">
              How It Works
            </a>
            <a href="https://github.com/lumaxiangshang/zuhio-keyword-count-checker" 
               target="_blank" 
               rel="noopener noreferrer"
               className="block py-2 text-white/80 hover:text-white">
              GitHub
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
