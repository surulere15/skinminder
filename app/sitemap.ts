import { MetadataRoute } from 'next';

const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinminder.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/how-it-works',
    '/demo',
    '/safety',
    '/privacy',
    '/claim',
    '/seller',
    '/login',
    '/signup',
  ];

  return routes.map((route) => ({
    url: `${url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
