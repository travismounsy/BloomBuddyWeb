import { supabase } from "../../../lib/supabase";

import type { HabitCompletion } from "../types/habits";

export async function getCompletionsForDate(
  date: string
): Promise<HabitCompletion[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view habit completions."
    );
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", user.id)
    .eq("completion_date", date);

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitCompletion[];
}

export async function markHabitComplete(
  habitId: string,
  date: string
): Promise<HabitCompletion> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to complete habits."
    );
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .insert({
      habit_id: habitId,
      user_id: user.id,
      completion_date: date,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitCompletion;
}

export async function unmarkHabitComplete(
  habitId: string,
  date: string
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to update habit completions."
    );
  }

  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("completion_date", date);

  if (error) {
    throw new Error(error.message);
  }
}

export async function isHabitComplete(
  habitId: string,
  date: string
): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view habit completions."
    );
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("id")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("completion_date", date)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}