import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().optional(),
  parentId: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  
  // SEO Fields
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  seoIndex: z.boolean().default(true),
  
  sortOrder: z.number().int().default(0),
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
