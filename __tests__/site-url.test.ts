import { afterEach, describe, expect, it } from 'vitest'

import { getSiteUrl } from '@/lib/site-url'

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
const originalVercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl

  if (originalVercelUrl === undefined) delete process.env.NEXT_PUBLIC_VERCEL_URL
  else process.env.NEXT_PUBLIC_VERCEL_URL = originalVercelUrl
})

describe('getSiteUrl', () => {
  it('prefers the explicitly configured site URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://prism.example.com///'
    process.env.NEXT_PUBLIC_VERCEL_URL = 'preview.example.com'

    expect(getSiteUrl()).toBe('https://prism.example.com')
  })

  it('normalizes a Vercel hostname when no site URL is configured', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_VERCEL_URL = 'preview.example.com'

    expect(getSiteUrl()).toBe('https://preview.example.com')
  })

  it('falls back to localhost for local development', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_VERCEL_URL

    expect(getSiteUrl()).toBe('http://localhost:3000')
  })
})
