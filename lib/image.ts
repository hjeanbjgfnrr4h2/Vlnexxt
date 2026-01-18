import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export interface ThumbnailSizes {
  large: { width: number; height: number };
  medium: { width: number; height: number };
  small: { width: number; height: number };
  lazy: { width: number; height: number };
}

export const DEFAULT_THUMBNAIL_SIZES: ThumbnailSizes = {
  large: { width: 800, height: 600 },
  medium: { width: 400, height: 300 },
  small: { width: 200, height: 150 },
  lazy: { width: 20, height: 15 },
};

/**
 * Process and generate multiple thumbnail sizes from an uploaded image
 * Returns object with paths to all generated thumbnails
 */
export async function generateThumbnails(
  inputBuffer: Buffer,
  outputDir: string,
  filename: string,
  quality: number = 85,
  sizes: ThumbnailSizes = DEFAULT_THUMBNAIL_SIZES
): Promise<{
  original: string;
  large: string;
  medium: string;
  small: string;
  lazy: string;
}> {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const baseName = path.parse(filename).name;
  const ext = '.jpg';

  // Save original
  const originalPath = path.join(outputDir, `${baseName}-original${ext}`);
  await sharp(inputBuffer)
    .jpeg({ quality })
    .toFile(originalPath);

  // Generate large thumbnail (800x600)
  const largePath = path.join(outputDir, `${baseName}-large${ext}`);
  await sharp(inputBuffer)
    .resize(sizes.large.width, sizes.large.height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality })
    .toFile(largePath);

  // Generate medium thumbnail (400x300)
  const mediumPath = path.join(outputDir, `${baseName}-medium${ext}`);
  await sharp(inputBuffer)
    .resize(sizes.medium.width, sizes.medium.height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality })
    .toFile(mediumPath);

  // Generate small thumbnail (200x150)
  const smallPath = path.join(outputDir, `${baseName}-small${ext}`);
  await sharp(inputBuffer)
    .resize(sizes.small.width, sizes.small.height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality })
    .toFile(smallPath);

  // Generate lazy placeholder (20x15) - blurred
  const lazyPath = path.join(outputDir, `${baseName}-lazy${ext}`);
  await sharp(inputBuffer)
    .resize(sizes.lazy.width, sizes.lazy.height, {
      fit: 'cover',
      position: 'center',
    })
    .blur(5)
    .jpeg({ quality: 50 })
    .toFile(lazyPath);

  return {
    original: originalPath,
    large: largePath,
    medium: mediumPath,
    small: smallPath,
    lazy: lazyPath,
  };
}

/**
 * Convert image to WebP format
 */
export async function convertToWebP(
  inputPath: string,
  quality: number = 85
): Promise<string> {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  await sharp(inputPath)
    .webp({ quality })
    .toFile(outputPath);
  return outputPath;
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
