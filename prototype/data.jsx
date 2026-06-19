/* ============================================================
   data.jsx — site configs + content for all four example sites.
   ONE template, content-only differences. Exposed on window.
   ============================================================ */

/* deterministic RNG so generated listings are stable across renders */
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function seeded(seed){ const r=mulberry32(seed); return { f:r, pick:(arr)=>arr[Math.floor(r()*arr.length)], int:(lo,hi)=>lo+Math.floor(r()*(hi-lo+1)) }; }

const TYPES = ['Full-time','Part-time','Contract','Per diem'];

/* ---------- shared content fragments ---------- */
function mkDesc(intro, resp, reqs){ return { intro, resp, reqs }; }

const VERTICALS = {
  dietitian: {
    key:'dietitian', mode:'niche', vertical:'Dietitian', verticalLong:'Dietitian',
    roleNoun:'dietitian', name:'Dietitian Jobs', domain:'dietitianjobs.com', field:'Healthcare & Nutrition',
    tagline:'The dedicated job board for registered dietitians and nutrition professionals.',
    heroSub:'Browse current openings in clinical, community, and outpatient nutrition — from hospitals and clinics hiring across the country.',
    totalJobs: 3284,
    titles:[
      'Clinical Dietitian','Registered Dietitian Nutritionist','Outpatient Dietitian','Renal Dietitian',
      'Pediatric Dietitian','Sports Dietitian','Long-Term Care Dietitian','Diabetes Educator (RD)',
      'Community Nutritionist','Bariatric Dietitian','Oncology Dietitian','Director of Nutrition Services',
      'Per Diem Clinical Dietitian','Wellness & Nutrition Coach','Food Service Dietitian','Neonatal Dietitian',
    ],
    companies:[
      { name:'Mercy Health System', size:'5,000+ employees', founded:1948, hq:'Cincinnati, OH', blurb:'A nonprofit health system operating 12 hospitals and 200+ clinics, with an integrated clinical nutrition team supporting inpatient and outpatient care.' },
      { name:'Northstar Nutrition Group', size:'180 employees', founded:2009, hq:'Minneapolis, MN', blurb:'An outpatient nutrition practice delivering medical nutrition therapy across the Upper Midwest, with a growing telehealth program.' },
      { name:'Lakeside Medical Center', size:'2,400 employees', founded:1971, hq:'Chicago, IL', blurb:'A 410-bed teaching hospital with specialty programs in cardiology, oncology, and renal care.' },
      { name:'Vital Living Care', size:'900 employees', founded:1995, hq:'Denver, CO', blurb:'A network of senior living and long-term care communities focused on resident wellness and dignified dining.' },
      { name:'Coastal Wellness Clinics', size:'320 employees', founded:2013, hq:'San Diego, CA', blurb:'Preventive and lifestyle-medicine clinics combining primary care, behavioral health, and nutrition counseling.' },
      { name:'Greenfield Children’s Hospital', size:'3,100 employees', founded:1962, hq:'Boston, MA', blurb:'A leading pediatric hospital with dedicated neonatal, metabolic, and feeding-disorder nutrition services.' },
    ],
    cities:[
      {city:'New York', st:'NY', count:412},{city:'Los Angeles', st:'CA', count:338},{city:'Chicago', st:'IL', count:286},
      {city:'Houston', st:'TX', count:241},{city:'Phoenix', st:'AZ', count:198},{city:'Denver', st:'CO', count:176},
      {city:'Boston', st:'MA', count:163},{city:'Atlanta', st:'GA', count:151},{city:'Seattle', st:'WA', count:142},
      {city:'Minneapolis', st:'MN', count:128},{city:'Portland', st:'OR', count:114},{city:'Nashville', st:'TN', count:97},
    ],
    roles:[
      {name:'Clinical Dietitian', count:842},{name:'Outpatient Dietitian', count:514},{name:'Renal Dietitian', count:236},
      {name:'Pediatric Dietitian', count:198},{name:'Long-Term Care Dietitian', count:341},{name:'Sports Dietitian', count:122},
      {name:'Diabetes Educator', count:163},{name:'Community Nutritionist', count:209},
    ],
    salary:{ lo:54000, hi:96000, unit:'yr' },
    levels:['Entry level','Mid level','Senior','Lead'],
    resp:[
      'Complete nutrition assessments and develop individualized medical nutrition therapy plans.',
      'Collaborate with physicians, nurses, and care teams during interdisciplinary rounds.',
      'Document patient progress and update care plans in the electronic health record.',
      'Counsel patients and families on therapeutic diets, chronic disease management, and discharge planning.',
      'Monitor nutrition status and adjust enteral or parenteral support as needed.',
    ],
    reqs:[
      'Registered Dietitian Nutritionist (RDN) credential through the CDR.',
      'State licensure (or eligibility) where required.',
      'Bachelor’s or Master’s in Dietetics, Nutrition, or a related field.',
      'Strong communication skills and comfort working within a care team.',
      'Experience with electronic health records preferred.',
    ],
    benefits:['Health, dental & vision','CDR continuing-education stipend','Licensure reimbursement','401(k) with match','Generous PTO'],
    guide:[
      {kicker:'Career guide', title:'How to become a registered dietitian', desc:'Degree, supervised practice hours, and the CDR exam — the full path explained.', read:'8 min read'},
      {kicker:'Salary guide', title:'2026 dietitian salary report', desc:'What RDs earn by setting, experience, and state — with the latest national data.', read:'6 min read'},
      {kicker:'Licensing', title:'State licensure requirements for RDs', desc:'A state-by-state breakdown of what you need to practice legally.', read:'10 min read'},
      {kicker:'Resume tips', title:'Writing a standout dietitian resume', desc:'How to present clinical rotations, credentials, and outcomes that hiring managers look for.', read:'5 min read'},
    ],
    faq:[
      {q:'Do I need to be a Registered Dietitian to apply?', a:'Most clinical and outpatient roles require the RDN credential and applicable state licensure. Some community and wellness positions accept other nutrition qualifications — check each listing’s requirements section.'},
      {q:'How often are new dietitian jobs added?', a:'New listings are posted by employers throughout the day, and our board is refreshed daily. Set up an email alert to be notified the moment a role matching your criteria goes live.'},
      {q:'Are remote and telehealth roles available?', a:'Yes. Telehealth nutrition counseling has grown quickly, and you can filter for remote and hybrid roles directly from any results page.'},
      {q:'Is it free for job seekers?', a:'Always. Browsing, searching, applying, and email alerts are completely free for candidates. Employers pay to post and feature listings.'},
    ],
    factors:{role:['Clinical Dietitian','Outpatient Dietitian','Renal Dietitian','Pediatric Dietitian','Director of Nutrition Services'], exp:['0–2 years','3–5 years','6–10 years','10+ years']},
  },

  electrician: {
    key:'electrician', mode:'niche', vertical:'Electrician', verticalLong:'Electrician',
    roleNoun:'electrician', name:'Electrician Jobs', domain:'electriciansjob.com', field:'Skilled Trades',
    tagline:'Find skilled electrical work — apprentice to master — from contractors hiring near you.',
    heroSub:'Residential, commercial, and industrial openings posted daily by licensed contractors and shops across the country.',
    totalJobs: 5142,
    titles:[
      'Journeyman Electrician','Master Electrician','Apprentice Electrician','Industrial Electrician',
      'Residential Electrician','Commercial Electrician','Maintenance Electrician','Solar PV Installer',
      'Electrical Foreman','Low-Voltage Technician','Service Electrician','Controls Technician',
      'Lineworker','Electrical Estimator','Wireman','Substation Technician',
    ],
    companies:[
      { name:'Brightline Electric', size:'240 employees', founded:2004, hq:'Phoenix, AZ', blurb:'A full-service electrical contractor handling commercial fit-outs, tenant improvements, and service work across the Southwest.' },
      { name:'Vanguard Power Services', size:'620 employees', founded:1988, hq:'Houston, TX', blurb:'Industrial and energy electrical contractor serving refineries, manufacturing plants, and utility clients.' },
      { name:'Summit Mechanical', size:'410 employees', founded:1996, hq:'Denver, CO', blurb:'A mechanical and electrical contractor specializing in design-build for healthcare and education facilities.' },
      { name:'Ironwood Contractors', size:'130 employees', founded:2011, hq:'Nashville, TN', blurb:'Residential and light-commercial electrical contractor known for high-end custom homes and remodels.' },
      { name:'Beacon Electrical Co.', size:'85 employees', founded:1979, hq:'Portland, OR', blurb:'A family-owned electrical shop providing service, repair, and panel upgrades for homes and small businesses.' },
      { name:'Pinnacle Energy Solutions', size:'350 employees', founded:2015, hq:'Sacramento, CA', blurb:'Solar, battery storage, and EV-charging installation contractor scaling rapidly across the West Coast.' },
    ],
    cities:[
      {city:'Houston', st:'TX', count:486},{city:'Phoenix', st:'AZ', count:392},{city:'Dallas', st:'TX', count:351},
      {city:'Los Angeles', st:'CA', count:344},{city:'Chicago', st:'IL', count:298},{city:'Atlanta', st:'GA', count:261},
      {city:'Denver', st:'CO', count:233},{city:'Las Vegas', st:'NV', count:204},{city:'Seattle', st:'WA', count:188},
      {city:'Tampa', st:'FL', count:176},{city:'Nashville', st:'TN', count:154},{city:'Sacramento', st:'CA', count:141},
    ],
    roles:[
      {name:'Journeyman Electrician', count:1284},{name:'Apprentice Electrician', count:642},{name:'Industrial Electrician', count:486},
      {name:'Commercial Electrician', count:531},{name:'Residential Electrician', count:402},{name:'Master Electrician', count:218},
      {name:'Solar PV Installer', count:312},{name:'Maintenance Electrician', count:367},
    ],
    salary:{ lo:52000, hi:104000, unit:'yr' },
    hourly:{ lo:26, hi:52 },
    levels:['Apprentice','Journeyman','Master','Foreman'],
    resp:[
      'Install, maintain, and repair electrical wiring, fixtures, and control systems.',
      'Read and interpret blueprints, schematics, and the NEC code.',
      'Troubleshoot electrical faults and perform diagnostic testing.',
      'Pull permits and coordinate inspections with local authorities.',
      'Mentor apprentices and ensure job-site safety compliance.',
    ],
    reqs:[
      'Valid electrician license appropriate to the role (apprentice, journeyman, or master).',
      'Knowledge of the National Electrical Code (NEC) and OSHA standards.',
      'Ability to read blueprints and electrical schematics.',
      'Valid driver’s license and reliable transportation.',
      'Physically able to lift 50 lbs and work on ladders and lifts.',
    ],
    benefits:['Competitive hourly pay','Overtime & per-diem on travel jobs','Health & dental','Tool allowance','401(k) with match','Paid apprenticeship hours'],
    guide:[
      {kicker:'Career guide', title:'How to become a licensed electrician', desc:'Apprenticeship hours, classroom training, and the journeyman exam, step by step.', read:'9 min read'},
      {kicker:'Salary guide', title:'2026 electrician pay report', desc:'Hourly and annual pay by license level, specialty, and region.', read:'6 min read'},
      {kicker:'Licensing', title:'Electrician licensing by state', desc:'Reciprocity, required hours, and exam details for every state.', read:'11 min read'},
      {kicker:'On the job', title:'Apprentice to master: the trade ladder', desc:'What changes at each license level — responsibility, pay, and the path up.', read:'5 min read'},
    ],
    faq:[
      {q:'What license do I need to apply?', a:'It depends on the role. Apprentice positions typically require enrollment in a registered program; journeyman and master roles require the corresponding state license. Each listing states what’s needed.'},
      {q:'Do listings show hourly or annual pay?', a:'Both, where the employer provides it. Trade roles are often posted with an hourly range; we also show an estimated annual equivalent so you can compare easily.'},
      {q:'Are travel and per-diem jobs included?', a:'Yes. Many industrial and storm-work roles include travel and per-diem. You can filter for these on any results page.'},
      {q:'Is it free for job seekers?', a:'Always. Browsing, searching, applying, and alerts are free for candidates. Contractors pay to post openings.'},
    ],
    factors:{role:['Apprentice Electrician','Journeyman Electrician','Master Electrician','Industrial Electrician','Electrical Foreman'], exp:['0–2 years','3–5 years','6–10 years','10+ years']},
  },

  teaching: {
    key:'teaching', mode:'niche', vertical:'Teaching', verticalLong:'Teaching',
    roleNoun:'teacher', name:'Teaching Careers', domain:'teachingcareers.com', field:'Education',
    tagline:'Meaningful teaching and school roles, from districts and schools hiring near you.',
    heroSub:'Find K–12 classroom, special education, and school-leadership openings posted daily by districts, charters, and private schools.',
    totalJobs: 4127,
    titles:[
      'Elementary Teacher','High School Math Teacher','Special Education Teacher','ESL / ELL Teacher',
      'Middle School Science Teacher','Substitute Teacher','School Counselor','Instructional Coach',
      'Preschool Lead Teacher','Assistant Principal','Reading Specialist','High School English Teacher',
      'Physical Education Teacher','Paraprofessional / Aide','Art Teacher','School Psychologist',
    ],
    companies:[
      { name:'Maplewood School District', size:'4,800 staff', founded:1955, hq:'Columbus, OH', blurb:'A public school district serving 32,000 students across 41 schools, known for strong arts and STEM programs.' },
      { name:'Horizon Charter Schools', size:'1,200 staff', founded:2008, hq:'Austin, TX', blurb:'A college-prep charter network operating 18 campuses with a focus on small class sizes and personalized learning.' },
      { name:'Bright Futures Academy', size:'310 staff', founded:2001, hq:'Denver, CO', blurb:'An independent K–8 school emphasizing project-based learning and social-emotional growth.' },
      { name:'Cedar Park Unified', size:'3,600 staff', founded:1962, hq:'Sacramento, CA', blurb:'A unified school district serving suburban communities with award-winning special education services.' },
      { name:'Lincoln Public Schools', size:'5,200 staff', founded:1889, hq:'Lincoln, NE', blurb:'One of the region’s largest districts, supporting 42,000 students with comprehensive teacher mentorship.' },
      { name:'Evergreen Montessori', size:'140 staff', founded:1997, hq:'Portland, OR', blurb:'A Montessori-certified school community spanning preschool through middle school.' },
    ],
    cities:[
      {city:'New York', st:'NY', count:368},{city:'Los Angeles', st:'CA', count:312},{city:'Houston', st:'TX', count:274},
      {city:'Phoenix', st:'AZ', count:221},{city:'Columbus', st:'OH', count:198},{city:'Austin', st:'TX', count:187},
      {city:'Denver', st:'CO', count:171},{city:'Charlotte', st:'NC', count:158},{city:'Sacramento', st:'CA', count:146},
      {city:'Nashville', st:'TN', count:132},{city:'Portland', st:'OR', count:119},{city:'Las Vegas', st:'NV', count:108},
    ],
    roles:[
      {name:'Elementary Teacher', count:912},{name:'Special Education Teacher', count:684},{name:'High School Math Teacher', count:341},
      {name:'ESL / ELL Teacher', count:228},{name:'Substitute Teacher', count:476},{name:'School Counselor', count:163},
      {name:'Science Teacher', count:289},{name:'Instructional Coach', count:97},
    ],
    salary:{ lo:44000, hi:82000, unit:'yr' },
    levels:['New teacher','Licensed','Experienced','Lead / Mentor'],
    resp:[
      'Plan and deliver standards-aligned lessons that engage every learner.',
      'Assess student progress and differentiate instruction to meet diverse needs.',
      'Build a positive, inclusive classroom culture and manage behavior supportively.',
      'Communicate regularly with families about student growth and goals.',
      'Collaborate with grade-level teams and participate in professional development.',
    ],
    reqs:[
      'State teaching license / certification for the appropriate grade and subject.',
      'Bachelor’s degree (Master’s preferred for some roles).',
      'Demonstrated classroom-management and instructional skills.',
      'Commitment to equitable, student-centered teaching.',
      'Successful background check and clearances.',
    ],
    benefits:['State pension / retirement','Health, dental & vision','Paid professional development','Summers & school holidays','Tuition reimbursement','Mentorship for new teachers'],
    guide:[
      {kicker:'Career guide', title:'How to become a certified teacher', desc:'Degree, certification routes, and licensure exams explained for every path.', read:'8 min read'},
      {kicker:'Salary guide', title:'2026 teacher salary report', desc:'Pay by state, district type, experience, and degree level.', read:'6 min read'},
      {kicker:'Licensing', title:'Teaching certification by state', desc:'Reciprocity, alternative routes, and renewal requirements nationwide.', read:'10 min read'},
      {kicker:'Resume tips', title:'Building a strong teaching portfolio', desc:'What to include beyond the resume — sample lessons, references, and outcomes.', read:'5 min read'},
    ],
    faq:[
      {q:'Do I need a teaching license to apply?', a:'Most classroom roles require a state teaching license for the relevant grade and subject. Many districts also offer alternative-certification and provisional pathways — those listings will say so.'},
      {q:'Are substitute and paraprofessional roles listed?', a:'Yes. Alongside full-time contracts, you’ll find substitute, paraprofessional, and part-time roles. Filter by job type on any results page.'},
      {q:'When does the hiring season peak?', a:'Most K–12 hiring happens between February and August for the following school year, though openings appear year-round. Email alerts keep you ahead of the rush.'},
      {q:'Is it free for job seekers?', a:'Always. Searching, applying, and alerts are free for educators. Schools and districts pay to post.'},
    ],
    factors:{role:['Elementary Teacher','High School Math Teacher','Special Education Teacher','School Counselor','Assistant Principal'], exp:['0–2 years','3–5 years','6–10 years','10+ years']},
  },

  company: {
    key:'company', mode:'generic', vertical:'Job', verticalLong:'',
    roleNoun:'professional', name:'Company Jobs', domain:'companyjobs.com', field:'All industries',
    tagline:'Search thousands of jobs from trusted employers — across every industry, nationwide.',
    heroSub:'',
    totalJobs: 18940,
    categories:[
      {name:'Healthcare', count:3284, icon:'health'},{name:'Skilled Trades', count:2611, icon:'trades'},
      {name:'Education', count:1842, icon:'edu'},{name:'Technology', count:2974, icon:'tech'},
      {name:'Finance', count:1456, icon:'finance'},{name:'Retail', count:1908, icon:'retail'},
      {name:'Logistics', count:1372, icon:'logistics'},{name:'Hospitality', count:1183, icon:'hospitality'},
    ],
    titles:[
      'Registered Nurse','Software Engineer','Warehouse Associate','Account Manager','Financial Analyst',
      'Retail Store Manager','Customer Support Specialist','Project Manager','HR Generalist','Mechanical Engineer',
      'Marketing Coordinator','Data Analyst','Operations Supervisor','Sales Representative','Executive Assistant',
      'Electrician','Elementary Teacher','Clinical Dietitian','Truck Driver (CDL-A)','Product Designer',
    ],
    companies:[
      { name:'Northwind Logistics', size:'7,200 employees', founded:1992, hq:'Memphis, TN', blurb:'A national freight and fulfillment company moving goods across all 48 contiguous states.' },
      { name:'Cobalt Financial', size:'2,800 employees', founded:2003, hq:'Charlotte, NC', blurb:'A consumer and commercial banking group serving over a million customers nationwide.' },
      { name:'Meridian Health', size:'9,400 employees', founded:1968, hq:'Dallas, TX', blurb:'An integrated health system operating hospitals, clinics, and home-care services.' },
      { name:'Atlas Manufacturing', size:'3,300 employees', founded:1981, hq:'Cleveland, OH', blurb:'A precision-manufacturing firm supplying the automotive and aerospace industries.' },
      { name:'BluePeak Retail', size:'12,000 employees', founded:1999, hq:'Minneapolis, MN', blurb:'A multi-format retailer with 480 stores and a fast-growing e-commerce operation.' },
      { name:'Helix Software', size:'1,100 employees', founded:2012, hq:'Austin, TX', blurb:'A B2B software company building workflow tools for mid-market businesses.' },
    ],
    cities:[
      {city:'New York', st:'NY', count:2184},{city:'Los Angeles', st:'CA', count:1938},{city:'Chicago', st:'IL', count:1642},
      {city:'Houston', st:'TX', count:1487},{city:'Dallas', st:'TX', count:1356},{city:'Atlanta', st:'GA', count:1211},
      {city:'Phoenix', st:'AZ', count:1098},{city:'Denver', st:'CO', count:976},{city:'Seattle', st:'WA', count:1043},
      {city:'Charlotte', st:'NC', count:842},{city:'Austin', st:'TX', count:931},{city:'Boston', st:'MA', count:887},
    ],
    roles:[
      {name:'Registered Nurse', count:1842},{name:'Software Engineer', count:1564},{name:'Warehouse Associate', count:1287},
      {name:'Account Manager', count:743},{name:'Financial Analyst', count:612},{name:'Customer Support', count:934},
      {name:'Project Manager', count:688},{name:'Sales Representative', count:1021},
    ],
    salary:{ lo:42000, hi:140000, unit:'yr' },
    levels:['Entry level','Mid level','Senior','Manager','Director'],
    resp:[
      'Own day-to-day responsibilities and deliver against clear goals.',
      'Collaborate across teams to move projects forward.',
      'Communicate progress and surface risks early.',
      'Contribute to a positive, high-performing team culture.',
      'Continuously improve processes and outcomes.',
    ],
    reqs:[
      'Relevant experience or qualifications for the role.',
      'Strong communication and organizational skills.',
      'Ability to work independently and as part of a team.',
      'Eligibility to work in the United States.',
    ],
    benefits:['Competitive pay','Health, dental & vision','401(k) with match','Paid time off','Professional development'],
    guide:[
      {kicker:'Job search', title:'How to write a resume that gets read', desc:'A practical, recruiter-tested structure that works in any industry.', read:'7 min read'},
      {kicker:'Salary guide', title:'2026 salary trends by industry', desc:'Where pay is rising fastest and what to expect in your field.', read:'6 min read'},
      {kicker:'Interviews', title:'Answering the 10 most common questions', desc:'Frameworks for the questions you’ll almost certainly be asked.', read:'8 min read'},
      {kicker:'Career', title:'Switching industries the smart way', desc:'How to translate your experience when you change fields.', read:'5 min read'},
    ],
    faq:[
      {q:'How do I search for jobs?', a:'Use the search bar on the home page to enter a role, skill, or company, add a location, and browse results. You can refine further with filters for job type, salary, and date posted.'},
      {q:'How often are jobs updated?', a:'New jobs are posted by employers around the clock, and the board is refreshed daily. Save a search and set up alerts to be notified about new matches.'},
      {q:'Can I apply directly?', a:'Yes. Most listings let you apply directly from the job page; some link to the employer’s own application. Either way, your application goes straight to the hiring team.'},
      {q:'Is it free to use?', a:'Searching, applying, and alerts are free for job seekers. Employers pay to post and promote their openings.'},
    ],
    factors:{role:['Registered Nurse','Software Engineer','Financial Analyst','Account Manager','Project Manager'], exp:['0–2 years','3–5 years','6–10 years','10+ years']},
  },
};

