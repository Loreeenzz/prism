import * as z from 'zod'

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address.' }))

const passwordSchema = z
  .string()
  .min(8, { error: 'Password must be at least 8 characters long.' })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: 'Enter your password.' }),
})

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    repeatPassword: z.string(),
  })
  .refine((values) => values.password === values.repeatPassword, {
    path: ['repeatPassword'],
    error: 'Passwords do not match.',
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const updatePasswordSchema = z.object({
  password: passwordSchema,
})
