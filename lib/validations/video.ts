import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().optional(),
  iframeUrl: z.string().url('Invalid URL').min(1, 'Iframe URL is required'),
  
  // SEO Fields
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  seoKeywords: z.string().max(255).optional().nullable(),
  seoIndex: z.boolean().default(true),
  seoFollow: z.boolean().default(true),
  canonicalUrl: z.string().nullable().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Invalid URL',
  }).optional(),
  
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  publishedAt: z.string().datetime().optional().nullable(),
  
  // Relations (IDs arrays)
  tagIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
});

export const videoUpdateSchema = videoSchema.partial();

export type VideoInput = z.infer<typeof videoSchema>;
export type VideoUpdateInput = z.infer<typeof videoUpdateSchema>;
