import { describe, expect, it } from 'vitest'

import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
  updatePasswordSchema,
} from '@/lib/validators/auth'

describe('authentication validators', () => {
  it('normalizes a valid login email', () => {
    const result = loginSchema.safeParse({
      email: '  USER@EXAMPLE.COM  ',
      password: 'correct horse battery staple',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('user@example.com')
    }
  })

  it('rejects invalid login credentials before the provider call', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual(
        expect.arrayContaining(['email', 'password']),
      )
    }
  })

  it('requires matching signup passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'correct horse battery staple',
      repeatPassword: 'different password',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['repeatPassword'])
    }
  })

  it('enforces the shared minimum password length', () => {
    expect(
      updatePasswordSchema.safeParse({ password: 'short' }).success,
    ).toBe(false)
    expect(
      updatePasswordSchema.safeParse({ password: 'long-enough-password' }).success,
    ).toBe(true)
  })

  it('uses the same email rules for password recovery', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true)
    expect(forgotPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(false)
  })
})
