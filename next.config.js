/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel SSR 部署配置
  output: 'standalone',
  
  // 图片优化
  images: {
    domains: ['assets.vercel.app'],
  },
  
  // React Strict Mode
  reactStrictMode: true,
  
  // 优化构建
  swcMinify: true,
  
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
