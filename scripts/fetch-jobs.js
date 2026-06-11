// One-time snapshot fetcher (Phase 1 / Tier A).
// Usage:  ADZUNA_APP_ID=xxx ADZUNA_APP_KEY=yyy node scripts/fetch-jobs.js
// Writes prototype/jobs-<site>.json with real jobs. Requires Node 18+ (global fetch).
const fs = require('fs');
const path = require('path');
const { mapJob } = require('../lib/adzuna-map');

const SITES = {
  dietitian:   { what: 'dietitian',   where: 'us' },
  electrician: { what: 'electrician', where: 'us' },
  teaching:    { what: 'teacher',     where: 'us' },
  company:     { what: '',            where: 'us' }, // generic / all industries
};

async function run() {
  const id = process.env.ADZUNA_APP_ID, key = process.env.ADZUNA_APP_KEY;
  if (!id || !key) { console.error('Set ADZUNA_APP_ID and ADZUNA_APP_KEY env vars.'); process.exit(1); }
  for (const [site, q] of Object.entries(SITES)) {
    const u = new URL('https://api.adzuna.com/v1/api/jobs/us/search/1');
    u.searchParams.set('app_id', id);
    u.searchParams.set('app_key', key);
    u.searchParams.set('results_per_page', '24');
    u.searchParams.set('content-type', 'application/json');
    if (q.what) u.searchParams.set('what', q.what);
    if (q.where) u.searchParams.set('where', q.where);
    try {
      const r = await fetch(u);
      if (!r.ok) { console.error(site, 'FAILED', r.status, await r.text().catch(() => '')); continue; }
      const data = await r.json();
      const jobs = (data.results || []).map(mapJob);
      const out = path.join(__dirname, '..', 'prototype', `jobs-${site}.json`);
      fs.writeFileSync(out, JSON.stringify({ site, count: jobs.length, jobs }, null, 2));
      console.log(site, '→', jobs.length, 'jobs →', path.relative(process.cwd(), out));
    } catch (e) {
      console.error(site, 'ERROR', e.message);
    }
  }
}
run();
