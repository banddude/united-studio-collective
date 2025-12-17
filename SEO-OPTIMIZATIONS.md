# SEO Optimizations for United Studio Collective

**Current SEO Score: ~3/10**

## HIGH PRIORITY (Do First)

| # | Optimization | Current State | Fix |
|---|--------------|---------------|-----|
| 1 | **Create sitemap.xml** | Missing | Add `app/sitemap.ts` |
| 2 | **Create robots.txt** | Missing | Add `app/robots.ts` |
| 3 | **Page-specific meta tags** | All pages share same title/description | Add unique metadata export to each page |
| 4 | **Add canonical URLs** | Missing | Prevents duplicate content issues with basePath |
| 5 | **Add Open Graph tags** | Missing | Better Facebook/LinkedIn/Discord previews |

## MEDIUM PRIORITY

| # | Optimization | Current State | Fix |
|---|--------------|---------------|-----|
| 6 | **Add Twitter Card tags** | Missing | Better Twitter/X previews |
| 7 | **Add JSON-LD structured data** | Missing | Organization, LocalBusiness, VideoObject schemas |
| 8 | **Fix H1 hierarchy** | Same H1 ("UNITED STUDIO COLLECTIVE") on every page | Unique descriptive H1 per page content |
| 9 | **Improve alt text** | Some generic ("Photography 7") | Descriptive alt text for all images |

## LOW PRIORITY

| # | Optimization | Current State | Fix |
|---|--------------|---------------|-----|
| 10 | **Dynamic product metadata** | Store products share generic meta | Add generateMetadata() for product pages |

## What Currently Exists

- Basic title and description in root layout
- Good alt text on most images
- Proper viewport configuration
- Language attribute set to "en"

## What's Missing

- No sitemap.xml
- No robots.txt
- No Open Graph tags (og:title, og:image, etc.)
- No Twitter Card tags
- No structured data (JSON-LD)
- No canonical URLs
- Same meta title/description on ALL pages
- No unique H1 tags per page

## Implementation Examples

### 1. Create sitemap.ts
Create `app/sitemap.ts`:
```ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://banddude.github.io/united-studio-collective'

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/filmmaking`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/photography`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/store`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ]
}
```

### 2. Create robots.ts
Create `app/robots.ts`:
```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://banddude.github.io/united-studio-collective/sitemap.xml',
  }
}
```

### 3. Page-Specific Metadata Example
Add to each page.tsx (e.g., `app/about/page.tsx`):
```ts
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | United Studio Collective',
  description: 'Meet the team behind United Studio Collective, a Los Angeles based video production company.',
  openGraph: {
    title: 'About Us | United Studio Collective',
    description: 'Meet the team behind United Studio Collective.',
    url: 'https://banddude.github.io/united-studio-collective/about',
    siteName: 'United Studio Collective',
    type: 'website',
  },
}
```

### 4. Recommended Page Titles

| Page | Title |
|------|-------|
| Home | United Studio Collective \| Los Angeles Video Production |
| About | About Us \| United Studio Collective |
| Filmmaking | Filmmaking Portfolio \| United Studio Collective |
| Photography | Photography Gallery \| United Studio Collective |
| Store | Shop Prints \| United Studio Collective |
| Contact | Contact Us \| United Studio Collective |
| Cart | Your Cart \| United Studio Collective |

## Estimated Impact

With HIGH PRIORITY items implemented:
- **SEO Score: 3/10 to 8-9/10**
- Better search engine indexing
- Rich social media previews when shared
- Improved local search visibility (LA video production)
