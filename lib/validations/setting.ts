import { z } from 'zod';

export const settingSchema = z.object({
  group: z.string().min(1),
  key: z.string().min(1),
  value: z.string().nullable(),
  type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'SELECT', 'FILE', 'COLOR', 'JSON']),
  options: z.string().nullable().optional(),
  label: z.string().min(1),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const settingUpdateSchema = z.object({
  value: z.string().nullable(),
});

export const bulkSettingUpdateSchema = z.array(
  z.object({
    group: z.string(),
    key: z.string(),
    value: z.string(),
  })
);

export type SettingInput = z.infer<typeof settingSchema>;
export type SettingUpdateInput = z.infer<typeof settingUpdateSchema>;
export type BulkSettingUpdateInput = z.infer<typeof bulkSettingUpdateSchema>;
