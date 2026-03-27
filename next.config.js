/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 原生支持 Next.js
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
