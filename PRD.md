# Zuhio Keyword Count Checker - MVP 需求文档

**版本**: 1.0  
**日期**: 2026-03-26  
**状态**: 📝 待开发  
**负责人**: 路马  
**项目**: Zuhio Keyword Count Checker

---

## 1. 产品概述

### 1.1 产品名称
**Keyword Count Checker**（暂定）

### 1.2 产品定位
免费在线关键词统计与密度分析工具，帮助内容创作者、SEO 从业者快速分析文本的词数、关键词密度和 SEO 优化建议。

### 1.3 目标用户
| 用户类型 | 使用场景 | 核心需求 |
|---------|---------|---------|
| 内容创作者 | 写博客、文章后检查字数 | 快速统计词数、字符数 |
| SEO 从业者 | 优化文章关键词密度 | 关键词频率、密度分析 |
| 学生/学术 | 论文字数检查 | 准确计数、格式统计 |
| 社交媒体运营 | 控制文案长度 | 字符数、句子数统计 |

### 1.4 核心价值
- ✅ **免费** - 无需注册，开箱即用
- ✅ **快速** - 实时分析，无需等待
- ✅ **准确** - 精确的词数、密度计算
- ✅ **简洁** - 无广告干扰，专注核心功能

---

## 2. MVP 功能范围

### 2.1 核心功能（P0 - 必须上线）

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 文本输入 | 支持粘贴/输入文本，实时统计 | P0 |
| 基础统计 | 词数、字符数、句子数、段落数 | P0 |
| 关键词分析 | 输入关键词，计算密度和频率 | P0 |
| Top 关键词 | 自动提取出现频率最高的 10 个词 | P0 |
| 实时分析 | 输入时自动更新统计结果 | P0 |
| 一键清空 | 清空输入内容，重新开始 | P0 |
| 响应式设计 | 支持桌面端和移动端 | P0 |

### 2.2 增强功能（P1 - 上线后迭代）

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 多语言支持 | 支持中文、英文、西语等 | P1 |
| 导出报告 | 导出分析结果为 PDF/CSV | P1 |
| 历史记录 | 保存最近的分析记录 | P1 |
| 对比分析 | 对比两篇文章的差异 | P1 |
| SEO 建议 | 根据关键词密度给出优化建议 | P1 |

### 2.3 未来功能（P2 - 商业化方向）

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 用户账户 | 注册登录，保存数据 | P2 |
| Pro 版本 | 付费解锁高级功能 | P2 |
| API 服务 | 提供 API 给第三方调用 | P2 |
| 批量分析 | 一次性分析多篇文章 | P2 |
| 团队协作 | 团队共享分析结果 | P2 |

---

## 3. 功能详细设计

### 3.1 文本输入区

**界面要求**:
- 大文本框，至少 10 行高度
- Placeholder 提示："Paste your text here..."
- 支持自动调整高度（最多 30 行）
- 实时显示已输入字符数

**交互逻辑**:
```
用户输入 → 实时统计 → 更新结果
用户粘贴 → 自动分析 → 显示结果
点击清空 → 确认提示 → 清空内容
```

### 3.2 基础统计卡片

**展示指标**:
| 指标 | 计算方式 | 示例 |
|------|---------|------|
| Words | 按空格分词，过滤空字符串 | 1,234 |
| Characters | 文本总长度（含空格） | 6,789 |
| Characters (no spaces) | 文本总长度（不含空格） | 5,678 |
| Sentences | 按 `.!?` 分割 | 56 |
| Paragraphs | 按双换行分割 | 12 |
| Reading Time | 词数 ÷ 200（英文）| 6 min |

**UI 设计**:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Words     │ Characters  │ Sentences   │ Reading Time│
│    1,234    │    6,789    │     56      │    6 min    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 3.3 关键词分析

**输入**:
- 关键词输入框（支持多个关键词，逗号分隔）
- 分析按钮（或自动分析）

**输出**:
| 指标 | 计算方式 | 示例 |
|------|---------|------|
| Keyword Count | 关键词出现次数 | 15 |
| Keyword Density | (关键词数 ÷ 总词数) × 100% | 1.22% |
| First Occurrence | 首次出现位置 | 第 3 段 |
| Last Occurrence | 最后出现位置 | 第 11 段 |

