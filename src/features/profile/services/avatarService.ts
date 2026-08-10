import { supabase } from "../../../lib/supabase";
import { validateAvatar } from "../utils/avatarValidation";

export async function uploadAvatar(file: File): Promise<string> {
  const validationError = validateAvatar(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to upload an avatar.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw new Error("Invalid avatar filename.");
  }

  const avatarPath = `${user.id}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(avatarPath, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_path: avatarPath,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return avatarPath;
}

export function getAvatarUrl(
  avatarPath: string | null
): string | null {
  if (!avatarPath) {
    return null;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarPath);

  return data.publicUrl;
}

export async function removeAvatar(
  avatarPath: string | null
): Promise<void> {
  if (!avatarPath) {
    return;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to remove your avatar.");
  }

  const { error: deleteError } = await supabase.storage
    .from("avatars")
    .remove([avatarPath]);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_path: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }
}