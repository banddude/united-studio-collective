import { MetadataRoute } from 'next'

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/config/'],
    },
    sitemap: 'https://banddude.github.io/united-studio-collective/sitemap.xml',
  }
}
