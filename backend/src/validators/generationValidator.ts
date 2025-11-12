import { z } from 'zod';

export const createGenerationSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(500, 'Prompt must be less than 500 characters'),
  style: z.string().min(1, 'Style is required'),
});
