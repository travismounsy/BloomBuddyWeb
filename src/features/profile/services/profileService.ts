import { supabase } from "../../../lib/supabase";

export type Profile = {
  id: string;
  public_id: string;
  display_name: string;
  avatar_path: string | null;
  garden_visibility: "private" | "connections";
  created_at: string;
  updated_at: string;
};

export async function getCurrentProfile(): Promise<Profile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to view your profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      public_id,
      display_name,
      avatar_path,
      garden_visibility,
      created_at,
      updated_at
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No profile was found for this account.");
  }

  return data as Profile;
}

export async function updateDisplayName(
  displayName: string
): Promise<Profile> {
  const trimmedName = displayName.trim();

  if (!trimmedName) {
    throw new Error("Display name cannot be empty.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to update your profile."
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: trimmedName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select(`
      id,
      public_id,
      display_name,
      avatar_path,
      garden_visibility,
      created_at,
      updated_at
    `)
    .maybeSingle();

  if (error) {
    console.error("Display name update failed:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "Your profile could not be updated."
    );
  }

  return data as Profile;
}

export async function updateGardenVisibility(
  visibility: "private" | "connections"
): Promise<Profile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to update garden visibility."
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      garden_visibility: visibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select(`
      id,
      public_id,
      display_name,
      avatar_path,
      garden_visibility,
      created_at,
      updated_at
    `)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Unable to load the updated profile.");
  }

  return data as Profile;
}