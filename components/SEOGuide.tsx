export default function SEOGuide() {
  const guidelines = [
    { range: '< 0.5%', status: 'Too Low', color: 'red', advice: 'Consider adding more keywords' },
    { range: '0.5% - 2.5%', status: 'Ideal', color: 'green', advice: 'Perfect density for SEO' },
    { range: '2.5% - 4%', status: 'Slightly High', color: 'yellow', advice: 'Use keywords more naturally' },
    { range: '> 4%', status: 'Too High', color: 'red', advice: 'Risk of keyword stuffing' }
  ];

  const getColorClass = (color: string) => {
    const classes: Record<string, string> = {
      red: 'bg-red-100 text-red-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      green: 'bg-green-100 text-green-700'
    };
    return classes[color] || classes.green;
  };

  return (
    <section id="how-it-works" className="py-16 bg-white/5 backdrop-blur-sm rounded-2xl mt-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Keyword Density Guidelines
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Optimal keyword density for SEO according to industry standards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {guidelines.map((guideline, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 ${getColorClass(guideline.color)}`}
          >
            <div className="text-2xl font-bold mb-2">{guideline.range}</div>
            <div className="font-semibold mb-2">{guideline.status}</div>
            <div className="text-sm opacity-80">{guideline.advice}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">💡 Pro Tips</h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Focus on natural keyword usage, not forced insertion
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Use synonyms and related terms to avoid repetition
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Place important keywords in titles and headings
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Prioritize readability over keyword density
          </li>
        </ul>
      </div>
    </section>
  );
}
