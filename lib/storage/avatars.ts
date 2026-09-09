export const AVATAR_BUCKET = "avatars" as const
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024

export const AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

type AvatarFileLike = {
  size: number
  type: string
}

export function isAllowedAvatarFile(file: AvatarFileLike) {
  return (
    file.size > 0 &&
    file.size <= MAX_AVATAR_FILE_SIZE &&
    AVATAR_MIME_TYPES.includes(file.type as (typeof AVATAR_MIME_TYPES)[number])
  )
}

export function createAvatarObjectPath(userId: string, fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()
  const safeExtension = extension && /^[a-z0-9]+$/.test(extension) ? extension : "bin"

  return `${userId}/${crypto.randomUUID()}.${safeExtension}`
}
