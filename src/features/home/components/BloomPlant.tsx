import {
  useEffect,
  useRef,
  useState,
} from "react";

import stageEmpty from "../../../assets/plants/stage-empty.png";
import stageSprout from "../../../assets/plants/stage-sprout.png";
import stageSmall from "../../../assets/plants/stage-small.png";
import stageGrowing from "../../../assets/plants/stage-growing.png";
import stageBlooming from "../../../assets/plants/stage-blooming.png";
import stageFull from "../../../assets/plants/stage-full.png";

import type {
  PlantGrowthStage,
} from "../types/garden";

type BloomPlantProps = {
  stage: PlantGrowthStage;
  completionRate: number;
};

const plantImages: Record<
  PlantGrowthStage,
  string
> = {
  empty: stageEmpty,
  sprout: stageSprout,
  small: stageSmall,
  growing: stageGrowing,
  blooming: stageBlooming,
  full: stageFull,
};

const plantMessages: Record<
  PlantGrowthStage,
  string
> = {
  empty: "Your Bloom Buddy is ready to grow.",
  sprout: "A little progress goes a long way.",
  small: "Your habits are taking root.",
  growing: "Your Bloom Buddy is growing strong.",
  blooming: "You're almost in full bloom.",
  full: "Your Bloom Buddy is fully bloomed!",
};

const growthStages: PlantGrowthStage[] = [
  "empty",
  "sprout",
  "small",
  "growing",
  "blooming",
  "full",
];

export default function BloomPlant({
  stage,
  completionRate,
}: BloomPlantProps) {
  const [displayedStage, setDisplayedStage] =
    useState<PlantGrowthStage>(stage);

  const [transitioning, setTransitioning] =
    useState(false);

  const firstRender = useRef(true);

  useEffect(() => {
  if (firstRender.current) {
    firstRender.current = false;
    setDisplayedStage(stage);
    return;
  }

  setTransitioning(true);

  const swapTimer = window.setTimeout(() => {
    setDisplayedStage(stage);
  }, 200);

  const finishTimer = window.setTimeout(() => {
    setTransitioning(false);
  }, 450);

  return () => {
    window.clearTimeout(swapTimer);
    window.clearTimeout(finishTimer);
  };
}, [stage]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white p-8 text-center shadow-sm">
      {/* Celebration glow */}
      {displayedStage === "full" && (
        <div
          className="pointer-events-none absolute inset-x-16 top-8 h-56 rounded-full bg-lime-200/30 blur-3xl"
          aria-hidden="true"
        />
      )}

      {/* Plant */}
      <div className="relative flex min-h-72 items-end justify-center">
        <img
        src={plantImages[displayedStage]}
        alt={`Bloom Buddy growth stage: ${displayedStage}`}
        className={[
            "max-h-64 w-auto object-contain",
            "transition-all duration-300 ease-out",
            transitioning
            ? "translate-y-2 scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100",
        ].join(" ")}
        />
      </div>

      {/* Message */}
      <p className="relative mt-5 text-lg font-semibold text-emerald-900">
        {plantMessages[displayedStage]}
      </p>

      <p className="relative mt-2 text-sm text-slate-600">
        {completionRate}% complete today
      </p>

      {/* Progress bar */}
      <div className="relative mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{
            width: `${completionRate}%`,
          }}
        />
      </div>

      {/* Growth stage indicators */}
      <div className="relative mt-4 flex justify-center gap-2">
        {growthStages.map(
          (growthStage, index) => {
            const currentIndex =
              growthStages.indexOf(
                displayedStage
              );

            const reached =
              index <= currentIndex;

            return (
              <span
                key={growthStage}
                title={growthStage}
                className={[
                  "size-2 rounded-full transition-all duration-300",
                  reached
                    ? "bg-emerald-600"
                    : "bg-slate-200",
                  growthStage ===
                  displayedStage
                    ? "scale-150"
                    : "scale-100",
                ].join(" ")}
              />
            );
          }
        )}
      </div>
    </div>
  );
}