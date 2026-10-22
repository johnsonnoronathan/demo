import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/** A course: its chapters, its practice project and what it promises. */
const courses = defineCollection({
  loader: file("src/content/courses.yaml"),
  schema: z.object({
    order: z.number(),
    level: z.enum(["beginner", "intermediate"]),
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    audience: z.string(),
    prerequisites: z.array(z.string()),
    outcomes: z.array(z.string()),
    practice: z
      .object({
        name: z.string(),
        path: z.string(),
        summary: z.string(),
        setup: z.array(z.string()),
      })
      .optional(),
    chapters: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        // "overall" chapters frame the course; "specific" chapters go deep on one technique.
        role: z.enum(["overall", "specific"]).optional(),
        summary: z.string(),
      })
    ),
  }),
});

const exercise = z.object({
  id: z.string(),
  title: z.string(),
  minutes: z.number(),
  goal: z.string(),
  // "practice" runs against the course's practice app; "own" against the learner's own repository.
  target: z.enum(["practice", "own"]).default("practice"),
  // What the agent prompt asks for. The prompt itself is assembled in src/lib/prompt.ts.
  agent: z.object({
    steps: z.array(z.string()),
    done: z.array(z.string()),
    report: z.array(z.string()),
  }),
});

/** One page of a course in one language: src/content/lessons/<locale>/<course>/<chapter>/<page>.mdx.
 *  Openings and summaries frame a chapter; lessons teach. */
const lessons = defineCollection({
  // Ids come from the file path. The glob loader would otherwise use the `slug` field,
  // and every chapter has a page with slug "summary".
  loader: glob({ pattern: "**/*.mdx", base: "src/content/lessons", generateId: ({ entry }) => entry.replace(/\.mdx$/, "") }),
  schema: z.object({
    title: z.string(),
    course: z.string(),
    chapter: z.string(),
    kind: z.enum(["opening", "lesson", "summary"]),
    order: z.number(),
    slug: z.string(),
    minutes: z.number(),
    description: z.string(),
    outcomes: z.array(z.string()).default([]),
    concepts: z.array(z.object({ title: z.string(), scene: z.string().optional() })).default([]),
    keyPoints: z.array(z.string()).default([]),
    exercises: z.array(exercise).default([]),
    check: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    quiz: z
      .array(z.object({ q: z.string(), options: z.array(z.string()), answer: z.number(), why: z.string() }))
      .default([]),
  }),
});

export const collections = { courses, lessons };
