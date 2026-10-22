const btn = document.getElementById("theme-toggle");
const current = () =>
  document.documentElement.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
function sync() {
  const dark = current() === "dark";
  btn?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
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
sync();
