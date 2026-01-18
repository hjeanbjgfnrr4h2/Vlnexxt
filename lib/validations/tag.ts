import { z } from 'zod';

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().optional(),
  content: z.string().optional().nullable(),
  
  // SEO Fields
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  seoIndex: z.boolean().default(true),
});

export const tagUpdateSchema = tagSchema.partial();

export type TagInput = z.infer<typeof tagSchema>;
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