/* JobSure — re-skin of the generic all-industries board. Brand, domain, accent,
   fonts, and hero copy only; structure/features unchanged. (genJobs reseeds by key.) */
VERTICALS.jobsure = {
  ...VERTICALS.company,
  key:'jobsure',
  name:'JobSure',
  domain:'jobsure.com',
  tagline:'Search thousands of roles from verified employers across every industry, and apply with confidence.',
  heroTitle:{ lead:'Your next job.', accent:'For sure.' },
  totalJobs: 21480,
};

/* ---------- generate listings ---------- */
function genJobs(v){
  const rng = seeded(hashStr(v.key));
  const n = v.mode === 'generic' ? 24 : 18;
  const jobs = [];
  for(let i=0;i<n;i++){
    const title = v.titles[i % v.titles.length];
    const co = v.companies[rng.int(0, v.companies.length-1)];
    const loc = v.cities[rng.int(0, Math.min(v.cities.length-1, 9))];
    const remote = rng.f() < 0.16;
    const type = i < 2 ? 'Full-time' : TYPES[Math.floor(rng.f()*rng.f()*TYPES.length)];
    const lvl = v.levels[rng.int(0, v.levels.length-1)];
    const span = v.salary.hi - v.salary.lo;
    const base = v.salary.lo + Math.floor(rng.f()*span*0.6);
    const lo = Math.round(base/1000)*1000;
    const hi = Math.round((lo + 8000 + rng.f()*22000)/1000)*1000;
    const posted = i===0?0:i===1?1: rng.int(1,24);
    const featured = i < 6 && rng.f() < 0.7;
    jobs.push({
      id: v.key + '-' + (i+1),
      title, company: co.name, companyId: slug(co.name),
      city: loc.city, st: loc.st, remote,
      type, level: lvl,
      salLo: lo, salHi: hi, salUnit: v.salary.unit,
      hourly: v.hourly ? { lo: v.hourly.lo + rng.int(-2,4), hi: v.hourly.hi - rng.int(0,8) } : null,
      posted, featured: i<2 ? true : featured,
      tags: buildTags(v, type, remote),
      desc: mkDesc(
        `${co.name} is hiring a ${title.toLowerCase()} to join our team in ${loc.city}, ${loc.st}. ${co.blurb} This is a ${type.toLowerCase()} ${lvl.toLowerCase()} role with room to grow.`,
        v.resp, v.reqs),
    });
  }
  return jobs;
}
function buildTags(v, type, remote){
  const t = [type];
  if(remote) t.push('Remote');
  return t;
}
function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

