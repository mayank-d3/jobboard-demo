// Shared: maps an Adzuna API job item -> the prototype's job shape (genJobs shape).
// Used by scripts/fetch-jobs.js (Phase 1 snapshot) and api/_providers/adzuna.js (Phase 2 live).
const ST = { Alabama:'AL',Alaska:'AK',Arizona:'AZ',Arkansas:'AR',California:'CA',Colorado:'CO',Connecticut:'CT',Delaware:'DE',Florida:'FL',Georgia:'GA',Hawaii:'HI',Idaho:'ID',Illinois:'IL',Indiana:'IN',Iowa:'IA',Kansas:'KS',Kentucky:'KY',Louisiana:'LA',Maine:'ME',Maryland:'MD',Massachusetts:'MA',Michigan:'MI',Minnesota:'MN',Mississippi:'MS',Missouri:'MO',Montana:'MT',Nebraska:'NE',Nevada:'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',Ohio:'OH',Oklahoma:'OK',Oregon:'OR',Pennsylvania:'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',Tennessee:'TN',Texas:'TX',Utah:'UT',Vermont:'VT',Virginia:'VA',Washington:'WA','West Virginia':'WV',Wisconsin:'WI',Wyoming:'WY' };
const slug = s => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function mapJob(item, i) {
  const area = (item.location && item.location.area) || [];
  const city = area[area.length - 1] || (item.location && item.location.display_name || '').split(',')[0] || '';
  const st = ST[area[1]] || ST[area[2]] || '';
  const days = item.created ? Math.max(0, Math.round((Date.now() - new Date(item.created)) / 86400000)) : 0;
  const text = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
  const remote = /\bremote\b/.test(text);
  const type = item.contract_time === 'part_time' ? 'Part-time'
             : item.contract_type === 'contract' ? 'Contract' : 'Full-time';
  const hasSal = item.salary_min && item.salary_max;
  return {
    id: 'adz-' + item.id,
    title: item.title,
    company: (item.company && item.company.display_name) || 'Confidential',
    companyId: slug((item.company && item.company.display_name) || 'company'),
    city, st, remote, type, level: '',
    salLo: hasSal ? Math.round(item.salary_min) : null,
    salHi: hasSal ? Math.round(item.salary_max) : null,
    salUnit: 'yr', hourly: null,
    posted: days,
    featured: i < 6,
    tags: [type].concat(remote ? ['Remote'] : []),
    desc: { intro: (item.description || '').replace(/\s+/g, ' ').trim(), resp: [], reqs: [] },
    applyUrl: item.redirect_url,
  };
}

module.exports = { mapJob, slug };
