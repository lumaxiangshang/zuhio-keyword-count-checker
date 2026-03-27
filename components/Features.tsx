'use client';

import { Language, translations } from '@/lib/i18n';

interface FeaturesProps {
  language: Language;
}

export default function Features({ language }: FeaturesProps) {
  const t = translations[language];

  const features = [
    {
      icon: '📊',
      title: t.featureWordCount,
      description: t.featureWordCountDesc,
    },
    {
      icon: '🔍',
      title: t.featureKeywordDensity,
      description: t.featureKeywordDensityDesc,
    },
    {
      icon: '📈',
      title: t.featureTopKeywords,
      description: t.featureTopKeywordsDesc,
    },
    {
      icon: '⏱️',
      title: t.featureReadingTime,
      description: t.featureReadingTimeDesc,
    },
    {
      icon: '📱',
      title: t.featureResponsive,
      description: t.featureResponsiveDesc,
    },
    {
      icon: '✅',
      title: t.featureFree,
      description: t.featureFreeDesc,
    },
  ];

  return (
    <section id="features" className="py-16 bg-white/5 backdrop-blur-sm rounded-2xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">{t.featuresTitle}</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">{t.featuresDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-white/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
