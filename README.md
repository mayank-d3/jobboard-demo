# Job Board Prototype

A configurable job-board UI prototype. Static front end only, no backend and no build step (React + Babel loaded via CDN).

**Live demo:** https://mayank-d3.github.io/jobboard-demo/prototype/

The prototype lives in [`prototype/`](prototype/). It must be served over http/https (e.g. GitHub Pages or any static server). Opening `index.html` from a `file://` path will not work.

## Deployments (read this first)

This repo has **two** GitHub Pages targets, but the code is written **once** in [`prototype/`](prototype/):

1. **This repo, `jobboard-demo`,** is the internal demo and the **source of truth**. It serves the multi-site launcher at https://mayank-d3.github.io/jobboard-demo/prototype/ and is always live. Preview the JobSure brand by adding `#/jobsure` to that URL.

2. **The `jobsure` repo** ([github.com/mayank-d3/jobsure](https://github.com/mayank-d3/jobsure)) is the **public launch site** for **jobsure.com**. It serves the app at the domain root with no launcher, and it is a **generated mirror** of `prototype/`. Do not hand-edit it.

**How they stay in sync:** the Action [`.github/workflows/sync-jobsure.yml`](.github/workflows/sync-jobsure.yml) copies `prototype/` into the `jobsure` repo root on every push to `main`, re-writing `CNAME` and `.nojekyll` each run so the custom domain and its IP never drop.

**Bottom line:** edit `prototype/` here, push, and both the demo and jobsure.com update. Never edit the `jobsure` repo directly.

> jobsure.com goes live once DevOps points the apex DNS at GitHub's Pages IPs. Until then, `mayank-d3.github.io/jobsure/` redirects to the not-yet-live domain, so preview via the demo link above.
