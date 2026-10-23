import type { SceneDef } from "./kit";
import { percentiles, staticVsDynamic } from "./overview";
import { budgets, nPlusOne, queryPlan, assetTreemap } from "./static";
import { filmstrip, virtualUsers, loadShapes, capacityKnee, flamegraph } from "./dynamic";
import { pipeline, beforeAfter } from "./summary";

export const scenes: Record<string, SceneDef> = {
  percentiles,
  "static-vs-dynamic": staticVsDynamic,
  budgets,
  "n-plus-one": nPlusOne,
  "query-plan": queryPlan,
  "asset-treemap": assetTreemap,
  filmstrip,
  "virtual-users": virtualUsers,
  "load-shapes": loadShapes,
  "capacity-knee": capacityKnee,
  flamegraph,
  pipeline,
  "before-after": beforeAfter,
};
export type { SceneDef };
