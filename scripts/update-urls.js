#!/usr/bin/env node

/**
 * Update all content files to use local image paths instead of Wix URLs
 */

const fs = require('fs');

// Load the URL mapping
const urlMapping = JSON.parse(fs.readFileSync('scripts/url-mapping.json', 'utf8'));

function updateUrls(obj) {
  if (typeof obj === 'string') {
    // Check if this string is a Wix URL we have a mapping for
    for (const [wixUrl, localPath] of Object.entries(urlMapping)) {
      if (obj === wixUrl || obj.startsWith(wixUrl.split('/v1/')[0])) {
        return localPath;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(updateUrls);
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = updateUrls(value);
    }
    return result;
  }
  return obj;
}

function updateFile(filePath) {
  console.log(`Updating ${filePath}...`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updated = updateUrls(content);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  console.log(`  Done`);
}

// Update all content files
const files = [
  'content/photography.json',
  'content/homepage.json',
  'content/collective.json',
  'public/config/store.json',
  'app/filmmaking/videos.json'
];

files.forEach(updateFile);

console.log('\nAll files updated with local image paths!');
