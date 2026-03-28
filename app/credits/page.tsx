'use client';

import { useState } from 'react';
import Link from 'next/link';
import PayPalOneTimePayment from '@/components/PayPalOneTimePayment';

export default function CreditsPage() {
  const creditPackages = [
    { 
      credits: 50, 
      price: 4.99, 
      bestFor: 'Trying out',
      popular: false,
    },
    { 
      credits: 100, 
      price: 9.99, 
      bestFor: 'Most popular',
      popular: true,
    },
    { 
      credits: 250, 
      price: 19.99, 
      bestFor: 'Regular users',
      popular: false,
    },
    { 
      credits: 500, 
      price: 34.99, 
      bestFor: 'Power users',
      popular: false,
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
              <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-800">Pricing</a>
              <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy Credits
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Purchase credits to use for keyword analysis
          </p>
          <p className="text-gray-500 text-sm">
            💡 1 credit = 1 article analysis
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`relative bg-white rounded-2xl p-8 ${
                pkg.popular
                  ? 'shadow-2xl border-2 border-purple-500 scale-105'
                  : 'shadow-lg border border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {pkg.credits}
                </div>
                <div className="text-gray-600 text-sm mb-4">credits</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${pkg.price}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
                <p className="text-purple-600 text-sm font-medium mt-2">{pkg.bestFor}</p>
              </div>

              <div className="mt-8">
                <PayPalOneTimePayment
                  credits={pkg.credits}
                  price={pkg.price}
                />
              </div>

              {/* Savings badge */}
              {pkg.credits > 100 && (
                <div className="mt-4 text-center">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    Save {Math.round((1 - pkg.price / (pkg.credits * 0.0999)) * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Buy Credits?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No Subscription</h3>
              <p className="text-gray-600 text-sm">Pay only for what you use. No recurring charges.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">∞</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No Expiration</h3>
              <p className="text-gray-600 text-sm">Your credits never expire. Use them anytime.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Bulk Discounts</h3>
              <p className="text-gray-600 text-sm">Save more when you buy larger packages.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Unlimited Access?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Check out our Pro and Business plans for unlimited analyses
            </p>
            <Link
              href="/pricing"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors"
            >
              View Subscription Plans
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
                <li><a href="/credits" className="hover:text-white">Buy Credits</a></li>
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What are credits?',
      answer: 'Credits are used to perform keyword analysis. 1 credit = 1 article analysis. You can purchase credits as needed without a subscription.',
    },
    {
      question: 'Do credits expire?',
      answer: 'No! Your credits never expire. You can use them anytime, even months after purchase.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes! We offer a 7-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
    {
      question: 'What\'s the difference between credits and subscription?',
      answer: 'Credits are pay-as-you-go, perfect for occasional users. Subscriptions offer unlimited analyses for heavy users.',
    },
    {
      question: 'Can I upgrade from credits to subscription?',
      answer: 'Absolutely! You can switch to a subscription plan anytime. Your unused credits will remain in your account.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Everything you need to know about buying credits
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
