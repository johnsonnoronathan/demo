/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** The page's language, set by the router. Components read it for their strings. */
    locale?: import("./i18n/locales").Locale;
    /** Set by the lesson page so MDX components (Exercise, ChapterMap…) know where they are. */
    lesson?: import("./lib/course").LessonView;
    /** Every page of the lesson's course, in the same language. */
    lessons?: import("./lib/course").LessonView[];
  }
}
