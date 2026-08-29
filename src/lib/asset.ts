/**
 * Resolve a path in `public/` against the deployment base.
 *
 * Vite rewrites root-absolute URLs it can actually see — attributes in
 * index.html, `url()` in CSS — so the fonts, the favicons and the social image
 * all follow `base` on their own. A path that exists only as a *string in a
 * data file* is invisible to it and ships verbatim.
 *
 * That is fine at the domain root and broken anywhere else. On a GitHub Pages
 * project site the app is served from `/<repo>/`, so `/projects/kai-video.mp4`
 * resolves against the domain rather than the app and 404s — which, since
 * every project recording and poster is referenced that way, means the entire
 * work section renders as empty frames while the rest of the page looks
 * completely fine.
 *
 * `import.meta.env.BASE_URL` is `/` at the root and `/<repo>/` on a project
 * page, so routing these through it is correct for both without the deploy
 * target having to be decided here.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
