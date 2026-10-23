import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// SITE_URL and BASE_PATH are set when building for GitHub Pages (see `npm run build:pages`);
// locally the site is served from the domain root.
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH || "/",
  integrations: [mdx()],
  trailingSlash: "ignore",
  build: { format: "directory" },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    },
  },
});
