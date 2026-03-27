/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
