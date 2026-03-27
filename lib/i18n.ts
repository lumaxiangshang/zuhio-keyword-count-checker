// 国际化配置
export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    logo: 'Zuhio',
    features: 'Features',
    howItWorks: 'How It Works',
    github: 'GitHub',
    
    // Hero Section
    heroTitle: '🔍 Zuhio Keyword Count Checker',
    heroDescription: 'Free online tool to analyze word count, keyword density, and SEO optimization for your content',
    
    // Text Input
    textareaPlaceholder: 'Paste or type your text here to start analyzing...  Try pasting an article, blog post, or any content you want to analyze. The tool will automatically count words, characters, sentences, and extract top keywords.',
    keywordPlaceholder: "Enter keyword to analyze density (e.g., 'SEO', 'marketing')",
    clearAll: 'Clear All',
    
    // Empty State
    emptyStateTitle: 'Start typing or paste your text to see the analysis',
    emptyStateSubtitle: 'Real-time updates as you type',
    
    // Stats
    words: 'Words',
    characters: 'Characters',
    charactersNoSpaces: 'Characters (no spaces)',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    readingTime: 'Reading Time',
    minutes: 'min',
    
    // Keyword Density
    keywordDensity: 'Keyword Density',
    topKeywords: 'Top Keywords',
    count: 'Count',
    density: 'Density',
    
    // Density Guidelines
    densityGuidelines: 'Keyword Density Guidelines',
    densityGuidelinesDesc: 'Optimal keyword density for SEO according to industry standards',
    tooLow: 'Too Low',
    tooLowDesc: 'Consider adding more keywords',
    ideal: 'Ideal',
    idealDesc: 'Perfect density for SEO',
    slightlyHigh: 'Slightly High',
    slightlyHighDesc: 'Use keywords more naturally',
    tooHigh: 'Too High',
    tooHighDesc: 'Risk of keyword stuffing',
    
    // Pro Tips
    proTips: '💡 Pro Tips',
    tip1: 'Focus on natural keyword usage, not forced insertion',
    tip2: 'Use synonyms and related terms to avoid repetition',
    tip3: 'Place important keywords in titles and headings',
    tip4: 'Prioritize readability over keyword density',
    
    // Features Section
    featuresTitle: 'Powerful Features for Content Creators',
    featuresDesc: 'Everything you need to optimize your content for SEO and readability',
    featureWordCount: 'Word Count',
    featureWordCountDesc: 'Accurate word and character counting with real-time updates',
    featureKeywordDensity: 'Keyword Density',
    featureKeywordDensityDesc: 'Analyze keyword frequency and density for SEO optimization',
    featureTopKeywords: 'Top Keywords',
    featureTopKeywordsDesc: 'Extract most used keywords automatically with density percentage',
    featureReadingTime: 'Reading Time',
    featureReadingTimeDesc: 'Estimate reading time based on word count and average speed',
    featureResponsive: 'Responsive',
    featureResponsiveDesc: 'Works perfectly on desktop, tablet, and mobile devices',
    featureFree: '100% Free',
    featureFreeDesc: 'No registration required, completely free to use',
    
    // Footer
    footerText: '© 2026 Zuhio Keyword Count Checker. Free SEO Tool.',
    footerCredit: 'Built with Next.js + Tailwind CSS',
    
    // Density Status
    densityTooLow: '⚠️ Too low',
    densityGood: '✅ Good',
    densityTooHigh: '⚠️ Too high',
    
    // Language Switcher
    selectLanguage: 'Select Language',
  },
  
  zh: {
    // Header
    logo: 'Zuhio',
    features: '功能特点',
    howItWorks: '使用说明',
    github: 'GitHub',
    
    // Hero Section
    heroTitle: '🔍 Zuhio 关键词密度分析工具',
    heroDescription: '免费在线工具，分析词数、关键词密度，优化您的 SEO 内容',
    
    // Text Input
    textareaPlaceholder: '粘贴或输入您的文本开始分析... 可以粘贴文章、博客或任何需要分析的内容。工具会自动统计词数、字符数、句子数，并提取关键词。',
    keywordPlaceholder: "输入要分析密度的关键词（例如：'SEO'、'营销'）",
    clearAll: '清空',
    
    // Empty State
    emptyStateTitle: '开始输入或粘贴文本以查看分析结果',
    emptyStateSubtitle: '输入时实时更新',
    
    // Stats
    words: '词数',
    characters: '字符数',
    charactersNoSpaces: '字符数（不含空格）',
    sentences: '句子数',
    paragraphs: '段落数',
    readingTime: '阅读时间',
    minutes: '分钟',
    
    // Keyword Density
    keywordDensity: '关键词密度',
    topKeywords: '热门关键词',
    count: '出现次数',
    density: '密度',
    
    // Density Guidelines
    densityGuidelines: '关键词密度指南',
    densityGuidelinesDesc: '根据行业标准，SEO 优化的最佳关键词密度',
    tooLow: '过低',
    tooLowDesc: '建议增加关键词使用',
    ideal: '理想',
    idealDesc: 'SEO 最佳密度范围',
    slightlyHigh: '略高',
    slightlyHighDesc: '建议更自然地使用关键词',
    tooHigh: '过高',
    tooHighDesc: '有关键词堆砌风险',
    
    // Pro Tips
    proTips: '💡 专业建议',
    tip1: '注重自然使用关键词，不要强行插入',
    tip2: '使用同义词和相关词汇避免重复',
    tip3: '在标题和副标题中放置重要关键词',
    tip4: '优先考虑可读性而非关键词密度',
    
    // Features Section
    featuresTitle: '为内容创作者打造的强大功能',
    featuresDesc: '优化内容 SEO 和可读性所需的一切功能',
    featureWordCount: '词数统计',
    featureWordCountDesc: '准确的词数和字符统计，实时更新',
    featureKeywordDensity: '关键词密度',
    featureKeywordDensityDesc: '分析关键词频率和密度，优化 SEO',
    featureTopKeywords: '热门关键词',
    featureTopKeywordsDesc: '自动提取高频关键词并显示密度百分比',
    featureReadingTime: '阅读时间',
    featureReadingTimeDesc: '根据词数和平均速度估算阅读时间',
    featureResponsive: '响应式设计',
    featureResponsiveDesc: '在桌面、平板和移动设备上完美运行',
    featureFree: '100% 免费',
    featureFreeDesc: '无需注册，完全免费使用',
    
    // Footer
    footerText: '© 2026 Zuhio 关键词分析工具。免费 SEO 工具。',
    footerCredit: '基于 Next.js + Tailwind CSS 构建',
    
    // Density Status
    densityTooLow: '⚠️ 过低',
    densityGood: '✅ 良好',
    densityTooHigh: '⚠️ 过高',
    
    // Language Switcher
    selectLanguage: '选择语言',
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '简体中文',
};
