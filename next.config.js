/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 适配配置
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // 禁用图像优化（Cloudflare Pages 不支持）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