**SEO 建议阈值**:
| 密度范围 | 建议 |
|---------|------|
| < 0.5% | 过低，建议增加关键词 |
| 0.5% - 2.5% | ✅ 理想范围 |
| 2.5% - 4% | 略高，注意自然度 |
| > 4% | ⚠️ 关键词堆砌风险 |

### 3.4 Top 关键词表

**展示内容**:
| Rank | Keyword | Count | Density |
|------|---------|-------|---------|
| 1 | content | 45 | 3.65% |
| 2 | marketing | 38 | 3.08% |
| 3 | SEO | 32 | 2.59% |
| ... | ... | ... | ... |

**过滤规则**:
- 排除停用词（the, a, is, at, etc.）
- 最小词长：3 个字母
- 仅显示前 10-20 个

---

## 4. 技术方案

### 4.1 技术栈选择

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端框架 | Next.js 14 | SEO 友好，Vercel 部署 |
| 样式 | Tailwind CSS | 快速开发，响应式 |
| 部署 | Vercel | 免费层够用，全球 CDN |
| 域名 | Namecheap | 便宜，管理方便 |
| 分析 | Vercel Analytics | 免费，隐私友好 |

### 4.2 项目结构

```
keyword-counter/
├── app/
│   ├── layout.tsx          # 全局布局（SEO meta）
│   ├── page.tsx            # 主页面
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # robots.txt
├── components/
│   ├── TextAnalyzer.tsx    # 文本分析器
│   ├── StatsCards.tsx      # 统计卡片
│   ├── KeywordInput.tsx    # 关键词输入
│   ├── KeywordTable.tsx    # 关键词表格
│   └── Header.tsx          # 头部导航
├── lib/
│   └── analyzer.ts         # 分析逻辑（纯函数）
├── public/
│   ├── favicon.ico
│   └── og-image.png        # 社交分享图
├── tailwind.config.js
├── next.config.js
└── package.json
```

### 4.3 核心算法

```typescript
// lib/analyzer.ts

interface AnalysisResult {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number; // minutes
  keywordDensity: Record<string, number>;
  topKeywords: Array<{ word: string; count: number; density: number }>;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
  'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those'
]);

export function analyzeText(text: string, keywords?: string[]): AnalysisResult {
  // 基础统计
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // 关键词密度
  const textLower = text.toLowerCase();
  const keywordDensity: Record<string, number> = {};
  
  if (keywords) {
    keywords.forEach(kw => {
      const matches = textLower.match(new RegExp(kw, 'gi')) || [];
      keywordDensity[kw] = wordCount > 0 
        ? parseFloat(((matches.length / wordCount) * 100).toFixed(2))
        : 0;
    });
  }
  
  // Top 关键词
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (clean.length >= 3 && !STOP_WORDS.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / wordCount) * 100).toFixed(2))
    }));
  
  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    sentenceCount,
    paragraphCount,
    readingTime,
    keywordDensity,
    topKeywords
  };
}
```

---

## 5. UI/UX 设计

### 5.1 页面布局

```
┌─────────────────────────────────────────────────────┐
│  🔍 Keyword Count Checker              [GitHub]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Free online tool to analyze word count, keyword   │
│  density, and SEO optimization for your content.   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Paste your text here...                    │   │
│  │                                             │   │
│  │                                             │   │
│  │                                             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────┐  ┌─────────────────────────┐     │
│  │ Enter keyword│  │      [Analyze]          │     │
│  └──────────────┘  └─────────────────────────┘     │
│                                                     │
│  ┌─────────┬─────────┬─────────┬─────────┐         │
│  │  Words  │  Chars  │Sentences│  Time   │         │
│  │  1,234  │  6,789  │   56    │  6 min  │         │
│  └─────────┴─────────┴─────────┴─────────┘         │
│                                                     │
│  Top Keywords                                       │
│  ┌────────────────────────────────────────────┐    │
│  │  Rank  │  Keyword  │  Count  │  Density   │    │
│  │    1   │  content  │   45    │   3.65%    │    │
│  │    2   │  marketing│   38    │   3.08%    │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  © 2026 Keyword Count Checker. Free SEO Tool.      │
└─────────────────────────────────────────────────────┘
```

### 5.2 配色方案

