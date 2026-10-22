/** Renders the only Markdown that frontmatter strings use, `code`, as HTML. Everything else is escaped. */
export function inline(text: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return text
    .split(/(`[^`]+`)/g)
    .map((part) => (part.startsWith("`") && part.endsWith("`") && part.length > 1 ? `<code>${esc(part.slice(1, -1))}</code>` : esc(part)))
    .join("");
}
