export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateAvatar(file: File): string | null {
  if (
    !ALLOWED_AVATAR_TYPES.includes(
      file.type as (typeof ALLOWED_AVATAR_TYPES)[number]
    )
  ) {
    return "Please select a JPEG, PNG, or WebP image.";
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return "The image must be 2 MB or smaller.";
  }

  return null;
}