'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Features from '@/components/Features';
import SEOGuide from '@/components/SEOGuide';
import VisitorCounter from '@/components/VisitorCounter';
import { analyzeText, calculateKeywordDensity } from '@/lib/analyzer';
import { translations, Language } from '@/lib/i18n';
import paypalConfig from '@/lib/paypal-config';

// 免费用户每日限制次数
const FREE_DAILY_LIMIT = 3;

export default function Home() {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [density, setDensity] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  
  // 订阅状态
  const [subscriptionPlan, setSubscriptionPlan] = useState<'FREE' | 'PRO' | 'BUSINESS'>('FREE');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'INACTIVE' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'>('INACTIVE');
  const [dailyUsage, setDailyUsage] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const t = translations[language];

  // 初始化：检查订阅状态和使用记录
  useEffect(() => {
    // 从 localStorage 获取用户信息
    const user = localStorage.getItem('zuhio_user');
    if (user) {
      const userData = JSON.parse(user);
      setUserEmail(userData.email || '');
      setSubscriptionPlan(userData.subscriptionPlan || 'FREE');
      setSubscriptionStatus(userData.subscriptionStatus || 'INACTIVE');
    }

    // 从 localStorage 获取今日使用次数
    const today = new Date().toDateString();
    const stored = localStorage.getItem('zuhio_usage');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setDailyUsage(count);
      } else {
        // 新的一天，重置计数
        localStorage.setItem('zuhio_usage', JSON.stringify({ date: today, count: 0 }));
        setDailyUsage(0);
      }
    } else {
      localStorage.setItem('zuhio_usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  // 分析文本
  useEffect(() => {
    if (text.trim()) {
      // 检查使用限制
      const isSubscribed = subscriptionStatus === 'ACTIVE' && (subscriptionPlan === 'PRO' || subscriptionPlan === 'BUSINESS');
      const dailyLimit = isSubscribed ? 999999 : FREE_DAILY_LIMIT;

      if (dailyUsage >= dailyLimit) {
        setShowUpgradeModal(true);
        return;
      }

      const analysis = analyzeText(text);
      setResults(analysis);
      if (keyword.trim()) {
        setDensity(calculateKeywordDensity(text, keyword));
      }

      // 增加使用次数
      const today = new Date().toDateString();
      const newCount = dailyUsage + 1;
      localStorage.setItem('zuhio_usage', JSON.stringify({ date: today, count: newCount }));
      setDailyUsage(newCount);
    } else {
      setResults(null);
      setDensity(0);
    }
  }, [text, keyword, dailyUsage, subscriptionPlan, subscriptionStatus]);

  const getDensityStatus = (value: number) => {
    if (value < 0.5) return { text: t.densityTooLow, color: 'text-red-600' };
    if (value > 4) return { text: t.densityTooHigh, color: 'text-red-600' };
    return { text: t.densityGood, color: 'text-green-600' };
  };

  const densityStatus = getDensityStatus(density);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleUpgrade = (planKey: keyof typeof paypalConfig.plans) => {
    // 重定向到定价页面
    window.location.href = `/pricing?plan=${planKey}`;
  };

  const remainingUses = Math.max(0, FREE_DAILY_LIMIT - dailyUsage);
  const isSubscribed = subscriptionStatus === 'ACTIVE' && (subscriptionPlan === 'PRO' || subscriptionPlan === 'BUSINESS');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <Header currentLanguage={language} onLanguageChange={handleLanguageChange} />
      
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {t.heroDescription}
            </p>
            
            {/* 订阅状态提示 */}
            <div className="mt-6 flex items-center justify-center gap-4">
              {isSubscribed ? (
                <div className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white text-sm">
                  ✨ {subscriptionPlan} {language === 'zh' ? '计划' : 'Plan'} - {language === 'zh' ? '无限使用' : 'Unlimited Usage'}
                </div>
              ) : (
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                  📊 {language === 'zh' ? `今日剩余：${remainingUses} 次` : `Remaining Today: ${remainingUses}`}
                </div>
              )}
              
              {!isSubscribed && (
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm font-medium transition-colors"
                >
                  {language === 'zh' ? '升级无限使用 →' : 'Upgrade for Unlimited →'}
                </button>
              )}
            </div>
            
            {/* SEO Keywords Bar */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-white/60">
              <span className="px-3 py-1 bg-white/10 rounded-full">Free Keyword Density Checker</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Word Count Tool</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">SEO Analyzer</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Content Optimizer</span>
            </div>
          </div>

          {/* Main Analyzer */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textareaPlaceholder}
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none transition-colors"
            />
            
            {/* Controls */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t.keywordPlaceholder}
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setText('')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                {t.clearAll}
              </button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <StatCard label={t.words} value={results.wordCount.toLocaleString()} delay={0} />
                <StatCard label={t.characters} value={results.charCount.toLocaleString()} delay={100} />
                <StatCard label={t.charactersNoSpaces} value={results.charCountNoSpaces.toLocaleString()} delay={200} />
                <StatCard label={t.sentences} value={results.sentenceCount.toLocaleString()} delay={300} />
                <StatCard label={t.paragraphs} value={results.paragraphCount.toLocaleString()} delay={400} />
                <StatCard label={t.readingTime} value={`${results.readingTime} ${t.minutes}`} delay={500} />
              </div>

              {/* Keyword Density */}
              {keyword && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">{t.keywordDensity}</h2>
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
                  <h2 className="text-2xl font-bold text-gray-800">{t.topKeywords}</h2>
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.count}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.density}</th>
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
              <p className="text-xl">{t.emptyStateTitle}</p>
              <p className="text-white/50 mt-2">{t.emptyStateSubtitle}</p>
            </div>
          )}

          {/* Pricing CTA */}
          {!isSubscribed && (
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'zh' ? '🚀 升级 Pro，解锁无限使用！' : '🚀 Upgrade to Pro for Unlimited!'}
              </h2>
              <p className="text-lg mb-6 opacity-90">
                {language === 'zh' 
                  ? `每天免费 ${FREE_DAILY_LIMIT} 次，Pro 无限使用 + 导出功能` 
                  : `Free ${FREE_DAILY_LIMIT} uses/day. Pro = Unlimited + Export`}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleUpgrade('proMonthly')}
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  $9.99/{language === 'zh' ? '月' : 'mo'}
                </button>
                <button
                  onClick={() => handleUpgrade('proYearly')}
                  className="px-8 py-4 bg-purple-800 text-white rounded-xl font-bold text-lg hover:bg-purple-900 transition-colors border-2 border-white/30"
                >
                  $99/{language === 'zh' ? '年' : 'yr'} 
                  <span className="ml-2 text-sm opacity-80">{language === 'zh' ? '省 17%' : 'Save 17%'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <Features language={language} />
          </div>

          {/* SEO Guide */}
          <div className="mt-8">
            <SEOGuide language={language} />
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {language === 'zh' ? '为什么选择 Zuhio 关键词密度检查器？' : 'Why Choose Zuhio Keyword Density Checker?'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-white/80">
              {language === 'zh' ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">🎯 专业 SEO 优化</h3>
                    <p className="mb-4">
                      Zuhio 是专业的<strong>关键词密度分析工具</strong>和<strong>词数统计工具</strong>，
                      帮助您优化内容 SEO，提升 Google 搜索排名。免费使用，无需注册。
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">📊 实时分析</h3>
                    <p className="mb-4">
                      输入文本后立即显示<strong>关键词密度</strong>、<strong>词数统计</strong>、
                      <strong>字符数</strong>、<strong>阅读时间</strong>等数据，支持中文和英文分析。
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">💡 智能建议</h3>
                    <p>
                      根据 SEO 行业标准提供<strong>关键词密度建议</strong>，
                      避免关键词堆砌，让内容更自然、更易被搜索引擎收录。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">🚀 适用场景</h3>
                    <ul className="space-y-2">
                      <li>✓ 博客文章 SEO 优化</li>
                      <li>✓ 网站内容关键词分析</li>
                      <li>✓ 学术论文词数统计</li>
                      <li>✓ 社交媒体内容优化</li>
                      <li>✓ 电商产品描述优化</li>
                      <li>✓ 邮件营销内容检查</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">🌐 多语言支持</h3>
                    <p>
                      支持<strong>简体中文</strong>和<strong>English</strong>，
                      适合全球内容创作者、SEO 专家、数字营销人员使用。
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">🎯 Professional SEO Tool</h3>
                    <p className="mb-4">
                      Zuhio is a professional <strong>keyword density checker</strong> and 
                      <strong>word count tool</strong> for SEO optimization. Improve your 
                      Google rankings with our free online analyzer. No registration required.
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">📊 Real-time Analysis</h3>
                    <p className="mb-4">
                      Get instant <strong>keyword density</strong>, <strong>word count</strong>, 
                      <strong>character count</strong>, and <strong>reading time</strong> statistics. 
                      Supports both Chinese and English content analysis.
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">💡 Smart Recommendations</h3>
                    <p>
                      Based on SEO industry standards, we provide <strong>keyword density 
                      recommendations</strong> to avoid keyword stuffing and make your content 
                      more natural and search-engine friendly.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">🚀 Use Cases</h3>
                    <ul className="space-y-2">
                      <li>✓ Blog post SEO optimization</li>
                      <li>✓ Website content keyword analysis</li>
                      <li>✓ Academic paper word count</li>
                      <li>✓ Social media content optimization</li>
                      <li>✓ E-commerce product description</li>
                      <li>✓ Email marketing content check</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">🌐 Multi-language Support</h3>
                    <p>
                      Support for <strong>简体中文</strong> and <strong>English</strong>, 
                      perfect for global content creators, SEO specialists, and digital marketers.
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {/* SEO Keywords Cloud */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-lg font-bold text-white/60 text-center mb-4">
                {language === 'zh' ? '热门 SEO 工具关键词' : 'Popular SEO Tool Keywords'}
              </h3>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-white/50">
                {language === 'zh' ? (
                  <>
                    <span>关键词密度检查器</span>
                    <span>•</span>
                    <span>词数统计工具</span>
                    <span>•</span>
                    <span>SEO 优化器</span>
                    <span>•</span>
                    <span>内容分析工具</span>
                    <span>•</span>
                    <span>免费 SEO 工具</span>
                    <span>•</span>
                    <span>关键词分析</span>
                    <span>•</span>
                    <span>网站优化</span>
                    <span>•</span>
                    <span>Google 排名优化</span>
                    <span>•</span>
                    <span>博客 SEO</span>
                    <span>•</span>
                    <span>内容营销工具</span>
                  </>
                ) : (
                  <>
                    <span>keyword density checker</span>
                    <span>•</span>
                    <span>word count tool</span>
                    <span>•</span>
                    <span>SEO analyzer</span>
                    <span>•</span>
                    <span>content optimizer</span>
                    <span>•</span>
                    <span>free SEO tool</span>
                    <span>•</span>
                    <span>keyword counter</span>
                    <span>•</span>
                    <span>website optimization</span>
                    <span>•</span>
                    <span>Google ranking</span>
                    <span>•</span>
                    <span>blog SEO</span>
                    <span>•</span>
                    <span>content marketing tool</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Visitor Counter */}
          <VisitorCounter language={language} />

          {/* Footer */}
          <footer className="text-center text-white/60 mt-16 py-8 border-t border-white/20">
            <p className="mb-2">{t.footerText}</p>
            <p className="text-sm mb-2">
              {t.footerCredit} | 
              <a href="https://github.com/lumaxiangshang/zuhio-keyword-count-checker" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-white/80 hover:text-white ml-2">
                GitHub
              </a>
            </p>
            <p className="text-xs text-white/40 max-w-4xl mx-auto">
              {language === 'zh' 
                ? 'Zuhio 是免费的关键词密度检查器和词数统计工具，专为 SEO 优化设计。支持中文和英文内容分析，帮助内容创作者、SEO 专家和数字营销人员提升搜索排名。无需注册，立即使用。'
                : 'Zuhio is a free keyword density checker and word count tool designed for SEO optimization. Supports Chinese and English content analysis, helping content creators, SEO specialists, and digital marketers improve search rankings. No registration required, use instantly.'}
            </p>
          </footer>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'zh' ? '今日免费次数已用完' : 'Free Daily Limit Reached'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'zh' 
                  ? `升级 Pro 解锁无限使用 + 高级功能` 
                  : 'Upgrade to Pro for unlimited usage + premium features'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpgrade('proMonthly')}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  $9.99/{language === 'zh' ? '月' : 'mo'} - Pro
                </button>
                <button
                  onClick={() => handleUpgrade('proYearly')}
                  className="w-full px-6 py-3 bg-purple-800 text-white rounded-xl font-medium hover:bg-purple-900 transition-colors"
                >
                  $99/{language === 'zh' ? '年' : 'yr'} - Pro 
                  <span className="ml-2 text-sm opacity-80">{language === 'zh' ? '省 17%' : 'Save 17%'}</span>
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {language === 'zh' ? '稍后再说' : 'Maybe Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
