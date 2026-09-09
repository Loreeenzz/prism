import { describe, expect, it } from "vitest"

import {
  createAvatarObjectPath,
  isAllowedAvatarFile,
  MAX_AVATAR_FILE_SIZE,
} from "@/lib/storage/avatars"

describe("avatar storage helpers", () => {
  it("accepts supported image files within the size limit", () => {
    expect(isAllowedAvatarFile({ size: 1024, type: "image/png" })).toBe(true)
  })

  it("rejects unsupported types and oversized files", () => {
    expect(isAllowedAvatarFile({ size: 1024, type: "image/svg+xml" })).toBe(false)
    expect(
      isAllowedAvatarFile({ size: MAX_AVATAR_FILE_SIZE + 1, type: "image/png" }),
    ).toBe(false)
  })

  it("creates a unique user-scoped object path", () => {
    const path = createAvatarObjectPath("user-123", "profile.PNG")

    expect(path).toMatch(/^user-123\/[0-9a-f-]+\.png$/)
  })
})
