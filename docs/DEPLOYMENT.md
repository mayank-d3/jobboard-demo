# JobSure deployment and architecture

Reference for how JobSure is built, hosted, and pointed at jobsure.com. If you are a teammate or an AI agent picking this up cold, read this first.

## TL;DR

- You edit code in ONE place: `jobboard-demo/prototype/`.
- A GitHub Action mirrors it to a second repo, `jobsure`, which is what jobsure.com serves.
- Never hand-edit the `jobsure` repo. It is generated.
- Push to `jobboard-demo` `main`, and both the demo and jobsure.com update on their own. The IP and domain mapping never change.

## The two repositories

| Repo | Role | Serves | Edit it? |
|------|------|--------|----------|
| `mayank-d3/jobboard-demo` | Source of truth + internal demo | https://mayank-d3.github.io/jobboard-demo/prototype/ | Yes, in `prototype/` |
| `mayank-d3/jobsure` | Public launch site, generated mirror | https://jobsure.com | No, auto-generated |

Why two repos: a GitHub Pages custom domain attaches to exactly one repo and redirects that repo's entire github.io site to the domain. Putting jobsure.com on jobboard-demo would redirect the whole demo. A separate repo keeps the demo a demo and gives jobsure.com a clean root URL.

## Hosting

Both sites are static (React + Babel over CDN, no build step) on **GitHub Pages**, free tier. The app is plain files (`index.html`, `*.jsx`, `styles.css`). A `.nojekyll` file tells Pages to serve the files as-is.

- jobboard-demo serves from `main`, app under `prototype/`.
- jobsure serves from `main`, app at the repo ROOT, so `jobsure.com/` is the site with no `/prototype/` path.

## How the sync works

`.github/workflows/sync-jobsure.yml` in jobboard-demo runs on every push to `main` that touches `prototype/`:

1. Checks out jobboard-demo.
2. Clones the jobsure repo using a deploy key.
3. Copies `prototype/` into the jobsure repo root (rsync).
4. Re-writes `CNAME` (jobsure.com), `.nojekyll`, and the README every run, so a sync can never drop the custom-domain mapping.
5. Commits and pushes to jobsure, which triggers a Pages rebuild.

Auth: an ed25519 deploy key. The public half has WRITE access on jobsure (deploy key id 154859852). The private half is the `JOBSURE_DEPLOY_KEY` secret on jobboard-demo. No personal tokens are involved.

## How jobsure.com points at GitHub (DNS)

Set once at the registrar by DevOps:

- Apex `jobsure.com`: four A records
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- `www.jobsure.com`: CNAME to `mayank-d3.github.io`

Key idea: these records only get traffic to GitHub's Pages edge. GitHub then decides which site to serve by the **Host header** (the domain in the request), matched against the `CNAME` file in the jobsure repo (which contains `jobsure.com`). That is why `www` can CNAME to `mayank-d3.github.io` even though that bare address itself shows a 404. The CNAME is an address lookup, not a content fetch.

These four IPs are GitHub's global, shared Pages IPs. They do not change when you push code, so DNS is a one-time setup. Code changes never touch DNS or the IP.

## HTTPS / SSL

GitHub auto-provisions a free Let's Encrypt certificate once it detects the DNS is correct. This takes from a few minutes up to 24 hours after DNS goes live. Until the cert is issued, `https://jobsure.com` shows a certificate warning and `http://` works. After the cert lands, turn on "Enforce HTTPS" in the jobsure repo Pages settings (or via API). There is nothing for DevOps to do here. It is automatic plus a self-serve toggle in the repo owner's Pages settings.

## Making changes

1. Edit files in `jobboard-demo/prototype/`.
2. Commit and push to `main`.
3. The sync Action copies to jobsure within about a minute, and jobsure.com rebuilds.
4. The IP and domain mapping stay exactly the same. Only the content updates.

To preview without the live domain, the demo at `https://mayank-d3.github.io/jobboard-demo/prototype/#/jobsure` always shows the JobSure UI.

## Analytics

Google Analytics 4 is wired into the site (`window.__GA_ID` in `prototype/index.html`, currently `G-GNK7KMY326`). It records page views per route and an `apply_clicked` event on outbound applies, each tagged with the `site`. View it in GA4 Realtime and Reports. A Metabase or Looker Studio dashboard would be a separate integration that reads GA4 data.

## Job data (Adzuna)

Jobs are live from the Adzuna API, fetched in the browser in `prototype/data.jsx` (`window.fetchLiveJobs`). Current behavior: fetch 7 pages of 50 results (up to 350 raw), dedupe by id, then cap to 300 via `_diversify(mapped, _JOBS_TARGET)`. Tunable via the constants at the top of that function: `_JOBS_TARGET` (300), `_JOBS_PAGES` (7).

**Location (IP-based, D3-7394):** by default the feed is localized to the visitor's US metro. `fetchLiveJobs(siteKey, where)` resolves the location as: explicit override, then IP geolocation, then national fallback. With no override it calls a free IP geo service (`ipwho.is`, fetched `no-store`) to get the city, then queries Adzuna with `where=<city>&distance=160` (km, about 100 miles). Overrides that set the metro: the home search box, the city chips, and a `?city=<city>` URL param. A non-US visitor or a failed lookup falls back to `where=us`. The jobs cache key includes the metro, and detection itself is never cached, so a VPN or location change is reflected on the next reload.

Results are cached in `localStorage` for 30 minutes (`_JOBS_TTL`) so repeat visits do not re-hit the API. The cache is versioned with `_JOBS_CACHE_V`; bump it whenever you change the fetch so a deploy takes effect immediately instead of serving a stale cached feed.

The Browse page (`prototype/pages-jobs.jsx`) shows the whole feed in one scroll (`PER = 300`, no pagination). The JobSure home lists 24 latest jobs (`pages-home.jsx`, GenericHome). Adzuna allows max 50 results per page, so N jobs needs ceil(N / 50) page requests, and each page is one API call per uncached visit.

## Common confusion

- `https://mayank-d3.github.io/` (bare root) returns 404. Expected. That is the "user site" slot and needs a repo literally named `mayank-d3.github.io`, which does not exist. The real sites live one level down, under their repo path.
- `https://mayank-d3.github.io/jobsure/` redirects to jobsure.com (its custom domain). It will not render on its own.

## Quick reference

- Source of truth: `jobboard-demo/prototype/`
- Live site: https://jobsure.com (cert pending shows a warning, then padlock once issued)
- Demo / preview: https://mayank-d3.github.io/jobboard-demo/prototype/#/jobsure
- Sync workflow: `.github/workflows/sync-jobsure.yml`
- Deploy key id on jobsure: 154859852 ; secret on jobboard-demo: `JOBSURE_DEPLOY_KEY`
- GA4 Measurement ID: G-GNK7KMY326
