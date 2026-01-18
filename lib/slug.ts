import { prisma } from './prisma';

/**
 * Generate a unique slug from a title
 * Handles duplicates by adding -1, -2, etc.
 */
export async function generateUniqueSlug(
  title: string,
  modelName: 'video' | 'category' | 'tag',
  excludeId?: string
): Promise<string> {
  // Convert title to slug
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  let slug = baseSlug;
  let counter = 0;

  // Check if slug exists
  while (true) {
    const exists = await checkSlugExists(slug, modelName, excludeId);
    if (!exists) {
      return slug;
    }
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

async function checkSlugExists(
  slug: string,
  modelName: 'video' | 'category' | 'tag',
  excludeId?: string
): Promise<boolean> {
  let result;

  switch (modelName) {
    case 'video':
      result = await prisma.video.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });
      break;
    case 'category':
      result = await prisma.category.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });
      break;
    case 'tag':
      result = await prisma.tag.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });
      break;
  }

  return result !== null;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
