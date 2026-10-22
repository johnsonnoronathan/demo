import { LOCALES, type Locale } from "../i18n/locales";
import { courseEntries, loadCourse } from "./course";

export type Route =
  | { kind: "home" | "catalog" | "learning" | "agents"; locale: Locale }
  | { kind: "course" | "plan"; locale: Locale; courseId: string }
  | { kind: "lesson"; locale: Locale; courseId: string; path: string };

/** Every HTML route of the site, in every language. `route` is the URL path without slashes. */
export async function allRoutes() {
  const out: { params: { route: string | undefined }; props: Route }[] = [];
  const add = (prefix: string, path: string, props: Route) => {
    const route = [prefix, path].filter(Boolean).join("/");
    out.push({ params: { route: route || undefined }, props });
  };
  for (const { code: locale, prefix } of LOCALES) {
    add(prefix, "", { kind: "home", locale });
    add(prefix, "courses", { kind: "catalog", locale });
    add(prefix, "learning", { kind: "learning", locale });
    add(prefix, "agents", { kind: "agents", locale });
    for (const c of await courseEntries()) {
      add(prefix, c.id, { kind: "course", locale, courseId: c.id });
      add(prefix, `${c.id}/plan`, { kind: "plan", locale, courseId: c.id });
      const { lessons } = await loadCourse(c.id, locale);
      for (const l of lessons) add(prefix, l.path, { kind: "lesson", locale, courseId: c.id, path: l.path });
    }
  }
  return out;
}
