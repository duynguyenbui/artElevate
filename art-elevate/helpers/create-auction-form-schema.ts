import { z } from 'zod';

export const createAuctionFormSchema = z.object({
  Artist: z.string().min(2, {
    message: 'Artist must be at least 2 characters.',
  }),
  Name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  Description: z
    .string()
    .min(10, {
      message: 'Description must be at least 2 characters.',
    })
    .max(500, {
      message: 'Description must not be longer than 500 characters.',
    }),
  Height: z.coerce.number().min(1, {
    message: 'Height must be at least 100 cm.',
  }),
  Width: z.coerce.number().min(100, {
    message: 'Width must be at least 100 cm.',
  }),
  Medium: z.string().min(2, {
    message: 'Medium must be at least 2 characters.',
  }),
  Year: z.coerce.number().min(0, {
    message: 'Year must be at least 0.',
  }),
  ReservePrice: z.coerce.number().min(1, {
    message: 'Reserve Price must be at least 1',
  }),
  AuctionEnd: z.date({
    required_error: 'A auction end is required.',
  }),
  // TODO: Image
});
