// 国际化配置
export type Language = 'en' | 'zh' | 'fr' | 'de';

export interface Translation {
  logo: string;
  features: string;
  howItWorks: string;
  github: string;
  heroTitle: string;
  heroDescription: string;
  textareaPlaceholder: string;
  keywordPlaceholder: string;
  clearAll: string;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  words: string;
  characters: string;
  charactersNoSpaces: string;
  sentences: string;
  paragraphs: string;
  readingTime: string;
  minutes: string;
  keywordDensity: string;
  topKeywords: string;
  count: string;
  density: string;
  densityGuidelines: string;
  densityGuidelinesDesc: string;
  tooLow: string;
  tooLowDesc: string;
  ideal: string;
  idealDesc: string;
  slightlyHigh: string;
  slightlyHighDesc: string;
  tooHigh: string;
  tooHighDesc: string;
  proTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  featuresTitle: string;
  featuresDesc: string;
  featureWordCount: string;
  featureWordCountDesc: string;
  featureKeywordDensity: string;
  featureKeywordDensityDesc: string;
  featureTopKeywords: string;
  featureTopKeywordsDesc: string;
  featureReadingTime: string;
  featureReadingTimeDesc: string;
  featureResponsive: string;
  featureResponsiveDesc: string;
  featureFree: string;
  featureFreeDesc: string;
  footerText: string;
  footerCredit: string;
  densityTooLow: string;
  densityGood: string;
  densityTooHigh: string;
  selectLanguage: string;
  visitors: string;
  whyChooseTitle: string;
  professionalSEO: string;
  professionalSEODesc: string;
  realTimeAnalysis: string;
  realTimeAnalysisDesc: string;
  smartRecommendations: string;
  smartRecommendationsDesc: string;
  useCases: string;
  useCase1: string;
  useCase2: string;
  useCase3: string;
  useCase4: string;
  useCase5: string;
  useCase6: string;
  multiLanguage: string;
  multiLanguageDesc: string;
  popularKeywords: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    logo: 'Zuhio',
    features: 'Features',
    howItWorks: 'How It Works',
    github: 'GitHub',
    heroTitle: '🔍 Zuhio Keyword Density Checker - Free SEO Tool',
    heroDescription: 'Free online keyword density checker & word count tool for SEO optimization. Analyze your content and improve search rankings instantly.',
    textareaPlaceholder: 'Paste or type your text here to start analyzing... Try pasting an article, blog post, or any content you want to analyze. The tool will automatically count words, characters, sentences, and extract top keywords.',
    keywordPlaceholder: "Enter keyword to analyze density (e.g., 'SEO', 'marketing')",
    clearAll: 'Clear All',
    emptyStateTitle: 'Start typing or paste your text to see the analysis',
    emptyStateSubtitle: 'Real-time updates as you type',
    words: 'Words',
    characters: 'Characters',
    charactersNoSpaces: 'Characters (no spaces)',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    readingTime: 'Reading Time',
    minutes: 'min',
    keywordDensity: 'Keyword Density',
    topKeywords: 'Top Keywords',
    count: 'Count',
    density: 'Density',
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
    proTips: '💡 Pro Tips',
    tip1: 'Focus on natural keyword usage, not forced insertion',
    tip2: 'Use synonyms and related terms to avoid repetition',
    tip3: 'Place important keywords in titles and headings',
    tip4: 'Prioritize readability over keyword density',
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
    footerText: '© 2026 Zuhio Keyword Density Checker. Free SEO Tool.',
    footerCredit: 'Built with Next.js + Tailwind CSS',
    densityTooLow: '⚠️ Too low',
    densityGood: '✅ Good',
    densityTooHigh: '⚠️ Too high',
    selectLanguage: 'Select Language',
    visitors: 'visitors',
    whyChooseTitle: 'Why Choose Zuhio Keyword Density Checker?',
    professionalSEO: '🎯 Professional SEO Tool',
    professionalSEODesc: 'Zuhio is a professional keyword density checker and word count tool for SEO optimization. Improve your Google rankings with our free online analyzer. No registration required.',
    realTimeAnalysis: '📊 Real-time Analysis',
    realTimeAnalysisDesc: 'Get instant keyword density, word count, character count, and reading time statistics. Supports Chinese and English content analysis.',
    smartRecommendations: '💡 Smart Recommendations',
    smartRecommendationsDesc: 'Based on SEO industry standards, we provide keyword density recommendations to avoid keyword stuffing and make your content more natural and search-engine friendly.',
    useCases: '🚀 Use Cases',
    useCase1: 'Blog post SEO optimization',
    useCase2: 'Website content keyword analysis',
    useCase3: 'Academic paper word count',
    useCase4: 'Social media content optimization',
    useCase5: 'E-commerce product description',
    useCase6: 'Email marketing content check',
    multiLanguage: '🌐 Multi-language Support',
    multiLanguageDesc: 'Support for 简体中文，English, Français and Deutsch, perfect for global content creators, SEO specialists, and digital marketers.',
    popularKeywords: 'Popular SEO Tool Keywords',
  },
  zh: {
    logo: 'Zuhio',
    features: '功能特点',
    howItWorks: '使用说明',
    github: 'GitHub',
    heroTitle: '🔍 Zuhio 关键词密度分析工具 - 免费 SEO 工具',
    heroDescription: '免费在线关键词密度检查器和词数统计工具，专为 SEO 优化设计。立即分析您的内容，提升搜索排名。',
    textareaPlaceholder: '粘贴或输入您的文本开始分析... 可以粘贴文章、博客或任何需要分析的内容。工具会自动统计词数、字符数、句子数，并提取关键词。',
    keywordPlaceholder: "输入要分析密度的关键词（例如：'SEO'、'营销'）",
    clearAll: '清空',
    emptyStateTitle: '开始输入或粘贴文本以查看分析结果',
    emptyStateSubtitle: '输入时实时更新',
    words: '词数',
    characters: '字符数',
    charactersNoSpaces: '字符数（不含空格）',
    sentences: '句子数',
    paragraphs: '段落数',
    readingTime: '阅读时间',
    minutes: '分钟',
    keywordDensity: '关键词密度',
    topKeywords: '热门关键词',
    count: '出现次数',
    density: '密度',
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
    proTips: '💡 专业建议',
    tip1: '注重自然使用关键词，不要强行插入',
    tip2: '使用同义词和相关词汇避免重复',
    tip3: '在标题和副标题中放置重要关键词',
    tip4: '优先考虑可读性而非关键词密度',
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
    footerText: '© 2026 Zuhio 关键词分析工具。免费 SEO 工具。',
    footerCredit: '基于 Next.js + Tailwind CSS 构建',
    densityTooLow: '⚠️ 过低',
    densityGood: '✅ 良好',
    densityTooHigh: '⚠️ 过高',
    selectLanguage: '选择语言',
    visitors: '访客',
    whyChooseTitle: '为什么选择 Zuhio 关键词密度检查器？',
    professionalSEO: '🎯 专业 SEO 优化',
    professionalSEODesc: 'Zuhio 是专业的关键词密度分析工具和词数统计工具，帮助您优化内容 SEO，提升 Google 搜索排名。免费使用，无需注册。',
    realTimeAnalysis: '📊 实时分析',
    realTimeAnalysisDesc: '输入文本后立即显示关键词密度、词数统计、字符数、阅读时间等数据，支持中文和英文分析。',
    smartRecommendations: '💡 智能建议',
    smartRecommendationsDesc: '根据 SEO 行业标准提供关键词密度建议，避免关键词堆砌，让内容更自然、更易被搜索引擎收录。',
    useCases: '🚀 适用场景',
    useCase1: '博客文章 SEO 优化',
    useCase2: '网站内容关键词分析',
    useCase3: '学术论文词数统计',
    useCase4: '社交媒体内容优化',
    useCase5: '电商产品描述优化',
    useCase6: '邮件营销内容检查',
    multiLanguage: '🌐 多语言支持',
    multiLanguageDesc: '支持中文简体和 English，适合全球内容创作者、SEO 专家、数字营销人员使用。',
    popularKeywords: '热门 SEO 工具关键词',
  },
  fr: {
    logo: 'Zuhio',
    features: 'Fonctionnalités',
    howItWorks: 'Comment ça marche',
    github: 'GitHub',
    heroTitle: '🔍 Vérificateur de Densité de Mots-clés Zuhio - Outil SEO Gratuit',
    heroDescription: 'Outil gratuit de vérification de densité de mots-clés et de comptage de mots pour l\'optimisation SEO. Analysez votre contenu et améliorez votre classement Google instantanément.',
    textareaPlaceholder: 'Collez ou tapez votre texte ici pour commencer l\'analyse... Essayez de coller un article, un billet de blog ou tout contenu que vous souhaitez analyser. L\'outil comptera automatiquement les mots, caractères, phrases et extraira les mots-clés principaux.',
    keywordPlaceholder: "Entrez le mot-clé à analyser (ex: 'SEO', 'marketing')",
    clearAll: 'Tout effacer',
    emptyStateTitle: 'Commencez à taper ou collez votre texte pour voir l\'analyse',
    emptyStateSubtitle: 'Mises à jour en temps réel pendant la saisie',
    words: 'Mots',
    characters: 'Caractères',
    charactersNoSpaces: 'Caractères (sans espaces)',
    sentences: 'Phrases',
    paragraphs: 'Paragraphes',
    readingTime: 'Temps de lecture',
    minutes: 'min',
    keywordDensity: 'Densité de mots-clés',
    topKeywords: 'Mots-clés principaux',
    count: 'Nombre',
    density: 'Densité',
    densityGuidelines: 'Directives de densité de mots-clés',
    densityGuidelinesDesc: 'Densité de mots-clés optimale pour le SEO selon les standards de l\'industrie',
    tooLow: 'Trop faible',
    tooLowDesc: 'Envisagez d\'ajouter plus de mots-clés',
    ideal: 'Idéal',
    idealDesc: 'Densité parfaite pour le SEO',
    slightlyHigh: 'Légèrement élevé',
    slightlyHighDesc: 'Utilisez les mots-clés plus naturellement',
    tooHigh: 'Trop élevé',
    tooHighDesc: 'Risque de bourrage de mots-clés',
    proTips: '💡 Conseils pro',
    tip1: 'Privilégiez une utilisation naturelle des mots-clés, pas d\'insertion forcée',
    tip2: 'Utilisez des synonymes et termes connexes pour éviter la répétition',
    tip3: 'Placez les mots-clés importants dans les titres et sous-titres',
    tip4: 'Privilégiez la lisibilité à la densité de mots-clés',
    featuresTitle: 'Fonctionnalités puissantes pour les créateurs de contenu',
    featuresDesc: 'Tout ce dont vous avez besoin pour optimiser votre contenu SEO et sa lisibilité',
    featureWordCount: 'Comptage de mots',
    featureWordCountDesc: 'Comptage précis des mots et caractères avec mises à jour en temps réel',
    featureKeywordDensity: 'Densité de mots-clés',
    featureKeywordDensityDesc: 'Analysez la fréquence et la densité des mots-clés pour l\'optimisation SEO',
    featureTopKeywords: 'Mots-clés principaux',
    featureTopKeywordsDesc: 'Extrayez automatiquement les mots-clés les plus utilisés avec le pourcentage de densité',
    featureReadingTime: 'Temps de lecture',
    featureReadingTimeDesc: 'Estimez le temps de lecture basé sur le nombre de mots et la vitesse moyenne',
    featureResponsive: 'Responsive',
    featureResponsiveDesc: 'Fonctionne parfaitement sur ordinateur, tablette et mobile',
    featureFree: '100% Gratuit',
    featureFreeDesc: 'Aucune inscription requise, complètement gratuit à utiliser',
    footerText: '© 2026 Vérificateur de densité de mots-clés Zuhio. Outil SEO gratuit.',
    footerCredit: 'Créé avec Next.js + Tailwind CSS',
    densityTooLow: '⚠️ Trop faible',
    densityGood: '✅ Bon',
    densityTooHigh: '⚠️ Trop élevé',
    selectLanguage: 'Choisir la langue',
    visitors: 'visiteurs',
    whyChooseTitle: 'Pourquoi choisir le vérificateur de densité de mots-clés Zuhio ?',
    professionalSEO: '🎯 Optimisation SEO professionnelle',
    professionalSEODesc: 'Zuhio est un outil professionnel de vérification de densité de mots-clés et de comptage de mots pour l\'optimisation SEO. Améliorez votre classement Google avec notre analyseur gratuit en ligne. Aucune inscription requise.',
    realTimeAnalysis: '📊 Analyse en temps réel',
    realTimeAnalysisDesc: 'Obtenez instantanément des statistiques de densité de mots-clés, de comptage de mots, de caractères et de temps de lecture. Prend en charge l\'analyse de contenu en chinois et en anglais.',
    smartRecommendations: '💡 Recommandations intelligentes',
    smartRecommendationsDesc: 'Basé sur les standards de l\'industrie SEO, nous fournissons des recommandations de densité de mots-clés pour éviter le bourrage de mots-clés et rendre votre contenu plus naturel et convivial pour les moteurs de recherche.',
    useCases: '🚀 Cas d\'utilisation',
    useCase1: 'Optimisation SEO d\'articles de blog',
    useCase2: 'Analyse de mots-clés de contenu web',
    useCase3: 'Comptage de mots pour articles académiques',
    useCase4: 'Optimisation de contenu pour réseaux sociaux',
    useCase5: 'Description de produit e-commerce',
    useCase6: 'Vérification de contenu email marketing',
    multiLanguage: '🌐 Support multi-langues',
    multiLanguageDesc: 'Support pour 简体中文，English, Français et Deutsch, parfait pour les créateurs de contenu mondiaux, les spécialistes SEO et les marketeurs digitaux.',
    popularKeywords: 'Mots-clés populaires',
  },
  de: {
    logo: 'Zuhio',
    features: 'Funktionen',
    howItWorks: 'So funktioniert es',
    github: 'GitHub',
    heroTitle: '🔍 Zuhio Keyword-Dichte-Checker - Kostenloses SEO-Tool',
    heroDescription: 'Kostenloses Online-Tool zur Überprüfung der Keyword-Dichte und Wortzählung für SEO-Optimierung. Analysieren Sie Ihre Inhalte und verbessern Sie Ihr Google-Ranking sofort.',
    textareaPlaceholder: 'Fügen Sie Ihren Text hier ein oder tippen Sie ihn, um die Analyse zu starten... Versuchen Sie, einen Artikel, Blog-Beitrag oder beliebigen Inhalt einzufügen. Das Tool zählt automatisch Wörter, Zeichen, Sätze und extrahiert die wichtigsten Keywords.',
    keywordPlaceholder: "Geben Sie das zu analysierende Keyword ein (z.B. 'SEO', 'Marketing')",
    clearAll: 'Alles löschen',
    emptyStateTitle: 'Beginnen Sie mit der Eingabe oder fügen Sie Ihren Text ein, um die Analyse zu sehen',
    emptyStateSubtitle: 'Echtzeit-Updates während der Eingabe',
    words: 'Wörter',
    characters: 'Zeichen',
    charactersNoSpaces: 'Zeichen (ohne Leerzeichen)',
    sentences: 'Sätze',
    paragraphs: 'Absätze',
    readingTime: 'Lesezeit',
    minutes: 'Min',
    keywordDensity: 'Keyword-Dichte',
    topKeywords: 'Top-Keywords',
    count: 'Anzahl',
    density: 'Dichte',
    densityGuidelines: 'Richtlinien für Keyword-Dichte',
    densityGuidelinesDesc: 'Optimale Keyword-Dichte für SEO gemäß Industriestandards',
    tooLow: 'Zu niedrig',
    tooLowDesc: 'Erwägen Sie, mehr Keywords hinzuzufügen',
    ideal: 'Ideal',
    idealDesc: 'Perfekte Dichte für SEO',
    slightlyHigh: 'Etwas hoch',
    slightlyHighDesc: 'Verwenden Sie Keywords natürlicher',
    tooHigh: 'Zu hoch',
    tooHighDesc: 'Risiko von Keyword-Stuffing',
    proTips: '💡 Profi-Tipps',
    tip1: 'Setzen Sie Keywords natürlich ein, nicht erzwungen',
    tip2: 'Verwenden Sie Synonyme und verwandte Begriffe zur Vermeidung von Wiederholungen',
    tip3: 'Platzieren Sie wichtige Keywords in Titeln und Überschriften',
    tip4: 'Priorisieren Sie Lesbarkeit vor Keyword-Dichte',
    featuresTitle: 'Leistungsstarke Funktionen für Content-Ersteller',
    featuresDesc: 'Alles, was Sie benötigen, um Ihre Inhalte für SEO und Lesbarkeit zu optimieren',
    featureWordCount: 'Wortzählung',
    featureWordCountDesc: 'Genaue Wort- und Zeichenzählung mit Echtzeit-Updates',
    featureKeywordDensity: 'Keyword-Dichte',
    featureKeywordDensityDesc: 'Analysieren Sie Keyword-Häufigkeit und Dichte für SEO-Optimierung',
    featureTopKeywords: 'Top-Keywords',
    featureTopKeywordsDesc: 'Extrahieren Sie automatisch die am häufigsten verwendeten Keywords mit Dichte-Prozentsatz',
    featureReadingTime: 'Lesezeit',
    featureReadingTimeDesc: 'Schätzen Sie die Lesezeit basierend auf Wortzahl und Durchschnittsgeschwindigkeit',
    featureResponsive: 'Responsive',
    featureResponsiveDesc: 'Funktioniert perfekt auf Desktop, Tablet und Mobilgerät',
    featureFree: '100% Kostenlos',
    featureFreeDesc: 'Keine Registrierung erforderlich, vollständig kostenlos nutzbar',
    footerText: '© 2026 Zuhio Keyword-Dichte-Checker. Kostenloses SEO-Tool.',
    footerCredit: 'Erstellt mit Next.js + Tailwind CSS',
    densityTooLow: '⚠️ Zu niedrig',
    densityGood: '✅ Gut',
    densityTooHigh: '⚠️ Zu hoch',
    selectLanguage: 'Sprache wählen',
    visitors: 'Besucher',
    whyChooseTitle: 'Warum Zuhio Keyword-Dichte-Checker wählen?',
    professionalSEO: '🎯 Professionelle SEO-Optimierung',
    professionalSEODesc: 'Zuhio ist ein professionelles Tool zur Überprüfung der Keyword-Dichte und Wortzählung für SEO-Optimierung. Verbessern Sie Ihr Google-Ranking mit unserem kostenlosen Online-Analysator. Keine Registrierung erforderlich.',
    realTimeAnalysis: '📊 Echtzeit-Analyse',
    realTimeAnalysisDesc: 'Erhalten Sie sofort Statistiken zu Keyword-Dichte, Wortzahl, Zeichen und Lesezeit. Unterstützt chinesische und englische Content-Analyse.',
    smartRecommendations: '💡 Intelligente Empfehlungen',
    smartRecommendationsDesc: 'Basierend auf SEO-Industriestandards bieten wir Empfehlungen zur Keyword-Dichte, um Keyword-Stuffing zu vermeiden und Ihre Inhalte natürlicher und suchmaschinenfreundlicher zu gestalten.',
    useCases: '🚀 Anwendungsfälle',
    useCase1: 'Blog-Artikel SEO-Optimierung',
    useCase2: 'Website-Content Keyword-Analyse',
    useCase3: 'Akademische Arbeiten Wortzählung',
    useCase4: 'Social-Media-Content-Optimierung',
    useCase5: 'E-Commerce Produktbeschreibung',
    useCase6: 'E-Mail-Marketing Content-Check',
    multiLanguage: '🌐 Mehrsprachige Unterstützung',
    multiLanguageDesc: 'Unterstützung für 简体中文，English, Français und Deutsch, perfekt für globale Content-Ersteller, SEO-Spezialisten und Digital-Marketer.',
    popularKeywords: 'Beliebte Keywords',
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '简体中文',
  fr: 'Français',
  de: 'Deutsch',
};
