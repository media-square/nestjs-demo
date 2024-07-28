import { z } from 'zod';

export const AdvisorBaseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(12),
  name: z.string().min(1).max(255),
});

export const AdvisorCreateScheme = AdvisorBaseSchema.omit({
  id: true,
});

export const AdvisorScheme = AdvisorBaseSchema.omit({
  password: true,
});

export type AdvisorBaseDto = z.infer<typeof AdvisorBaseSchema>;
export type AdvisorDto = z.infer<typeof AdvisorScheme>;
export type AdvisorCreateDto = z.infer<typeof AdvisorCreateScheme>;
