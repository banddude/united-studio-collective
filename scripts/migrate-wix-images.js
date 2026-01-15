#!/usr/bin/env node

/**
 * Migrate all Wix images to GitHub repository
 * Downloads images and prepares them for local hosting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Collect all unique Wix URLs from content files
function collectWixUrls() {
  const urls = new Map(); // url -> { category, filename }

  // Photography
  const photography = JSON.parse(fs.readFileSync('content/photography.json', 'utf8'));
  photography.images.forEach((img, i) => {
    if (img.src.includes('wixstatic.com')) {
      const filename = extractFilename(img.src);
      urls.set(img.src, { category: 'photography', filename, index: i });
    }
  });

  // Homepage
  const homepage = JSON.parse(fs.readFileSync('content/homepage.json', 'utf8'));
  homepage.gallery_images.forEach((img, i) => {
    if (img.src.includes('wixstatic.com') && !urls.has(img.src)) {
      const filename = extractFilename(img.src);
      urls.set(img.src, { category: 'homepage', filename, index: i });
    }
  });

  // Collective
  const collective = JSON.parse(fs.readFileSync('content/collective.json', 'utf8'));
  collective.members.forEach((member, i) => {
    if (member.image && member.image.includes('wixstatic.com') && !urls.has(member.image)) {
      const filename = extractFilename(member.image);
      urls.set(member.image, { category: 'collective', filename, index: i });
    }
  });

  // Store
  const store = JSON.parse(fs.readFileSync('public/config/store.json', 'utf8'));
  store.products.forEach((product, i) => {
    if (product.image.includes('wixstatic.com') && !urls.has(product.image)) {
      const filename = extractFilename(product.image);
      urls.set(product.image, { category: 'store', filename, index: i });
    }
  });

  // Video thumbnails
  const videos = JSON.parse(fs.readFileSync('app/filmmaking/videos.json', 'utf8'));
  videos.forEach((video, i) => {
    if (video.thumbnail && video.thumbnail.includes('wixstatic.com') && !urls.has(video.thumbnail)) {
      const filename = extractFilename(video.thumbnail);
      urls.set(video.thumbnail, { category: 'videos', filename, index: i });
    }
  });

  return urls;
}

function extractFilename(url) {
  // Extract the base filename from Wix URL
  // Example: https://static.wixstatic.com/media/963954_3b1ade74535044fcba87f864819ad9bf~mv2.jpg
  const match = url.match(/\/media\/([^/]+)/);
  if (match) {
    // Clean up filename - remove any URL params and get just the file
    let filename = match[1].split('?')[0].split('/')[0];
    // If it has fill params in path, just get base name
    if (!filename.endsWith('.jpg') && !filename.endsWith('.png')) {
      filename = filename + '.jpg';
    }
    return filename;
  }
  return 'unknown.jpg';
}

function getFullQualityUrl(wixUrl) {
  // Convert Wix URL to full quality version
  // Remove any /v1/fill/... parameters to get original
  const match = wixUrl.match(/(https:\/\/static\.wixstatic\.com\/media\/[^/]+)/);
  if (match) {
    return match[1];
  }
  return wixUrl;
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = getFullQualityUrl(url);
    console.log(`Downloading: ${fullUrl}`);

    const protocol = fullUrl.startsWith('https') ? https : http;

    const request = protocol.get(fullUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${fullUrl}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  Saved: ${destPath}`);
        resolve(destPath);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${fullUrl}`));
    });
  });
}

async function main() {
  console.log('Collecting Wix URLs from content files...\n');
  const urls = collectWixUrls();
  console.log(`Found ${urls.size} unique Wix images\n`);

  // Create directories
  const dirs = ['photography', 'homepage', 'collective', 'store', 'videos'];
  dirs.forEach(dir => {
    const fullPath = path.join('public/images', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Download all images
  const urlMapping = {};
  let downloaded = 0;
  let failed = 0;

  for (const [wixUrl, info] of urls) {
    const destDir = `public/images/${info.category}`;
    const destPath = path.join(destDir, info.filename);
    const localPath = `/images/${info.category}/${info.filename}`;

    try {
      await downloadImage(wixUrl, destPath);
      urlMapping[wixUrl] = localPath;
      downloaded++;
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failed++;
    }

    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDownloaded: ${downloaded}, Failed: ${failed}`);

  // Save URL mapping for updating JSON files
  fs.writeFileSync('scripts/url-mapping.json', JSON.stringify(urlMapping, null, 2));
  console.log('\nURL mapping saved to scripts/url-mapping.json');
  console.log('Run update-urls.js to update content files');
}

main().catch(console.error);