/* ---------- owned / directly-posted jobs (apply ON THIS SITE — no redirect) ----------
   Employers who post straight to your board (Model 1). No applyUrl, so the Apply button
   opens the on-page application form (delivered via Web3Forms) instead of bouncing out.
   One seed per site makes the on-page flow visible; real posts (Post a job) merge in too. */
function _mkOwned(key, i, o){
  return {
    id:key+'-own-'+i, owned:true, title:o.title, company:o.company, companyId:slug(o.company),
    city:o.city, st:o.st||'', remote:!!o.remote, type:o.type||'Full-time', level:o.level||'',
    salLo:o.salLo??null, salHi:o.salHi??null, salUnit:'yr', hourly:null,
    posted:o.posted??0, featured:true,
    tags:[o.type||'Full-time'].concat(o.remote?['Remote']:[]).concat(['Direct']),
    desc:{ intro:o.intro||`${o.company} is hiring a ${o.title} and accepts applications directly on this board.`, resp:o.resp||[], reqs:o.reqs||[] },
    applyUrl:null, contactEmail:o.email||''
  };
}
// Seeded "direct hire" demo jobs removed — the board shows REAL Adzuna feed jobs only.
const OWNED_SEED = { dietitian:[], electrician:[], teaching:[], company:[] };
const _OWNED_KEY = 'jb_owned_v1';
function getOwnedJobs(key){ return []; }   // feed-only pilot: no owned/direct jobs (real listings only)

