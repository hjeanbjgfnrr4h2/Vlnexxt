import { z } from 'zod';

export const menuItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  url: z.string().optional().nullable(),
  target: z.string().default('_self'),
  icon: z.string().optional().nullable(),
  linkableType: z.enum(['category', 'tag', 'video', 'custom']).optional().nullable(),
  linkableId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  depth: z.number().int().default(0),
});

export const menuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  location: z.enum(['HEADER', 'FOOTER', 'SIDEBAR']),
  items: z.array(menuItemSchema).default([]),
});

export const menuUpdateSchema = menuSchema.partial();

export type MenuInput = z.infer<typeof menuSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuUpdateInput = z.infer<typeof menuUpdateSchema>;
