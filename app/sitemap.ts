export const runtime = 'edge';

export default function sitemap() {
  return [
    {
      url: 'https://zuhio.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
