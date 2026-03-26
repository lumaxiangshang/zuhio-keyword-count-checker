# Zuhio Keyword Count Checker - 开发任务清单

## 🚀 快速开始

```bash
# 1. 创建项目
npx create-next-app@latest keyword-counter --typescript --tailwind --app
cd keyword-counter

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

---

## 📋 任务清单

### Phase 1: 核心功能（Day 1-2）

- [ ] **初始化项目**
  - [ ] 创建 Next.js 项目
  - [ ] 配置 Tailwind CSS
  - [ ] 设置项目结构

- [ ] **开发分析逻辑** (`lib/analyzer.ts`)
  - [ ] 基础统计函数（词数、字符数、句子数）
  - [ ] 关键词密度计算
  - [ ] Top 关键词提取
  - [ ] 停用词过滤

- [ ] **开发 UI 组件**
  - [ ] `Header.tsx` - 头部导航
  - [ ] `TextAnalyzer.tsx` - 文本输入区
  - [ ] `StatsCards.tsx` - 统计卡片
  - [ ] `KeywordInput.tsx` - 关键词输入
  - [ ] `KeywordTable.tsx` - 关键词表格

- [ ] **主页面集成** (`app/page.tsx`)
  - [ ] 组合所有组件
  - [ ] 实现实时分析
  - [ ] 添加清空功能

---

### Phase 2: SEO 优化（Day 3）

- [ ] **Meta 标签** (`app/layout.tsx`)
  - [ ] Title
  - [ ] Description
  - [ ] Keywords
  - [ ] Open Graph

- [ ] **结构化数据**
  - [ ] JSON-LD 脚本
  - [ ] WebApplication schema

- [ ] **SEO 文件**
  - [ ] `app/sitemap.ts`
  - [ ] `app/robots.ts`

- [ ] **社交分享图**
  - [ ] 设计 OG Image
  - [ ] 添加到 `public/og-image.png`

---

### Phase 3: 测试与优化（Day 4）

- [ ] **功能测试**
  - [ ] 空文本处理
  - [ ] 大文本性能（10 万 + 词）
  - [ ] 特殊字符处理
  - [ ] 多语言支持测试

- [ ] **浏览器兼容性**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **移动端测试**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] 响应式布局

- [ ] **性能优化**
  - [ ] Lighthouse 评分 > 90
  - [ ] 首屏加载 < 2s
  - [ ] 分析延迟 < 100ms

---

### Phase 4: 部署上线（Day 5）

- [ ] **域名**
  - [ ] 选择域名
  - [ ] Namecheap 购买
  - [ ] 配置 DNS（Cloudflare）

- [ ] **Vercel 部署**
  - [ ] 创建 Vercel 账号
  - [ ] 连接 GitHub 仓库
  - [ ] 部署生产环境
  - [ ] 绑定域名

- [ ] **分析工具**
  - [ ] 启用 Vercel Analytics
  - [ ] 配置 Google Search Console
  - [ ] 提交 sitemap

---

### Phase 5: 推广（Day 6-14）

- [ ] **Product Hunt**
  - [ ] 准备发布内容
  - [ ] 设计产品图
  - [ ] 预约发布日期
  - [ ] 发布并推广

- [ ] **Reddit**
  - [ ] r/SEO 分享
  - [ ] r/blogging 分享
  - [ ] r/webdev 分享
  - [ ] r/SideProject 分享

- [ ] **社交媒体**
  - [ ] Twitter 线程
  - [ ] LinkedIn 文章
  - [ ] Indie Hackers 分享

- [ ] **工具导航站**
  - [ ] 提交到 Product Hunt
  - [ ] 提交到 AlternativeTo
  - [ ] 提交到 SEO 工具导航

---

## 🎯 MVP 验收标准

- [ ] 核心功能完整（词数统计、关键词密度、Top 关键词）
- [ ] 响应式设计（桌面 + 移动端）
- [ ] Lighthouse 评分 > 90
- [ ] 域名绑定完成
- [ ] HTTPS 证书生效
- [ ] Google 可搜索收录

---

## 📁 文件清单

```
keyword-counter/
├── app/
│   ├── layout.tsx          [ ] SEO meta
│   ├── page.tsx            [ ] 主页面
│   ├── sitemap.ts          [ ] Sitemap
│   └── robots.ts           [ ] Robots.txt
├── components/
│   ├── Header.tsx          [ ]
│   ├── TextAnalyzer.tsx    [ ]
│   ├── StatsCards.tsx      [ ]
│   ├── KeywordInput.tsx    [ ]
│   └── KeywordTable.tsx    [ ]
├── lib/
│   └── analyzer.ts         [ ] 核心逻辑
├── public/
│   ├── favicon.ico         [ ]
│   └── og-image.png        [ ]
└── package.json            [ ]
```

---

## 🛠️ 技术细节

### 停用词列表

```typescript
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  // ... 完整列表见 PRD
]);
```

### SEO 密度阈值

- **理想**: 0.5% - 2.5%
- **警告**: > 4%

### 性能目标

- 分析 1 万词文本 < 100ms
- 首屏加载 < 2s
- Lighthouse > 90

---

**开始日期**: 2026-03-26  
**目标上线**: 2026-03-31
