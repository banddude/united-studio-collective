#!/usr/bin/env node
/**
 * Image Optimization Script
 * Creates thumb (400px), medium (2000px), and full versions of all photography images
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PHOTOGRAPHY_DIR = './public/images/photography';
const THUMB_WIDTH = 400;
const MEDIUM_WIDTH = 2000;
const JPEG_QUALITY = 85;

async function processImage(filename) {
  const inputPath = path.join(PHOTOGRAPHY_DIR, filename);
  const baseName = filename.replace(/\.[^.]+$/, '');
  const ext = path.extname(filename).toLowerCase();

  // Skip if already a thumb/medium/full version or not an image
  if (baseName.startsWith('thumb_') || baseName.startsWith('medium_') || baseName.startsWith('full_')) {
    return null;
  }

  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    console.log(`Skipping non-image: ${filename}`);
    return null;
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Processing: ${filename} (${metadata.width}x${metadata.height})`);

    // Create thumbnail
    const thumbPath = path.join(PHOTOGRAPHY_DIR, `thumb_${baseName}.jpg`);
    await sharp(inputPath)
      .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbPath);
    console.log(`  Created thumb: thumb_${baseName}.jpg`);

    // Create medium version
    const mediumPath = path.join(PHOTOGRAPHY_DIR, `medium_${baseName}.jpg`);
    await sharp(inputPath)
      .resize(MEDIUM_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(mediumPath);
    console.log(`  Created medium: medium_${baseName}.jpg`);

    // Create full version (just optimize, don't resize)
    const fullPath = path.join(PHOTOGRAPHY_DIR, `full_${baseName}.jpg`);
    await sharp(inputPath)
      .jpeg({ quality: 90 })
      .toFile(fullPath);
    console.log(`  Created full: full_${baseName}.jpg`);

    return {
      original: `/images/photography/${filename}`,
      thumb: `/images/photography/thumb_${baseName}.jpg`,
      medium: `/images/photography/medium_${baseName}.jpg`,
      full: `/images/photography/full_${baseName}.jpg`,
    };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

async function updatePhotographyJson(imageMap) {
  const jsonPath = './content/photography.json';
  const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

  // Update each image entry
  data.images = data.images.map(img => {
    const mapping = imageMap[img.src];
    if (mapping) {
      return {
        ...img,
        src: mapping.medium, // Default src is medium
        thumb: mapping.thumb,
        medium: mapping.medium,
        full: mapping.full,
      };
    }
    return img;
  });

  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  console.log('\nUpdated photography.json');
}

async function main() {
  console.log('Starting image optimization...\n');

  const files = await fs.readdir(PHOTOGRAPHY_DIR);
  const imageMap = {};

  for (const file of files) {
    const result = await processImage(file);
    if (result) {
      imageMap[result.original] = result;
    }
  }

  console.log(`\nProcessed ${Object.keys(imageMap).length} images`);

  if (Object.keys(imageMap).length > 0) {
    await updatePhotographyJson(imageMap);
  }

  console.log('\nDone!');
}

main().catch(console.error);