/* build full SITES object with generated jobs + employer derivations */
const SITES = {};
Object.keys(VERTICALS).forEach(k=>{
  const v = VERTICALS[k];
  const jobs = [...getOwnedJobs(k), ...genJobs(v)];
  const employers = v.companies.map(c=>({
    ...c, id: slug(c.name),
    openRoles: jobs.filter(j=>j.companyId===slug(c.name)).length,
  }));
  SITES[k] = { ...v, jobs, employers };
});

/* ---------- formatting helpers ---------- */
function fmtMoney(n){ return '$' + n.toLocaleString('en-US'); }
function fmtSalary(j){
  if(j.salLo==null && !j.hourly) return 'Salary not listed';
  if(j.hourly) return `$${j.hourly.lo} – $${j.hourly.hi}/hr`;
  if(j.salLo===j.salHi) return fmtMoney(j.salLo);
  return `${fmtMoney(j.salLo)} – ${fmtMoney(j.salHi)}`;
}
function fmtSalaryShort(j){
  if(j.salLo==null && !j.hourly) return 'Salary not listed';
  if(j.hourly) return `$${j.hourly.lo}–${j.hourly.hi}/hr`;
  if(j.salLo===j.salHi) return `$${Math.round(j.salLo/1000)}k`;
  return `$${Math.round(j.salLo/1000)}k – $${Math.round(j.salHi/1000)}k`;
}
function fmtPosted(d){
  if(d===0) return 'Posted today';
  if(d===1) return 'Posted yesterday';
  if(d<7) return `Posted ${d} days ago`;
  if(d<14) return 'Posted 1 week ago';
  if(d<30) return `Posted ${Math.floor(d/7)} weeks ago`;
  return 'Posted 1 month ago';
}
function jobsForCity(site, city){ return site.jobs.filter(j=>j.city===city); }
function getJob(siteKey, id){ return SITES[siteKey].jobs.find(j=>j.id===id); }
function getEmployer(siteKey, id){ return SITES[siteKey].employers.find(e=>e.id===id); }
function relatedJobs(site, job, n=3){
  return site.jobs.filter(j=>j.id!==job.id && (j.city===job.city || j.companyId===job.companyId)).slice(0,n);
}

