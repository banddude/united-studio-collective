# SEO Optimizations for United Studio Collective

**Current SEO Score: ~9-10/10**

## Completed

| # | Optimization | Status |
|---|--------------|--------|
| 1 | Create sitemap.xml | ✅ Done (`app/sitemap.ts`) |
| 2 | Create robots.txt | ✅ Done (`app/robots.ts`) |
| 3 | Page-specific meta tags | ✅ Done (unique metadata per page via layouts) |
| 4 | Add canonical URLs | ✅ Done (in metadata) |
| 5 | Add Open Graph tags | ✅ Done (all pages) |
| 6 | Add Twitter Card tags | ✅ Done (all pages) |
| 7 | Add JSON-LD structured data | ✅ Done (Organization + LocalBusiness schemas) |
| 8 | Fix H1 hierarchy | ✅ Done (header changed to div, pages can have unique H1s) |
| 9 | Improve alt text | ✅ Done (all 23 photography images have descriptive alt text) |
| 10 | Add preconnect hints | ✅ Done (static.wixstatic.com, img.youtube.com, i.vimeocdn.com) |
| 11 | Dynamic product metadata | ✅ Done (generateMetadata for each product page) |
| 12 | Product schema | ✅ Done (JSON-LD Product schema with Offer details) |
| 13 | Breadcrumb schema | ✅ Done (BreadcrumbList schema on product pages) |
| 14 | VideoObject schema | ✅ Done (7 videos with full schema in filmmaking layout) |
| 15 | LocalBusiness schema | ✅ Done (local SEO with geo coordinates) |
| 16 | Person schema | ✅ Done (Evan Rene and Katie Chew profiles) |
| 17 | AboutPage schema | ✅ Done (team member information) |
| 18 | ItemList schema | ✅ Done (video gallery listing) |

## What's Implemented

### Core SEO
- Sitemap at `/sitemap.xml` with all pages
- Robots.txt allowing all crawlers
- Unique title and description per page
- Open Graph tags for social sharing (Facebook, LinkedIn, Discord)
- Twitter Card tags for Twitter/X previews
- Proper H1 hierarchy (one unique H1 per page)
- Descriptive alt text on all images
- Preconnect hints for faster external resource loading

### Structured Data (JSON-LD)
- **Organization schema** in root layout
- **LocalBusiness schema** with geo coordinates for local SEO
- **Product schema** on each product page with pricing, availability, seller
- **BreadcrumbList schema** for product navigation
- **VideoObject schema** for all 7 filmmaking videos
- **ItemList schema** for video gallery
- **Person schema** for team members (Evan Rene, Katie Chew)
- **AboutPage schema** linking team to organization

### Dynamic Metadata
- Product pages have unique titles, descriptions, OG images
- Each product page has canonical URL

## Page Metadata

| Page | Title |
|------|-------|
| Home | United Studio Collective | Los Angeles Video Production Company |
| About | About Us | United Studio Collective |
| Filmmaking | Filmmaking Portfolio | United Studio Collective |
| Photography | Photography Gallery | United Studio Collective |
| Store | Shop Fine Art Prints | United Studio Collective |
| Contact | Contact Us | United Studio Collective |
| Cart | Your Cart | United Studio Collective |
| Product (dynamic) | [Product Name] | United Studio Collective |

## Rich Snippets Expected

With the structured data implemented, the site can now generate:
- **Product rich snippets** in search results (price, availability)
- **Video rich snippets** for filmmaking content
- **Local business** info in Google Maps/local search
- **Breadcrumb navigation** in search results
- **Organization knowledge panel** potential
