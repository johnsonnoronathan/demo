/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** Set by the lesson page so MDX components (Exercise, ChapterMap…) know where they are. */
    lesson?: import("./lib/course").LessonView;
  }
}