/* monogram color from a muted professional palette (deterministic, NOT the accent) */
const MONO_COLORS = ['#3B5168','#5A4B7C','#2F6E63','#7A4B55','#4C6048','#6B5840','#3F5A78','#574B6B','#2E5C6E','#6A5145'];
function monoColor(name){ return MONO_COLORS[hashStr(name) % MONO_COLORS.length]; }
function initials(name){
  const stop = new Set(['the','of','and','co','co.','inc','group','school','schools','district','health','system','center','services','solutions','contractors','academy','clinics','medical']);
  const words = name.split(/\s+/).filter(w=>!stop.has(w.toLowerCase().replace(/[^a-z.]/g,'')));
  const src = words.length ? words : name.split(/\s+/);
  return (src[0][0] + (src[1] ? src[1][0] : (src[0][1]||''))).toUpperCase();
}

Object.assign(window, {
  SITES, fmtMoney, fmtSalary, fmtSalaryShort, fmtPosted,
  jobsForCity, getJob, getEmployer, relatedJobs,
  monoColor, initials, slug,
});

// Skeleton until the first live load completes (prevents mock flashing in).
window.__jobsLoading = true;
// Merge owned/direct-posted jobs (apply on-site) on top of LIVE feed jobs (redirect),
// then rebuild employers/cities/specialties from the combined set.
window.applyLiveJobs = function(key, liveJobs){
  if (SITES[key] && liveJobs && liveJobs.length){
    const jobs = [...getOwnedJobs(key), ...liveJobs];
    SITES[key].jobs = jobs;
    const byCo = {};
    jobs.forEach(j=>{
      if(!byCo[j.companyId]) byCo[j.companyId] = { id:j.companyId, name:j.company, hq:(j.city&&j.st)?`${j.city}, ${j.st}`:'', size:'', founded:'', blurb:`${j.company} is actively hiring on ${SITES[key].name}.`, openRoles:0 };
      byCo[j.companyId].openRoles++;
    });
    SITES[key].employers = Object.values(byCo);

    // cities derived from the loaded jobs (real, if small, counts)
    const byCity = {};
    jobs.forEach(j=>{ if(!j.city) return; const ck=j.city+'|'+(j.st||''); if(!byCity[ck]) byCity[ck]={city:j.city, st:j.st||'', count:0}; byCity[ck].count++; });
    SITES[key].liveCities = Object.values(byCity).sort((a,b)=>b.count-a.count);

    // specialties: curated role labels that actually appear in the loaded titles
    // (same first-word match the Browse page uses, so chip counts == results)
    const roleSrc = (VERTICALS[key] && VERTICALS[key].roles) || [];
    SITES[key].liveRoles = roleSrc.map(r=>{
      const kw = r.name.toLowerCase().split(/[ /]+/)[0];
      return { name:r.name, count: jobs.filter(j=>(j.title||'').toLowerCase().includes(kw)).length };
    }).filter(r=>r.count>0).sort((a,b)=>b.count-a.count);
  }
};

