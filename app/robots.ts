import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/scan/', '/dashboard/', '/settings/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skinminder.ai'}/sitemap.xml`,
  };
}
