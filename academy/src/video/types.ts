/* Lesson videos are scripts, not files. A video is a list of scenes; each scene has
 * narration cues (spoken and captioned in order) and panes that draw the picture.
 * Pane timings are in cue units: `at: 2` means "when cue 2 starts", 2.5 is halfway
 * through it. Durations come from the narration, so picture and voice stay in step.
 */

export interface VideoDef {
  title: string;
  scenes: VideoScene[];
}

export interface VideoScene {
  /** Chapter name, shown on the scrubber and in the chapter list. */
  label: string;
  cues: string[];
  layout?: "full" | "split" | "stack";
  /** CSS grid-template-columns for split layouts. */
  cols?: string;
  panes: Pane[];
}

export type Pane =
  | TitlePane
  | BulletsPane
  | CardPane
  | CodePane
  | TerminalPane
  | TablePane
  | ConceptPane
  | StatsPane
  | BrowserPane
  | NumberlinePane
  | PyramidPane;

export interface TitlePane { type: "title"; kicker: string; heading: string; sub?: string; subAt?: number }

export interface BulletsPane {
  type: "bullets";
  lead?: string;
  formula?: string[];
  check?: boolean;
  items: { at: number; text: string; sub?: string; dim?: boolean }[];
}

export interface CardField {
  at: number;
  label: string;
  value?: string;
  list?: string[];
  steps?: string[];
  chip?: Chip;
  progress?: string[];
  marks?: number[];
  flag?: { at: number; text: string };
}
export interface CardPane {
  type: "card";
  id: string;
  title: string;
  titleAt?: number;
  compact?: boolean;
  focus?: boolean;
  tag?: { text: string; kind: "pass" | "fail" };
  fields: CardField[];
}

export interface CodePane {
  type: "code";
  file: string;
  lang: "js" | "gherkin" | "sql" | "text" | "yaml";
  code: string;
  /** Cue position at which typing finishes; -1 shows the code at once. */
  typeTo: number;
  highlights?: { at: number; until: number; lines: number[]; note?: string; bad?: boolean; good?: boolean }[];
  swaps?: { at: number; line: number; text: string }[];
  appear?: { at: number; lines: number[] }[];
}

export interface TerminalPane {
  type: "terminal";
  title?: string;
  lines: { at: number; until?: number; text: string; kind: "cmd" | "out" | "pass" | "fail" | "pass-dim" | "fail-dim" | "sum-pass" | "sum-fail" | "dim" }[];
}

export type Chip = "pass" | "fail" | "yes" | "no" | "gap" | "warn";
export type Cell = string | { chip: Chip; text?: string };
export interface TablePane {
  type: "table";
  caption?: string;
  cols: string[];
  widths?: string[];
  rows: { at: number; cells: Cell[] }[];
  focus?: { at: number; until: number; row: number }[];
}

/** Plays one of the site's concept animations (src/scenes) inside the video. */
export interface ConceptPane {
  type: "concept";
  scene: string;
  /** Scene step at the start of each cue. Defaults to 0, 1, 2… */
  at?: number[];
}

export interface StatsPane {
  type: "stats";
  caption?: string;
  items: { at: number; value: string; label: string; tone?: "good" | "bad" | "warn" | "accent" }[];
}

export interface BrowserPane {
  type: "browser";
  brand: string;
  url: string;
  urlAt: number;
  heading: string;
  fields: { label: string; value: string; from: number; to: number; secret?: boolean }[];
  button: { label: string; at: number };
  result: { at: number; heading: string; text: string };
}

export interface NumberlinePane {
  type: "numberline";
  heading: string;
  min: number;
  max: number;
  valid: [number, number];
  partitionsAt: number;
  labels?: { low: string; valid: string; high: string; accept: string; reject: string; bug: string };
  points: { at: number; v: number; bug?: number }[];
}

export interface PyramidPane {
  type: "pyramid";
  layers: { at: number; label: string; sub: string; count: string }[];
  axis: [string, string];
  axisAt: number;
}

export function defineVideo(v: VideoDef): VideoDef {
  return v;
}