// Persist a directly-posted job (from "Post a job") and surface it immediately on the board.
window.addOwnedJob = function(key, job){
  try {
    const raw = localStorage.getItem(_OWNED_KEY); const all = raw?JSON.parse(raw):{};
    all[key] = [job, ...(all[key]||[])]; localStorage.setItem(_OWNED_KEY, JSON.stringify(all));
  } catch(e){}
  if(SITES[key]) SITES[key].jobs = [job, ...SITES[key].jobs];
};

/* ============================================================
   LIVE Adzuna (Option A — browser-direct). Ideation only:
   the trial key is visible client-side. Adzuna sends CORS '*',
   so the browser can call it directly (no backend). Diversifies
   across employers; app.jsx falls back to the static snapshot.
   ============================================================ */
const _ADZ = { id:'50dc73db', key:'ca98692ac3f98547ad098d91133608e6' };
/* Web3Forms — delivers on-page applications for owned/direct jobs (Model 1).
   The access key is PUBLIC by design (safe client-side). Empty string => demo mode:
   the form works end-to-end but nothing is delivered. Paste a free key from
   web3forms.com (enter your email, key arrives instantly) to start receiving applications. */
const _W3F = { key: '' };
window._W3F = _W3F;
const _SITEQ = { dietitian:'dietitian', electrician:'electrician', teaching:'teacher', company:'', jobsure:'' };
const _ST = {Alabama:'AL',Alaska:'AK',Arizona:'AZ',Arkansas:'AR',California:'CA',Colorado:'CO',Connecticut:'CT',Delaware:'DE',Florida:'FL',Georgia:'GA',Hawaii:'HI',Idaho:'ID',Illinois:'IL',Indiana:'IN',Iowa:'IA',Kansas:'KS',Kentucky:'KY',Louisiana:'LA',Maine:'ME',Maryland:'MD',Massachusetts:'MA',Michigan:'MI',Minnesota:'MN',Mississippi:'MS',Missouri:'MO',Montana:'MT',Nebraska:'NE',Nevada:'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',Ohio:'OH',Oklahoma:'OK',Oregon:'OR',Pennsylvania:'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',Tennessee:'TN',Texas:'TX',Utah:'UT',Vermont:'VT',Virginia:'VA',Washington:'WA','West Virginia':'WV',Wisconsin:'WI',Wyoming:'WY'};
function _adzMap(item){
  const area = (item.location && item.location.area) || [];
  const city = area[area.length-1] || ((item.location && item.location.display_name) || '').split(',')[0] || '';
  const st = _ST[area[1]] || _ST[area[2]] || '';
  const days = item.created ? Math.max(0, Math.round((Date.now() - new Date(item.created))/86400000)) : 0;
  const text = ((item.title||'') + ' ' + (item.description||'')).toLowerCase();
  const remote = /\bremote\b/.test(text);
  const type = item.contract_time==='part_time' ? 'Part-time' : item.contract_type==='contract' ? 'Contract' : 'Full-time';
  const hasSal = item.salary_min && item.salary_max;
  return { id:'adz-'+item.id, title:item.title, company:(item.company&&item.company.display_name)||'Confidential',
    companyId: slug((item.company&&item.company.display_name)||'company'), city, st, remote, type, level:'',
    salLo: hasSal?Math.round(item.salary_min):null, salHi: hasSal?Math.round(item.salary_max):null, salUnit:'yr', hourly:null,
    posted: days, featured:false, tags:[type].concat(remote?['Remote']:[]),
    desc:{intro:(item.description||'').replace(/\s+/g,' ').trim(), resp:[], reqs:[]}, applyUrl:item.redirect_url };
}
function _diversify(jobs, limit){
  const groups={}; jobs.forEach(j=>{ (groups[j.company]=groups[j.company]||[]).push(j); });
  const qs=Object.values(groups), out=[]; let go=true;
  while(out.length<limit && go){ go=false; for(const q of qs){ if(q.length){ out.push(q.shift()); go=true; if(out.length>=limit) break; } } }
  out.forEach((j,i)=>{ j.featured = i<6; }); return out;
}
const _JOBS_TARGET  = 300;            // live jobs shown per site
const _JOBS_PAGES   = 7;              // Adzuna pages to pull (50 each) => up to 350 raw before dedupe
const _JOBS_CACHE_V = 'v2';           // bump to invalidate cached feeds after changing the fetch
const _JOBS_TTL     = 30 * 60 * 1000; // 30 min browser cache, spares the Adzuna quota under traffic
window.fetchLiveJobs = async function(siteKey){
  const cacheKey = `jsjobs:${_JOBS_CACHE_V}:${siteKey}`;
  try {
    const hit = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if(hit && (Date.now()-hit.t) < _JOBS_TTL && Array.isArray(hit.jobs) && hit.jobs.length) return hit.jobs;
  } catch(e){}
  const what = _SITEQ[siteKey] || '';
  const urls = Array.from({length:_JOBS_PAGES}, (_,i)=>{
    let u = `https://api.adzuna.com/v1/api/jobs/us/search/${i+1}?app_id=${_ADZ.id}&app_key=${_ADZ.key}&results_per_page=50&where=us&content-type=application/json`;
    if(what) u += `&what=${encodeURIComponent(what)}`;
    return u;
  });
  const pages = await Promise.all(urls.map(u => fetch(u).then(r=> r.ok ? r.json() : {results:[]}).catch(()=>({results:[]}))));
  const raw = pages.reduce((acc,d)=> acc.concat(d.results||[]), []);
  const seen = new Set();
  const mapped = raw.filter(it=>{ if(seen.has(it.id)) return false; seen.add(it.id); return true; }).map(_adzMap);
  const out = _diversify(mapped, _JOBS_TARGET);
  try { localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), jobs: out })); } catch(e){}
  return out;
};
