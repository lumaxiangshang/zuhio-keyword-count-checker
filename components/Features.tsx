export default function Features() {
  const features = [
    {
      icon: '📊',
      title: 'Word Count',
      description: 'Accurate word and character counting with real-time updates'
    },
    {
      icon: '🔍',
      title: 'Keyword Density',
      description: 'Analyze keyword frequency and density for SEO optimization'
    },
    {
      icon: '📈',
      title: 'Top Keywords',
      description: 'Extract most used keywords automatically with density percentage'
    },
    {
      icon: '⏱️',
      title: 'Reading Time',
      description: 'Estimate reading time based on word count and average speed'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Works perfectly on desktop, tablet, and mobile devices'
    },
    {
      icon: '✅',
      title: '100% Free',
      description: 'No registration required, completely free to use'
    }
  ];

  return (
    <section id="features" className="py-16 bg-white/5 backdrop-blur-sm rounded-2xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Powerful Features for Content Creators
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Everything you need to optimize your content for SEO and readability
        </p>
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
