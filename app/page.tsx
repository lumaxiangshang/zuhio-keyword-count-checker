'use client';

import { useState, useEffect } from 'react';
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔍 Zuhio Keyword Count Checker
          </h1>
          <p className="text-white/80 text-lg">
            Free online tool to analyze word count, keyword density, and SEO optimization
          </p>
        </div>

        {/* Text Input */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here to start analyzing..."
            className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none transition-colors"
          />
          
          {/* Keyword Input */}
          <div className="mt-4 flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword to analyze density..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
            <button
              onClick={() => setText('')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {results && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <StatCard label="Words" value={results.wordCount.toLocaleString()} />
              <StatCard label="Characters" value={results.charCount.toLocaleString()} />
              <StatCard label="No Spaces" value={results.charCountNoSpaces.toLocaleString()} />
              <StatCard label="Sentences" value={results.sentenceCount.toLocaleString()} />
              <StatCard label="Paragraphs" value={results.paragraphCount.toLocaleString()} />
              <StatCard label="Read Time" value={`${results.readingTime} min`} />
            </div>

            {/* Keyword Density */}
            {keyword && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Keyword Density</h2>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-purple-600">{density}%</span>
                  <span className="text-gray-600">
                    {density < 0.5 ? '⚠️ Too low' : density > 4 ? '⚠️ Too high' : '✅ Good'}
                  </span>
                </div>
              </div>
            )}

            {/* Top Keywords */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Top Keywords</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold">Keyword</th>
                      <th className="text-left py-3 px-4 font-semibold">Count</th>
                      <th className="text-left py-3 px-4 font-semibold">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.topKeywords.map((item: any, index: number) => (
                      <tr key={item.word} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">#{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{item.word}</td>
                        <td className="py-3 px-4 text-gray-600">{item.count}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            item.density > 4 ? 'bg-red-100 text-red-700' :
                            item.density > 2.5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.density}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && (
          <div className="text-center text-white/60 mt-8">
            <p className="text-lg">Start typing or paste your text to see the analysis</p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-white/60 mt-12">
          <p>© 2026 Zuhio Keyword Count Checker. Free SEO Tool.</p>
        </footer>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <h3 className="text-gray-500 text-sm font-medium mb-2">{label}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
