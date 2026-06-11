// One-time snapshot fetcher (Phase 1 / Tier A).
// Usage:  ADZUNA_APP_ID=xxx ADZUNA_APP_KEY=yyy node scripts/fetch-jobs.js
// Pulls several pages, dedupes, and round-robins across companies for diversity
// (so one employer can't flood the board), then writes prototype/jobs-<site>.json.
// Requires Node 18+ (global fetch).
const fs = require('fs');
const path = require('path');
const { mapJob } = require('../lib/adzuna-map');

const SITES = {
  dietitian:   { what: 'dietitian',   where: 'us' },
  electrician: { what: 'electrician', where: 'us' },
  teaching:    { what: 'teacher',     where: 'us' },
  company:     { what: '',            where: 'us' }, // generic / all industries
};
const PAGES = 3;       // pull 3 pages...
const PER_PAGE = 50;   // ...of 50 = up to 150 candidates per site
const LIMIT = 24;      // final jobs kept per site

async function fetchPage(id, key, q, page) {
  const u = new URL('https://api.adzuna.com/v1/api/jobs/us/search/' + page);
  u.searchParams.set('app_id', id);
  u.searchParams.set('app_key', key);
  u.searchParams.set('results_per_page', String(PER_PAGE));
  u.searchParams.set('content-type', 'application/json');
  if (q.what) u.searchParams.set('what', q.what);
  if (q.where) u.searchParams.set('where', q.where);
  const r = await fetch(u);
  if (!r.ok) { console.error('  page', page, 'HTTP', r.status); return []; }
  const data = await r.json();
  return data.results || [];
}

// Round-robin one job per company per pass → maximises employer diversity.
function diversify(jobs, limit) {
  const groups = {};
  for (const j of jobs) (groups[j.company] = groups[j.company] || []).push(j);
  const queues = Object.values(groups);
  const out = [];
  let progressed = true;
  while (out.length < limit && progressed) {
    progressed = false;
    for (const q of queues) {
      if (q.length) { out.push(q.shift()); progressed = true; if (out.length >= limit) break; }
    }
  }
  out.forEach((j, i) => { j.featured = i < 6; }); // re-mark featured after reordering
  return out;
}

async function run() {
  const id = process.env.ADZUNA_APP_ID, key = process.env.ADZUNA_APP_KEY;
  if (!id || !key) { console.error('Set ADZUNA_APP_ID and ADZUNA_APP_KEY env vars.'); process.exit(1); }
  for (const [site, q] of Object.entries(SITES)) {
    let raw = [];
    for (let p = 1; p <= PAGES; p++) raw = raw.concat(await fetchPage(id, key, q, p));
    const seen = new Set();
    const mapped = raw.filter(it => { if (seen.has(it.id)) return false; seen.add(it.id); return true; }).map(mapJob);
    const jobs = diversify(mapped, LIMIT);
    const companies = new Set(jobs.map(j => j.company)).size;
    const out = path.join(__dirname, '..', 'prototype', `jobs-${site}.json`);
    fs.writeFileSync(out, JSON.stringify({ site, count: jobs.length, jobs }, null, 2));
    console.log(site, '→', jobs.length, 'jobs from', companies, 'companies');
  }
}
run();
