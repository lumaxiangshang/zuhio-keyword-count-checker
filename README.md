# 🔍 Zuhio Keyword Count Checker

Free online keyword count checker tool for SEO optimization. Analyze word count, character count, keyword density, and more.

![Keyword Count Checker](https://img.shields.io/badge/SEO-Tool-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- 📊 **Word Count** - Accurate word and character counting
- 🔍 **Keyword Density** - Analyze keyword frequency and density
- 📈 **Top Keywords** - Extract most used keywords automatically
- ⏱️ **Reading Time** - Estimate reading time for your content
- 📱 **Responsive** - Works on desktop and mobile
- 🚀 **Fast** - Real-time analysis, no waiting
- ✅ **Free** - No registration required

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lumaxiangshang/zuhio-keyword-count-checker.git
cd zuhio-keyword-count-checker

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📁 Project Structure

```
zuhio-keyword-count-checker/
├── app/
│   ├── layout.tsx      # Root layout with SEO
│   ├── page.tsx        # Main page
│   ├── sitemap.ts      # Sitemap generation
│   ├── robots.ts       # Robots.txt
│   └── globals.css     # Global styles
├── lib/
│   └── analyzer.ts     # Core analysis logic
├── public/             # Static files
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Usage

1. **Paste your text** in the input area
2. **View real-time stats** - words, characters, sentences
3. **Enter a keyword** to check density
4. **Review top keywords** extracted from your text

## 📊 SEO Recommendations

| Keyword Density | Status |
|----------------|--------|
| < 0.5% | ⚠️ Too low |
| 0.5% - 2.5% | ✅ Ideal |
| 2.5% - 4% | ⚠️ Slightly high |
| > 4% | ❌ Keyword stuffing |

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- GitHub: [@lumaxiangshang](https://github.com/lumaxiangshang)
- Project: [Zuhio Keyword Count Checker](https://github.com/lumaxiangshang/zuhio-keyword-count-checker)
