The deploy log is green, so the failure is not the build. The live domain returns 500 even for `/`, `/index.html`, and `/sitemap.xml`, which means Netlify is choking while serving the deployed files/rules.

Root cause I will fix:
- `netlify.toml` has a global SPA rewrite `/* -> /index.html`.
- After prerendering, the site now has many real static HTML routes (`/en/index.html`, `/en/newsroom/index.html`, article HTML, sitemap, assets).
- The current global fallback can intercept too much on Netlify and produce an edge-level 500 on the custom domain.

Plan:
1. Replace the broad Netlify SPA fallback with safer route-specific rewrites only for app navigation routes, while excluding real static files.
2. Add explicit redirects for `/en`, `/fr`, `/es`, `/zh`, `/id`, `/ar`, `/legal/*`, `/newsroom/*` patterns to their generated `index.html` files or SPA fallback only where needed.
3. Keep `/api/contact` untouched.
4. Preserve cache-busting/security headers.
5. Validate locally by checking Netlify-style route behavior against the generated `dist` output before you push to GitHub/Netlify.

Technical notes for the developer:
- No article content change is needed.
- No cover image will be added.
- The Cook Warriors™ article JSON is valid and validated by the build.
- This is a deployment routing configuration patch, not a Netlify outage or SMTP/function issue.