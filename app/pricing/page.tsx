'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for trying out Zuhio',
      features: [
        { text: '3 analyses per day', included: true },
        { text: 'Basic keyword density', included: true },
        { text: 'Word count statistics', included: true },
        { text: 'No history', included: false },
        { text: 'No export', included: false },
        { text: 'No bulk analysis', included: false },
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 9.99 : 99,
      priceNote: billingCycle === 'yearly' ? 'Save 17%' : '',
      description: 'For content creators and SEO professionals',
      features: [
        { text: 'Unlimited analyses', included: true },
        { text: 'Export reports (PDF/CSV)', included: true },
        { text: '30-day history', included: true },
        { text: 'Bulk analysis (5 articles)', included: true },
        { text: 'Keyword templates', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Start 7-Day Free Trial',
      highlighted: true,
    },
    {
      name: 'Business',
      price: billingCycle === 'monthly' ? 29.99 : 299,
      priceNote: billingCycle === 'yearly' ? 'Save 17%' : '',
      description: 'For teams and agencies',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'API access (1000/mo)', included: true },
        { text: 'Team collaboration (5 seats)', included: true },
        { text: 'Unlimited history', included: true },
        { text: 'White-label reports', included: true },
        { text: 'Dedicated support', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
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
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">Dashboard</a>
              <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                Sign In
              </Link>
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
            Choose the plan that fits your needs
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-purple-600 rounded-full relative transition-colors"
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
                billingCycle === 'yearly' ? 'left-7' : 'left-1'
              }`}></div>
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs ml-1">Save 17%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? 'shadow-2xl border-2 border-purple-500 scale-105'
                  : 'shadow-lg border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  )}
                </div>
                {plan.priceNote && (
                  <p className="text-green-600 text-sm font-medium">{plan.priceNote}</p>
                )}
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className={`text-lg ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your SEO?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Start with 10 free analyses per day. No credit card required.
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔍</span>
                <span className="font-bold text-xl">Zuhio</span>
              </div>
              <p className="text-gray-400 text-sm">
                Free online keyword density checker and SEO optimization tool.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white">Features</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 Zuhio. All rights reserved.
          </div>
        </div>
      </footer>
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
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay.',
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
      answer: 'Yearly billing saves you 17% compared to monthly billing. It\'s like getting 2 months free!',
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan anytime from your account settings.',
    },
    {
      question: 'Do you offer discounts for nonprofits or students?',
      answer: 'Yes! Contact our sales team for special pricing for nonprofits, students, and educational institutions.',
    },
    {
      question: 'What happens if I exceed my daily limit?',
      answer: 'Free users can upgrade to Pro for unlimited analyses. Your data is saved, so you can continue where you left off.',
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
