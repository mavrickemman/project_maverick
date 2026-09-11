# Emman Calabroso’s portfolio

UX/UI design and frontend development work, published at
https://mavrickemman.github.io/project_maverick/.

## Local development

Use Node.js 20 or newer, then install dependencies and start the development server:

```sh
nvm use
npm install
npm run dev
```

The site is available at http://localhost:3000. Run `npm run build` for a one-time asset build and `npm audit` to check dependencies.

## Publishing and search visibility

GitHub Pages serves `docs/index.html`. Edit this file for the public portfolio;
`src/index.html` is a legacy standalone copy, not a build input. Metadata in both
copies points to the public GitHub Pages URL. PHP templates are not executed by
GitHub Pages. `docs/_config.yml` excludes those templates and development files
from the default Jekyll publishing process. If switching to a custom Pages upload
workflow, apply the same exclusions to its upload artifact.

Run `npm run build`, commit the changed source and built assets, and push to the
branch configured for Pages. Confirm the Pages deployment succeeds before
requesting a recrawl.

### Google Search Console

1. Add a **URL prefix** property for `https://mavrickemman.github.io/project_maverick/`
   at https://search.google.com/search-console/ (a Domain property requires DNS
   control over the domain).
2. Choose HTML tag verification. Copy the exact `google-site-verification` meta
   tag Google supplies into the `<head>` of `docs/index.html`, deploy, then verify.
   Do not use a placeholder token. Mirror it to `src/index.html` if maintaining
   that copy. Keep the tag after verification.
3. Submit `https://mavrickemman.github.io/project_maverick/sitemap.xml` under Sitemaps.
4. Inspect the homepage URL, run **Test live URL**, and confirm the rendered page
   includes the introduction and all four projects. Request indexing.
5. Review Page indexing and Performance over time. Submission does not guarantee
   indexing or a particular ranking. Link to the portfolio from your LinkedIn and
   Dribbble profiles to help people and crawlers discover it.

Google only reads robots.txt at the origin root:
`https://mavrickemman.github.io/robots.txt`. A file in this project would be served
at `/project_maverick/robots.txt` and would have no crawling effect, so none is
included here. No robots.txt is required to allow crawling. If managing the
`mavrickemman.github.io` user-site repository, its root robots.txt can include:

```text
User-agent: *
Allow: /project_maverick/
Sitemap: https://mavrickemman.github.io/project_maverick/sitemap.xml
```

Merge this into any existing rules; it affects other projects on the same host.
If adding a custom domain, update the canonical URL, Open Graph/Twitter URLs,
JSON-LD identifiers, and sitemap together.

References: [Google Search Console verification](https://support.google.com/webmasters/answer/9008080),
[sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[robots.txt scope](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).
