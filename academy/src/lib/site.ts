/** Where the site's source lives. Feedback and proposals become issues there, because the
 *  site has no backend: GitHub is the inbox, and pull requests are how content arrives. */
export const REPO = "https://github.com/johnsonnoronathan/demo";

/** A new "Feedback on a page" issue, with the page already filled in. */
export function feedbackUrl(pageTitle: string, pageUrl: string, locale: string) {
  const site = import.meta.env.SITE ? new URL(pageUrl, import.meta.env.SITE).href : pageUrl;
  const q = new URLSearchParams({ template: "page-feedback.yml", title: `[Feedback] ${pageTitle}`, page: site, language: locale });
  return `${REPO}/issues/new?${q}`;
}

/** A new "Propose a tutorial" issue. */
export const proposeUrl = `${REPO}/issues/new?template=tutorial-proposal.yml`;
