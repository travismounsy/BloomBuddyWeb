import { supabase } from "../../../lib/supabase";

import type {
  CreateHabitInput,
  Habit,
  UpdateHabitInput,
} from "../types/habits";

export async function getHabits(): Promise<Habit[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to view habits.");
  }

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit[];
}

export async function getHabitById(
  habitId: string
): Promise<Habit> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to view this habit.");
  }

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Habit not found.");
  }

  return data as Habit;
}

export async function createHabit(
  input: CreateHabitInput
): Promise<Habit> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to create habits.");
  }

  const title = input.title.trim();

  if (!title) {
    throw new Error("Habit title cannot be empty.");
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      title,
      description: input.description?.trim() || null,
      category: input.category?.trim() || null,
      color: input.color || null,
      start_date: input.startDate,
      end_date: input.endDate || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit;
}

export async function updateHabit(
  habitId: string,
  input: UpdateHabitInput
): Promise<Habit> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to update habits.");
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    const title = input.title.trim();

    if (!title) {
      throw new Error("Habit title cannot be empty.");
    }

    updates.title = title;
  }

  if (input.description !== undefined) {
    updates.description = input.description?.trim() || null;
  }

  if (input.category !== undefined) {
    updates.category = input.category?.trim() || null;
  }

  if (input.color !== undefined) {
    updates.color = input.color;
  }

  if (input.startDate !== undefined) {
    updates.start_date = input.startDate;
  }

  if (input.endDate !== undefined) {
    updates.end_date = input.endDate;
  }

  if (input.isArchived !== undefined) {
    updates.is_archived = input.isArchived;
  }

  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Habit not found or could not be updated.");
  }

  return data as Habit;
}

export async function archiveHabit(
  habitId: string
): Promise<Habit> {
  return updateHabit(habitId, {
    isArchived: true,
  });
}

export async function deleteHabit(
  habitId: string
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to delete habits.");
  }

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}