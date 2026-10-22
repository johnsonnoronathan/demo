const btn = document.getElementById("theme-toggle");
const current = () =>
  document.documentElement.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
function sync() {
  const dark = current() === "dark";
  btn?.setAttribute("aria-label", (dark ? btn.dataset.lLight : btn.dataset.lDark) ?? "");
  btn?.setAttribute("data-mode", dark ? "dark" : "light");
}
btn?.addEventListener("click", () => {
  const next = current() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("testbench:theme", next);
  } catch {}
  sync();
});
// Close the language menu when clicking elsewhere.
document.addEventListener("click", (e) => {
  document.querySelectorAll<HTMLDetailsElement>("details.lang[open]").forEach((d) => {
    if (!d.contains(e.target as Node)) d.open = false;
  });
});
sync();
