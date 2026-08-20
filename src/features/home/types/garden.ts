export type PlantGrowthStage =
  | "empty"
  | "sprout"
  | "small"
  | "growing"
  | "blooming"
  | "full";

export type DailyGardenProgress = {
  scheduledCount: number;
  completedCount: number;
  completionRate: number;
  growthStage: PlantGrowthStage;
};