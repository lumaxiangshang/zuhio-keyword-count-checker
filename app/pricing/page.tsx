'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import paypalConfig, { type PlanKey } from '@/lib/paypal-config';

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [loading, setLoading] = useState(true);

  const handleSubscribe = (planKey: PlanKey) => {
    if (!user) {
      // 未登录，重定向到首页登录
      router.push('/?login=true');
      return;
    }
    // 已登录，跳转到结账页面
    router.push(`/checkout?plan=${planKey}`);
  };

  useEffect(() => {
    // 动态导入 Firebase（只在客户端运行）
    let unsubscribe: (() => void) | null = null;
    
    const initAuth = async () => {
      const { onAuthChange } = await import('@/lib/firebase');
      
      unsubscribe = onAuthChange((firebaseUser: any) => {
        setUser(firebaseUser);
        setLoading(false);
      });
    };

    initAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header with Login Status */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <span className="text-xl">🔍</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Zuhio</span>
            </Link>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-800">Home</a>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm text-purple-600 font-medium hover:text-purple-700">
                    Dashboard
                  </Link>
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-purple-200"
                    />
                  )}
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </>
              ) : (
                <Link href="/?login=true" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when you need more
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'MONTHLY' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
              className="w-14 h-8 bg-purple-600 rounded-full relative transition-colors"
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
                billingCycle === 'YEARLY' ? 'left-7' : 'left-1'
              }`}></div>
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'YEARLY' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs ml-1">Save 17%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price={0}
            billingCycle={billingCycle}
            description="Perfect for trying out Zuhio"
            features={[
              { text: '3 analyses per day', included: true },
              { text: 'Basic keyword density', included: true },
              { text: 'Word count statistics', included: true },
              { text: 'Export reports', included: false },
              { text: 'History tracking', included: false },
            ]}
            cta="Start Free"
            highlighted={false}
            onSelect={() => router.push('/')}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price={billingCycle === 'MONTHLY' ? 9.99 : 99}
            billingCycle={billingCycle}
            description="For content creators and SEO professionals"
            features={[
              { text: 'Unlimited analyses', included: true },
              { text: 'Export PDF/CSV', included: true },
              { text: '30-day history', included: true },
              { text: 'Advanced reports', included: true },
              { text: 'Email support', included: true },
            ]}
            cta={billingCycle === 'MONTHLY' ? '$9.99/month' : '$99/year'}
            highlighted={true}
            savings={billingCycle === 'YEARLY' ? 'Save 17% (2 months free!)' : undefined}
            onSelect={() => handleSubscribe(billingCycle === 'MONTHLY' ? 'proMonthly' : 'proYearly')}
            user={user}
          />
        </div>

        {/* Feature Comparison */}
        <FeatureComparison />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your SEO?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Start with 3 free analyses per day. No credit card required.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors"
            >
              Start Analyzing for Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 Zuhio. All rights reserved.</p>
            <p className="mt-2">Free keyword density checker and SEO optimization tool.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Pricing Card Component
function PricingCard({
  name,
  price,
  billingCycle,
  description,
  features,
  cta,
  highlighted,
  savings,
  onSelect,
  user,
}: {
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  description: string;
  features: Array<{ text: string; included: boolean }>;
  cta: string;
  highlighted?: boolean;
  savings?: string;
  onSelect: () => void;
  user?: any;
}) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-8 ${
        highlighted
          ? 'shadow-2xl border-2 border-purple-500 scale-105'
          : 'shadow-lg border border-gray-200'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          {price > 0 ? (
            <>
              <span className="text-5xl font-bold text-gray-900">
                ${price}
              </span>
              <span className="text-gray-500">/{billingCycle === 'MONTHLY' ? 'month' : 'year'}</span>
            </>
          ) : (
            <span className="text-5xl font-bold text-gray-900">Free</span>
          )}
        </div>
        {savings && (
          <p className="text-green-600 text-sm font-medium">{savings}</p>
        )}
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className={`text-lg ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
              {feature.included ? '✓' : '✗'}
            </span>
            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 text-center rounded-lg font-bold transition-colors ${
          highlighted
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
            : name === 'Free'
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {cta}
      </button>
      
      {!user && highlighted && (
        <p className="text-center text-xs text-gray-500 mt-3">
          🔒 Sign in required to subscribe
        </p>
      )}
    </div>
  );
}

// Feature Comparison
function FeatureComparison() {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Compare Features
      </h2>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Feature</th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700">Free</th>
              <th className="text-center py-4 px-6 font-semibold text-purple-600 bg-purple-50">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="py-4 px-6 font-medium text-gray-900">Daily Analyses</td>
              <td className="text-center py-4 px-6 text-gray-600">3</td>
              <td className="text-center py-4 px-6 font-medium text-purple-600 bg-purple-50">Unlimited</td>
            </tr>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td className="py-4 px-6 font-medium text-gray-900">Keyword Density</td>
              <td className="text-center py-4 px-6 text-gray-600">Basic</td>
              <td className="text-center py-4 px-6 font-medium text-purple-600 bg-purple-50">Advanced</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="py-4 px-6 font-medium text-gray-900">Export Reports</td>
              <td className="text-center py-4 px-6 text-gray-600">✗</td>
              <td className="text-center py-4 px-6 font-medium text-purple-600 bg-purple-50">✓ PDF/CSV</td>
            </tr>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td className="py-4 px-6 font-medium text-gray-900">History Tracking</td>
              <td className="text-center py-4 px-6 text-gray-600">✗</td>
              <td className="text-center py-4 px-6 font-medium text-purple-600 bg-purple-50">✓ 30 days</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="py-4 px-6 font-medium text-gray-900">Support</td>
              <td className="text-center py-4 px-6 text-gray-600">Community</td>
              <td className="text-center py-4 px-6 font-medium text-purple-600 bg-purple-50">Email</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// FAQ Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Do I need a credit card to start?',
      answer: 'No! You can start with our free plan without a credit card. Upgrade anytime to access premium features.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept PayPal and all major credit cards through our secure payment processor.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel anytime. Your subscription will remain active until the end of the billing period.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes! We offer a 7-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
    {
      question: 'What\'s the difference between monthly and yearly billing?',
      answer: 'Yearly billing saves you 17% compared to monthly billing. That\'s like getting 2 months free!',
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan anytime from your dashboard.',
    },
    {
      question: 'What happens if I exceed my daily limit?',
      answer: 'Free users are limited to 3 analyses per day. Upgrade to Pro for unlimited analyses.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Everything you need to know about Zuhio pricing
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className={`text-2xl transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
