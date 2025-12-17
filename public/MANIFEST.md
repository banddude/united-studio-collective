# United Studio Collective - Visual Assets Manifest

Downloaded: December 10, 2024
Source: https://www.unitedstudiocollective.com

## Summary
This directory contains all visual assets from the United Studio Collective website, including logo, portfolio images, custom fonts, and favicon.

---

## Assets Inventory

### Logo & Branding

**logo.png**
- Original URL: `https://static.wixstatic.com/media/01c3aff52f2a4dffa526d7a9843d46ea.png`
- File Size: 21 KB
- Dimensions: 200 x 200 px
- Format: PNG (RGBA, 8-bit/color)
- Usage: Instagram social media icon in footer
- Location on site: Footer social bar

---

### Favicon

**favicon.ico**
- Original URL: `https://static.parastorage.com/client/pfavico.ico`
- File Size: 1.1 KB
- Format: ICO
- Usage: Browser tab icon
- Location: Site-wide (browser tab)

---

### Portfolio Gallery Images

The following images are displayed in the main portfolio gallery on the homepage. Each image links to a specific section of the website.

#### image_1.jpg
- Original URL: `https://static.wixstatic.com/media/963954_3b1ade74535044fcba87f864819ad9bf~mv2.jpg`
- File Size: 1.4 MB
- Original filename: `20231025-img20200820_15111740 copy.jpg`
- Dimensions: 2048 x 1303 px
- Usage: Portfolio gallery item #5
- Links to: Contact page
- Alt text: None
- Location: Homepage gallery (bottom position)

#### image_2.jpg
- Original URL: `https://static.wixstatic.com/media/963954_4433bed26cae4977aec34e1769c72c38~mv2.jpg`
- File Size: 1.7 MB
- Original filename: `20210420-Screen-8.1.jpg`
- Dimensions: 2048 x 2017 px
- Usage: Portfolio gallery item #4
- Links to: About page
- Alt text: None
- Location: Homepage gallery (4th position)

#### image_3.jpg
- Original URL: `https://static.wixstatic.com/media/963954_c4beeeacd4d143c8aeeebae3bf9a4e49~mv2.jpg`
- File Size: 5.0 MB
- Original filename: `20220117-LightRoom_Edit-1.jpg`
- Dimensions: 2039 x 2048 px
- Usage: Portfolio gallery item #2
- Links to: Photography page
- Alt text: "LightRoom_Edit-1.jpg"
- Location: Homepage gallery (2nd position)

#### image_4.jpg
- Original URL: `https://static.wixstatic.com/media/963954_c62af60703dd4601859d5cee56ff3e17~mv2.jpg`
- File Size: 977 KB
- Original filename: `20220210-EP_Colored_Edit_210727.00_01_46_14.Still006.jpg`
- Dimensions: 2048 x 1152 px
- Usage: Portfolio gallery item #1
- Links to: Filmmaking page
- Alt text: "EP_Colored_Edit_210727.00_01_46_14.Still006.jpg"
- Location: Homepage gallery (top/first position)

#### image_5.jpg
- Original URL: `https://static.wixstatic.com/media/963954_d1783f6f4df14475a4b284c0613f5421~mv2.jpg`
- File Size: 2.9 MB
- Original filename: `20230613-20230613-IMG_4298.jpg`
- Dimensions: 2048 x 1365 px
- Usage: Portfolio gallery item #3
- Links to: Store page (all products)
- Alt text: None
- Location: Homepage gallery (3rd position)

---

### Custom Fonts

The site uses a custom font family throughout. Three format variations are provided for cross-browser compatibility:

**custom_font.woff2**
- Original URL: `https://static.wixstatic.com/ufonts/2a33bf_eccf6d963f36487791ef67b682b144a3/woff2/file.woff2`
- File Size: 50 KB
- Format: WOFF2 (modern browsers)
- Font ID: `2a33bf_eccf6d963f36487791ef67b682b144a3`
- Usage: Primary font for site text and headings
- Font name referenced as: `wfont_2a33bf_eccf6d963f36487791ef67b682b144a3, wf_eccf6d963f36487791ef67b68, orig_expresswayrgregular`

**custom_font.woff**
- Original URL: `https://static.wixstatic.com/ufonts/2a33bf_eccf6d963f36487791ef67b682b144a3/woff/file.woff`
- File Size: 71 KB
- Format: WOFF (legacy browser support)
- Font ID: `2a33bf_eccf6d963f36487791ef67b682b144a3`
- Usage: Fallback for browsers without WOFF2 support

**custom_font.ttf**
- Original URL: `https://static.wixstatic.com/ufonts/2a33bf_eccf6d963f36487791ef67b682b144a3/ttf/file.ttf`
- File Size: 153 KB
- Format: TrueType Font
- Font ID: `2a33bf_eccf6d963f36487791ef67b682b144a3`
- Usage: Fallback for older browsers

---

## Assets NOT Found

### Videos
- No video content (MP4, WebM) was found embedded on the homepage
- Site uses static images for all visual content
- Note: The site does reference video hosting infrastructure (`https://video.wixstatic.com/`) but no videos were actively loaded

### Additional Icons
- No separate icon files beyond the logo/social media icon
- No custom SVG icons downloaded (only inline SVG for UI elements)
- Navigation and UI elements use CSS-based styling

### Background Images
- No separate background image files
- Page backgrounds use solid colors defined in CSS

---

## Social Media & External Links

**Instagram**
- URL: `https://www.instagram.com/unitedstudiocollective/`
- Icon: Uses logo.png
- Location: Footer social bar

---

## Site Structure

The site has the following main sections:
1. **Home** (current page)
2. **Filmmaking** (`/filmmaking-2`)
3. **Photography** (`/photography`)
4. **Store** (`/category/all-products`)
5. **About** (`/about`)
6. **Contact** (`/contact`)

The homepage gallery serves as visual navigation, with each image linking to one of these main sections.

---

## Technical Notes

- **Platform**: Wix (built with Wix Thunderbolt)
- **Image Hosting**: static.wixstatic.com
- **Responsive Images**: The site serves different image sizes based on device (AVIF format preferred)
- **Font Hosting**: static.wixstatic.com
- **Asset CDN**: Uses Parastorage CDN for static assets

### Font Usage
The custom font (Expressway RG Regular) is used extensively:
- Site title: "UNITED STUDIO COLLECTIVE"
- Navigation menu
- Footer text
- Body text throughout

### Image Optimization
Original images are served through Wix's image optimization pipeline with:
- Multiple resolutions (1x, 2x, 3x, 4x, 5x for retina displays)
- AVIF format encoding
- Quality parameter: 90 (high quality)
- Lazy loading enabled

---

## File Organization

```
/Users/mikeshaffer/evan/assets/
├── MANIFEST.md (this file)
├── favicon.ico
├── logo.png
├── image_1.jpg (Contact page link)
├── image_2.jpg (About page link)
├── image_3.jpg (Photography page link)
├── image_4.jpg (Filmmaking page link)
├── image_5.jpg (Store page link)
├── custom_font.woff2
├── custom_font.woff
└── custom_font.ttf
```

---

**Total Assets**: 11 files
**Total Size**: ~13 MB

---

*This manifest was generated on December 10, 2024*