```css
/* 主色调 */
--primary: #667eea      /* 紫色 */
--primary-dark: #5568d3
--secondary: #764ba2    /* 深紫 */

/* 背景 */
--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--card-bg: #ffffff
--stat-bg: #f8f9fa

/* 文字 */
--text-primary: #333333
--text-secondary: #666666
--text-muted: #999999
```

### 5.3 响应式断点

| 断点 | 宽度 | 布局调整 |
|------|------|---------|
| Mobile | < 640px | 统计卡片单列 |
| Tablet | 640px - 1024px | 统计卡片 2 列 |
| Desktop | > 1024px | 统计卡片 4 列 |

---

## 6. SEO 策略

### 6.1 目标关键词

| 关键词 | 搜索量 | 难度 | 优先级 |
|--------|--------|------|--------|
| keyword count checker | 5,400/月 | 中 | P0 |
| word count tool | 12,000/月 | 高 | P0 |
| keyword density checker | 2,900/月 | 中 | P0 |
| free word counter | 8,100/月 | 中 | P1 |
| SEO keyword analyzer | 1,600/月 | 低 | P1 |

### 6.2 Meta 标签

```html
<title>Keyword Count Checker - Free Word Counter & Density Analyzer</title>
<meta name="description" content="Free online keyword count checker tool. Analyze word count, character count, keyword density, and SEO optimization for your content. No registration required.">
<meta name="keywords" content="keyword counter, word count, keyword density, SEO tool, free keyword checker, text analyzer">
<link rel="canonical" href="https://keywordcounter.com">
```

### 6.3 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Keyword Count Checker",
  "description": "Free online keyword analysis tool for SEO optimization",
  "applicationCategory": "SEO Tool",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": "Word count, Character count, Keyword density, SEO analysis"
}
```

---

## 7. 上线计划

### 7.1 里程碑

| 阶段 | 时间 | 交付物 |
|------|------|--------|
| 开发 | Day 1-2 | 核心功能完成 |
| 测试 | Day 3 | Bug 修复，性能优化 |
| 部署 | Day 4 | 上线 Vercel |
| SEO | Day 5-7 | 提交 Google Search Console |
| 推广 | Day 8-14 | Product Hunt, Reddit, Twitter |

### 7.2 任务清单

**开发阶段**:
- [ ] 初始化 Next.js 项目
- [ ] 实现文本分析核心逻辑
- [ ] 开发 UI 组件
- [ ] 响应式适配
- [ ] SEO meta 标签

**测试阶段**:
- [ ] 功能测试（边界情况）
- [ ] 性能测试（大文本）
- [ ] 浏览器兼容性
- [ ] 移动端测试

**部署阶段**:
- [ ] 购买域名
- [ ] 配置 Vercel
- [ ] 绑定域名
- [ ] HTTPS 证书

**推广阶段**:
- [ ] Product Hunt 发布
- [ ] Reddit 分享（r/SEO, r/blogging）
- [ ] Twitter 线程
- [ ] 提交到工具导航站

---

## 8. 成功指标

### 8.1 MVP 阶段（上线 30 天）

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 日活跃用户 | 100+ | Vercel Analytics |
| 页面停留时间 | > 2 分钟 | Analytics |
| 跳出率 | < 50% | Analytics |
| Google 收录 | 前 3 页 | 搜索排名 |

### 8.2 增长阶段（上线 90 天）

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 日活跃用户 | 1,000+ | Analytics |
| 自然搜索流量 | 50%+ | Analytics |
| 回访问户 | 30%+ | Analytics |
| 月收入 | $100+ | AdSense/Pro |

---

## 9. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 竞争激烈 | 高 | 差异化（更简洁、更快） |
| SEO 效果慢 | 中 | 多渠道推广（PH, Reddit） |
| 服务器成本 | 低 | Vercel 免费层够用 |
| 被抄袭 | 中 | 快速建立品牌认知 |

---

## 10. 附录

### 10.1 竞品分析

| 产品 | 优势 | 劣势 | 我们的差异化 |
|------|------|------|-------------|
| wordcounter.net | 流量大 | 广告多，界面乱 | 无广告，简洁 |
| charactercountonline.com | 功能多 | 体验差 | 更好的 UX |
| smallseotools.com | 工具全 | 太复杂 | 专注核心功能 |

### 10.2 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel 部署指南](https://vercel.com/docs)
- [SEO 最佳实践](https://developers.google.com/search/docs)

---

**文档结束**

*最后更新：2026-03-26*
