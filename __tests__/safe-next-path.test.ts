import { describe, expect, it } from 'vitest'

import { safeNextPath } from '@/lib/safe-next-path'

const origin = 'https://prism.example.com'

describe('safeNextPath', () => {
  it('allows same-origin paths with query and hash values', () => {
    expect(safeNextPath('/protected?tab=home#summary', '/', origin)).toBe(
      '/protected?tab=home#summary',
    )
  })

  it('rejects absolute external URLs', () => {
    expect(safeNextPath('https://evil.example.com', '/auth/login', origin)).toBe(
      '/auth/login',
    )
  })

  it('rejects protocol-relative external URLs', () => {
    expect(safeNextPath('//evil.example.com', '/auth/login', origin)).toBe(
      '/auth/login',
    )
  })

  it('uses the fallback for missing or malformed values', () => {
    expect(safeNextPath(undefined, '/auth/login', origin)).toBe('/auth/login')
    expect(safeNextPath(42, '/auth/login', origin)).toBe('/auth/login')
  })
})
