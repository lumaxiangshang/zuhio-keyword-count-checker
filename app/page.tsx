'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Features from '@/components/Features';
import SEOGuide from '@/components/SEOGuide';
import { analyzeText, calculateKeywordDensity } from '@/lib/analyzer';

export default function Home() {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [density, setDensity] = useState(0);

  useEffect(() => {
    if (text.trim()) {
      const analysis = analyzeText(text);
      setResults(analysis);
      if (keyword.trim()) {
        setDensity(calculateKeywordDensity(text, keyword));
      }
    } else {
      setResults(null);
      setDensity(0);
    }
  }, [text, keyword]);

  const getDensityStatus = (value: number) => {
    if (value < 0.5) return { text: '⚠️ Too low', color: 'text-red-600' };
    if (value > 4) return { text: '⚠️ Too high', color: 'text-red-600' };
    return { text: '✅ Good', color: 'text-green-600' };
  };

  const densityStatus = getDensityStatus(density);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <Header />
      
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              🔍 Zuhio Keyword Count Checker
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Free online tool to analyze word count, keyword density, and SEO optimization for your content
            </p>
          </div>

          {/* Main Analyzer */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to start analyzing...

Try pasting an article, blog post, or any content you want to analyze. The tool will automatically count words, characters, sentences, and extract top keywords."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none transition-colors"
            />
            
            {/* Controls */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword to analyze density (e.g., 'SEO', 'marketing')"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setText('')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <StatCard label="Words" value={results.wordCount.toLocaleString()} delay={0} />
                <StatCard label="Characters" value={results.charCount.toLocaleString()} delay={100} />
                <StatCard label="No Spaces" value={results.charCountNoSpaces.toLocaleString()} delay={200} />
                <StatCard label="Sentences" value={results.sentenceCount.toLocaleString()} delay={300} />
                <StatCard label="Paragraphs" value={results.paragraphCount.toLocaleString()} delay={400} />
                <StatCard label="Read Time" value={`${results.readingTime} min`} delay={500} />
              </div>

              {/* Keyword Density */}
              {keyword && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Keyword Density</h2>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div>
                      <span className="text-5xl font-bold text-purple-600">{density}%</span>
                    </div>
                    <div className={`text-xl font-medium ${densityStatus.color}`}>
                      {densityStatus.text}
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        density > 4 ? 'bg-red-500' : 
                        density > 2.5 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(density * 25, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Top Keywords Table */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Top Keywords</h2>
                  <span className="text-sm text-gray-500">
                    Showing top {results.topKeywords.length} keywords
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Keyword</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Count</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Density</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.topKeywords.map((item: any, index: number) => {
                        const statusColor = item.density > 4 ? 'bg-red-100 text-red-700' :
                                          item.density > 2.5 ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-green-100 text-green-700';
                        return (
                          <tr key={item.word} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-600 font-medium">#{index + 1}</td>
                            <td className="py-3 px-4 font-semibold text-gray-800">{item.word}</td>
                            <td className="py-3 px-4 text-gray-600">{item.count}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                {item.density}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-500">
                                {item.density > 4 ? '⚠️ High' : item.density > 2.5 ? '⚠️ Medium' : '✅ Good'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!results && (
            <div className="text-center text-white/60 py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl">Start typing or paste your text to see the analysis</p>
              <p className="text-white/50 mt-2">Real-time updates as you type</p>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <Features />
          </div>

          {/* SEO Guide */}
          <div className="mt-8">
            <SEOGuide />
          </div>

          {/* Footer */}
          <footer className="text-center text-white/60 mt-16 py-8 border-t border-white/20">
            <p className="mb-2">© 2026 Zuhio Keyword Count Checker. Free SEO Tool.</p>
            <p className="text-sm">
              Built with Next.js + Tailwind CSS | 
              <a href="https://github.com/lumaxiangshang/zuhio-keyword-count-checker" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-white/80 hover:text-white ml-2">
                View on GitHub
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, delay }: { label: string; value: string | number; delay: number }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">{label}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
