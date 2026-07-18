import { z } from 'zod';

/**
 * Reusable Zod schemas for form validation.
 */

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long')
  .regex(/^[+]?[\d\s-]{10,15}$/, 'Enter a valid phone number');

export const emailSchema = z
  .string()
  .email('Enter a valid email address');

export const emailOptionalSchema = z
  .union([z.string().email('Enter a valid email address'), z.literal('')])
  .optional();

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(150, 'Name is too long');

export const addressSchema = z
  .string()
  .min(10, 'Please enter a complete address')
  .max(500, 'Address is too long');

export const skuSchema = z
  .string()
  .min(1, 'SKU is required')
  .max(50, 'SKU is too long')
  .regex(/^[A-Za-z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens');

export const priceSchema = z
  .coerce
  .number({ invalid_type_error: 'Price must be a number' })
  .min(0, 'Price cannot be negative');

export const quantitySchema = z
  .coerce
  .number({ invalid_type_error: 'Quantity must be a number' })
  .int('Quantity must be a whole number')
  .min(0, 'Quantity cannot be negative');

/**
 * Checkout form schema.
 */
export const checkoutFormSchema = z.object({
  customer_name: nameSchema,
  customer_phone: phoneSchema,
  customer_email: emailOptionalSchema,
  address: addressSchema,
  special_instructions: z.string().max(1000).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Admin login form schema.
 */
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

/**
 * Product form schema.
 */
export const productFormSchema = z.object({
  sku: skuSchema,
  name: z.string().min(1, 'Product name is required').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().max(5000).optional(),
  base_price: priceSchema,
  unit: z.string().max(30).optional(),
  width: z.coerce.number().positive().optional().or(z.literal('')),
  height: z.coerce.number().positive().optional().or(z.literal('')),
  size_unit: z.string().max(20).optional(),
  material: z.string().max(100).optional(),
  finish: z.string().max(100).optional(),
  stock_quantity: quantitySchema,
  min_stock_warning: quantitySchema,
  is_active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Contact form schema.
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
