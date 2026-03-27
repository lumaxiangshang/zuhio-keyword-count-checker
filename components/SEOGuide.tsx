'use client';

import { Language, translations } from '@/lib/i18n';

interface SEOGuideProps {
  language: Language;
}

export default function SEOGuide({ language }: SEOGuideProps) {
  const t = translations[language];

  const guidelines = [
    {
      range: '< 0.5%',
      status: t.tooLow,
      description: t.tooLowDesc,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    },
    {
      range: '0.5% - 2.5%',
      status: t.ideal,
      description: t.idealDesc,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      range: '2.5% - 4%',
      status: t.slightlyHigh,
      description: t.slightlyHighDesc,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    {
      range: '> 4%',
      status: t.tooHigh,
      description: t.tooHighDesc,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    },
  ];

  const tips = [
    t.tip1,
    t.tip2,
    t.tip3,
    t.tip4,
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white/5 backdrop-blur-sm rounded-2xl mt-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">{t.densityGuidelines}</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">{t.densityGuidelinesDesc}</p>
      </div>

      {/* Density Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {guidelines.map((guideline, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 ${guideline.bgColor} ${guideline.textColor}`}
          >
            <div className="text-2xl font-bold mb-2">{guideline.range}</div>
            <div className="font-semibold mb-2">{guideline.status}</div>
            <div className="text-sm opacity-80">{guideline.description}</div>
          </div>
        ))}
      </div>

      {/* Pro Tips */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">{t.proTips}</h3>
        <ul className="space-y-2 text-white/80">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
