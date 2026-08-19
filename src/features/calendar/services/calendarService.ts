import { supabase } from "../../../lib/supabase";

import type { HabitCompletion } from "../../habits/types/habits";

export async function getCompletionsForRange(
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view calendar progress."
    );
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", user.id)
    .gte("completion_date", startDate)
    .lte("completion_date", endDate);

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitCompletion[];
}