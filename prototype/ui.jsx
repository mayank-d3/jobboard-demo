/* ============================================================
   ui.jsx — shared primitives used across every page.
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------- navigation helpers ---------- */
function navigate(hash){ if(location.hash !== hash){ location.hash = hash; } }
function href(...segs){ return '#/' + segs.filter(s=>s!==undefined && s!=='').join('/'); }
function Link({ to, className, children, ...rest }){
  return <a href={to} className={className} onClick={()=>{}} {...rest}>{children}</a>;
}

/* ---------- icon set (stroke, 24x24) ---------- */
const PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"/><path d="M3 12h18"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  dollar: '<path d="M12 3v18"/><path d="M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1-4.5 3 2 2.7 4.5 3.2 4.5 1.3 4.5 3.3-2 3-4.5 3-4.5-1.3-4.5-3"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-3h4v3"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17L17 7"/><path d="M8 7h9v9"/>',
  chevDown: '<path d="M6 9l6 6 6-6"/>',
  chevRight: '<path d="M9 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.5 21a2 2 0 0 1-3 0"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1"/><path d="M17 14.4a5.5 5.5 0 0 1 3.5 5.6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  phone: '<path d="M5 4h3l1.5 4.5L7.5 10a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  sparkle: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/>',
  doc: '<path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4"/><path d="M9.5 13h5M9.5 16.5h5"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  cap: '<path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v4c0 1.3 2.2 2.5 5 2.5s5-1.2 5-2.5v-4"/><path d="M21 9v4"/>',
  wrench: '<path d="M15 6.5a3.8 3.8 0 0 0-5 4.7L4 17l3 3 5.8-6a3.8 3.8 0 0 0 4.7-5l-2.3 2.3-2.2-.5-.5-2.2z"/>',
  pulse: '<path d="M3 12h4l2-5 4 11 2-6h6"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>',
  bank: '<path d="M4 10h16M5 10l7-5 7 5M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16"/>',
  bag: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  truck: '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  utensils: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM16 16v5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9h16M8 3v4M16 3v4"/>',
  trending: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  bookmarkFill: '<path d="M6 4h12v17l-6-4-6 4z" fill="currentColor" stroke="none"/>',
};
const CAT_ICON = { health:'pulse', trades:'wrench', edu:'cap', tech:'cpu', finance:'bank', retail:'bag', logistics:'truck', hospitality:'utensils' };
function Icon({ name, size=20, stroke=1.7, className, style }){
  const d = PATHS[name] || PATHS.briefcase;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} dangerouslySetInnerHTML={{__html:d}} />
  );
}

/* ---------- company logo (varied fictional marks — looks like real brands) ---------- */
const LOGO_MARKS = [
  'M12 1.6c.8 5.8 2.5 7.5 8.4 8.4-5.9.9-7.6 2.6-8.4 8.4-.8-5.8-2.5-7.5-8.4-8.4C9.5 9.1 11.2 7.4 12 1.6z',
  'M13.6 2L4.8 13.8h5.2L8.7 22 19 9.7h-5.6z',
  'M12 2l8.7 5v10L12 22l-8.7-5V7z',
  'M12 2.2c4.6 6.6 7 10.1 7 13.1a7 7 0 1 1-14 0c0-3 2.4-6.5 7-13.1z',
  'M12 1.8l10.2 10.2L12 22.2 1.8 12z',
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z',
  'M3.6 3.6h7.1v7.1H3.6zM13.3 3.6h7.1v7.1h-7.1zM3.6 13.3h7.1v7.1H3.6zM13.3 13.3h7.1v7.1h-7.1z',
  'M12 3.4l9 15.6H3z',
  'M7 4h10a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6zm0 10h10a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6z',
  'M12 2l9.5 6.9-3.6 11.1H6.1L2.5 8.9z',
];
const LOGO_COLORS = ['#2563EB','#DB2777','#059669','#EA580C','#7C3AED','#0891B2','#CA8A04','#DC2626','#4F46E5','#0D9488','#9333EA','#C2410C'];
function CompanyLogo({ name, size=52, style }){
  const h = hashStr(name);
  const recipe = h % 5;
  const color = LOGO_COLORS[(h>>>3) % LOGO_COLORS.length];
  const mark = LOGO_MARKS[(h>>>7) % LOGO_MARKS.length];
  const useLetter = ((h>>>11) % 5) < 2;
  let bg, fg, shape='circle', border=false;
  if(recipe===0){ bg='#15191F'; fg='#fff'; shape='circle'; }
  else if(recipe===1){ bg=color; fg='#fff'; shape='circle'; }
  else if(recipe===2){ bg='#fff'; fg=color; shape='squircle'; border=true; }
  else if(recipe===3){ bg=color; fg='#fff'; shape='squircle'; }
  else { bg='#15191F'; fg='#fff'; shape='squircle'; }
  const radius = shape==='circle' ? '50%' : Math.round(size*0.28)+'px';
  const g = Math.round(size*0.5);
  return (
    <span className="clogo" style={{ width:size, height:size, background:bg, color:fg, borderRadius:radius, border: border?'1px solid var(--line-2)':'none', display:'inline-grid', placeItems:'center', flex:'none', ...style }}>
      {useLetter
        ? <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:Math.round(size*0.42), letterSpacing:'-0.04em', lineHeight:1 }}>{(name.match(/[A-Za-z]/)||['J'])[0].toUpperCase()}</span>
        : <svg viewBox="0 0 24 24" width={g} height={g} fill="currentColor" style={{display:'block'}}><path d={mark} fillRule="evenodd"></path></svg>}
    </span>
  );
}

/* ---------- monogram logo ---------- */
function Mono({ name, size=44, round=false, className, style }){
  const bg = monoColor(name);
  const fs = Math.round(size*0.38);
  return (
    <span className={'mono '+(className||'')} style={{ width:size, height:size, background:bg, fontSize:fs, borderRadius: round?'50%':undefined, ...style }}>
      {initials(name)}
    </span>
  );
}

/* ---------- brand wordmark ---------- */
function BrandMark({ site, size=34 }){
  const name = site.name;
  const word = name.replace(/ Jobs$| Careers$/,'');
  const suffix = name.endsWith('Careers') ? 'Careers' : name.endsWith('Jobs') ? 'Jobs' : '';
  return (
    <a href={href(site.key)} className="brand" aria-label={name}>
      <span className="bm mono" style={{ background:'var(--accent)', width:size, height:size }}>
        <Icon name="briefcase" size={Math.round(size*0.5)} stroke={1.9} />
      </span>
      <span className="bn">{word}<span className="dot">{suffix?' '+suffix:''}</span></span>
    </a>
  );
}

/* ---------- header / nav ---------- */
const NAV_NICHE = [
  ['Browse jobs','jobs'], ['Employers','employers'], ['Salary tool','salary'], ['Guides','guide'], ['About','about'],
];
const NAV_GENERIC = [
  ['Find jobs','jobs'], ['Companies','employers'], ['Salary tool','salary'], ['Career advice','guide'], ['About','about'],
];
function Header({ site, page }){
  const [open, setOpen] = useState(false);
  const links = site.mode==='generic' ? NAV_GENERIC : NAV_NICHE;
  useEffect(()=>{ setOpen(false); }, [page]);
  return (
    <header className="masthead">
      <div className="top-rule"></div>
      <div className="wrap">
        <nav className="nav">
          <BrandMark site={site} />
          <div className="nav-links">
            {links.map(([label,p])=>(
              <a key={p} href={href(site.key,p)} className={page===p?'active':''}>{label}</a>
            ))}
          </div>
          <div className="nav-right">
            <div className="aud-switch hide-sm" role="group" aria-label="Audience">
              <a href={href(site.key)} className="seg active" aria-current="true">Job seekers</a>
              <span className="seg disabled" role="button" aria-disabled="true" tabIndex={0} onClick={(e)=>e.preventDefault()}>
                Employers <Icon name="lock" size={12} stroke={2}/>
                <span className="aud-tip" role="tooltip">Coming soon — employer tools aren’t available yet.</span>
              </span>
            </div>
            <a href={href(site.key,'soon','signin')} className="btn btn-ghost btn-sm hide-sm">Sign in</a>
            <a href={href(site.key,'post')} className="btn btn-primary btn-sm">Post a job</a>
            <button className="btn btn-ghost btn-sm nav-toggle" aria-label="Menu" onClick={()=>setOpen(o=>!o)}>
              <Icon name={open?'close':'menu'} size={18} />
            </button>
          </div>
        </nav>
      </div>
      {open && (
        <div className="mobile-menu">
          {links.map(([label,p])=>(
            <a key={p} href={href(site.key,p)} className={page===p?'active':''} onClick={()=>setOpen(false)}>{label}</a>
          ))}
          <a href={href(site.key,'post')} className="active" onClick={()=>setOpen(false)}>Post a job</a>
          <a href={href(site.key,'soon','signin')} onClick={()=>setOpen(false)}>Sign in <SoonPill/></a>
          <a href={href(site.key,'soon','register')} onClick={()=>setOpen(false)}>Create account <SoonPill/></a>
        </div>
      )}
    </header>
  );
}

/* ---------- trust bar ---------- */
function TrustBar({ site }){
  return (
    <div className="trustbar">
      <div className="wrap tb-inner">
        <div className="tb-stat">
          <span className="n tnum">{site.totalJobs.toLocaleString('en-US')}</span>
          <span className="l">open {site.mode==='generic'?'jobs':site.roleNoun+' roles'}</span>
        </div>
        <div className="tb-divider hide-sm"></div>
        <div className="tb-stat">
          <span className="pulse"></span>
          <span className="l">Updated daily</span>
        </div>
        {!window.__jobsLoading && <div className="tb-logos">
          {site.employers.slice(0,5).map(e=>(
            <span key={e.id} className="lg">{e.name.replace(/ (Health System|Medical Center|School District|Public Schools|Contractors|Solutions|Services|Group|Co\.)$/,'')}</span>
          ))}
        </div>}
      </div>
    </div>
  );
}

/* ---------- section heading ---------- */
function SectionHead({ eyebrow, title, sub, action, center }){
  return (
    <div className={'section-head '+(center?'center':'')}>
      <div className="sec-top">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {sub && <p className="sub">{sub}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

/* ---------- "Soon" pill (deferred features) ---------- */
function SoonPill(){ return <span className="soon-pill">Soon</span>; }

/* ---------- save button (used on cards) ---------- */
function SaveBtn({ compact }){
  const [on,setOn] = useState(false);
  return (
    <button className={'savebtn'+(on?' on':'')} aria-pressed={on}
      onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setOn(s=>{ if(!s) window.track&&window.track('job_saved',{}); return !s; }); }}>
      <Icon name={on?'bookmarkFill':'bookmark'} size={14} stroke={1.8}/>{compact?null:(on?'Saved':'Save')}
    </button>
  );
}

/* ---------- job card (big — featured grids + browse results) ---------- */
function FeaturedCard({ site, job }){
  return (
    <a href={href(site.key,'jobs',job.id)} className="jcard">
      <div className="jcard-top">
        <CompanyLogo name={job.company} size={54}/>
        <SaveBtn/>
      </div>
      <div className="jcard-co"><b>{job.company}</b> · {fmtPosted(job.posted).replace('Posted ','')}</div>
      <div className="jcard-title">{job.title}</div>
      <div className="jcard-tags">
        <span className="tag">{job.type}</span>
        <span className="tag">{job.remote?'Remote':job.level}</span>
        {job.featured && <span className="tag accent"><Icon name="star" size={11} stroke={2}/>Featured</span>}
      </div>
      <div className="jcard-spacer"></div>
      <div className="jcard-rule"></div>
      <div className="jcard-foot">
        <div className="jcard-sal tnum">{fmtSalaryShort(job)}</div>
        <div className="jcard-foot-row">
          <span className="jcard-loc">{job.remote?'Remote':`${job.city}, ${job.st}`}</span>
          {job.applyUrl
            ? <span role="link" tabIndex={0} className="btn btn-dark btn-sm"
                onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); window.track&&window.track('apply_clicked',{job_title:job.title,company:job.company,site:site.key,source:'card'}); window.open(job.applyUrl,'_blank','noopener,noreferrer'); }}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); window.track&&window.track('apply_clicked',{job_title:job.title,company:job.company,site:site.key,source:'card'}); window.open(job.applyUrl,'_blank','noopener,noreferrer'); } }}>Apply now</span>
            : <span className="btn btn-dark btn-sm">Apply now</span>}
        </div>
      </div>
    </a>
  );
}

/* ---------- job row (latest, employer roles, dense lists) ---------- */
function JobCard({ site, job }){
  return (
    <a href={href(site.key,'jobs',job.id)} className="jobcard">
      <CompanyLogo name={job.company} size={52}/>
      <div className="jc-body">
        <div className="jc-co">{job.company}</div>
        <div className="jc-title">{job.title}</div>
        <div className="jc-meta">
          <span className="tag"><Icon name="pin" size={13}/>{job.remote?'Remote':`${job.city}, ${job.st}`}</span>
          <span className="tag">{job.type}</span>
          <span className="tag">{job.level}</span>
          {job.featured && <span className="tag accent"><Icon name="star" size={11} stroke={2}/>Featured</span>}
        </div>
      </div>
      <div className="jc-right">
        <SaveBtn compact/>
        <span className="jc-salary tnum">{fmtSalary(job)}</span>
        <span className="jc-posted">{fmtPosted(job.posted)}</span>
      </div>
    </a>
  );
}

/* ---------- city / role chips ---------- */
function ChipSkeleton({ n=6 }){
  return <div className="chip-row" aria-hidden="true">{Array.from({length:n}).map((_,i)=>(
    <span key={i} className="chip"><span style={{display:'inline-block',width:64+(i%3)*26,height:12,background:'var(--paper-2)',borderRadius:6}}></span></span>
  ))}</div>;
}
function CityChips({ site, limit=10 }){
  if(window.__jobsLoading) return <ChipSkeleton/>;
  const list = (site.liveCities && site.liveCities.length ? site.liveCities : site.cities).slice(0,limit);
  if(!list.length) return null;
  return (
    <div className="chip-row">
      {list.map(c=>(
        <a key={c.city+c.st} href={href(site.key,'jobs')+'?city='+encodeURIComponent(c.city)} className="chip" onClick={()=>{ window.track&&window.track('category_clicked',{kind:'city',value:c.city,site:site.key}); }}>
          <Icon name="pin" size={14} />{c.city}{c.st?', '+c.st:''}
          <span className="c-count tnum">{c.count.toLocaleString('en-US')}</span>
        </a>
      ))}
    </div>
  );
}
function RoleChips({ site, limit=8 }){
  if(window.__jobsLoading) return <ChipSkeleton n={5}/>;
  const list = (site.liveRoles && site.liveRoles.length ? site.liveRoles : site.roles).slice(0,limit);
  if(!list.length) return null;
  return (
    <div className="chip-row">
      {list.map(r=>(
        <a key={r.name} href={href(site.key,'jobs')+'?role='+encodeURIComponent(r.name)} className="chip" onClick={()=>{ window.track&&window.track('category_clicked',{kind:'role',value:r.name,site:site.key}); }}>
          {r.name}<span className="c-count tnum">{r.count.toLocaleString('en-US')}</span>
        </a>
      ))}
    </div>
  );
}

/* ---------- breadcrumb ---------- */
function Crumbs({ site, items }){
  return (
    <div className="wrap">
      <div className="crumbs">
        <a href={href(site.key)}>Home</a>
        {items.map((it,i)=>(
          <React.Fragment key={i}>
            <span className="sep"><Icon name="chevRight" size={13}/></span>
            {it.to ? <a href={it.to}>{it.label}</a> : <span style={{color:'var(--ink-2)'}}>{it.label}</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ---------- email alert CTA band ---------- */
function EmailCapture({ site, title, sub }){
  const [v,setV] = useState(''); const [done,setDone] = useState(false);
  return (
    <section className="section-sm">
      <div className="wrap">
        <div className="cta-band">
          <div className="veil"></div>
          <div className="cta-inner">
            <div>
              <h2>{title || `Get new ${site.mode==='generic'?'jobs':site.roleNoun+' jobs'} in your inbox`}</h2>
              <p className="sub">{sub || 'A short, curated email when roles matching your search are posted. No spam, unsubscribe anytime.'}</p>
            </div>
            <div>
              {done ? (
                <div style={{display:'flex',alignItems:'center',gap:12,color:'#fff'}}>
                  <span className="mono" style={{background:'rgba(255,255,255,.18)',width:40,height:40}}><Icon name="check" size={20}/></span>
                  <span>You’re subscribed. We’ll be in touch.</span>
                </div>
              ) : (
                <form className="alert-form" onSubmit={e=>{e.preventDefault(); if(v.includes('@')){ window.track&&window.track('alert_signup',{source:'alert_band',site:site.key}); setDone(true);} }}>
                  <input className="input" type="email" placeholder="you@email.com" value={v} onChange={e=>setV(e.target.value)} required />
                  <button className="btn btn-lg" type="submit">Create alert</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- salary teaser ---------- */
function SalaryTeaser({ site }){
  const ex = site.factors.role[0];
  return (
    <a href={href(site.key,'salary')} className="card card-pad" style={{display:'flex',gap:'var(--s5)',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
      <div style={{display:'flex',gap:'var(--s4)',alignItems:'center'}}>
        <span className="mono" style={{background:'var(--accent-soft)',color:'var(--accent-ink)',width:52,height:52}}><Icon name="trending" size={24}/></span>
        <div>
          <div style={{fontFamily:'var(--font-head)',fontWeight:600,fontSize:18}}>What does a {ex.toLowerCase()} earn?</div>
          <div style={{color:'var(--ink-3)',fontSize:14,marginTop:2}}>Estimate pay by role, location, and experience.</div>
        </div>
      </div>
      <span className="btn btn-soft">Open salary tool <Icon name="arrow" size={16}/></span>
    </a>
  );
}

/* ---------- guide teaser cards ---------- */
function GuideTeaser({ site, items }){
  const list = items || site.guide.slice(0,3);
  return (
    <div className="grid-3">
      {list.map((g,i)=>(
        <a key={i} href={href(site.key,'guide')} className="guide-card">
          <span className="gc-kicker">{g.kicker}</span>
          <span className="gc-title">{g.title}</span>
          <span className="gc-desc">{g.desc}</span>
          <span style={{marginTop:'auto',paddingTop:12,color:'var(--ink-4)',fontSize:12.5,display:'flex',alignItems:'center',gap:8}}>
            <Icon name="clock" size={13}/>{g.read}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ---------- footer ---------- */
function Footer({ site }){
  const links = site.mode==='generic'
    ? [['Find jobs','jobs'],['Companies','employers'],['Salary tool','salary']]
    : [['Browse jobs','jobs'],['Employers','employers'],['Salary tool','salary']];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <BrandMark site={site} size={30} />
            <p className="f-about">{site.tagline}</p>
            <div style={{display:'flex',gap:10,marginTop:'var(--s5)'}}>
              {['globe','mail','users'].map(n=>(
                <span key={n} className="mono" style={{background:'var(--paper-2)',color:'var(--ink-3)',width:36,height:36,borderRadius:8}}><Icon name={n} size={17}/></span>
              ))}
            </div>
          </div>
          <div>
            <div className="fc-title">For job seekers</div>
            <div className="fc-links">
              {links.map(([l,p])=><a key={p} href={href(site.key,p)}>{l}</a>)}
              <a href={href(site.key,'guide')}>Career guides</a>
              <a href={href(site.key,'soon','profile')}>Create a profile <SoonPill/></a>
              <a href={href(site.key,'soon','saved')}>Saved jobs <SoonPill/></a>
              <a href={href(site.key,'soon','signin')}>Sign in <SoonPill/></a>
            </div>
          </div>
          <div>
            <div className="fc-title">For employers</div>
            <div className="fc-links">
              <a href={href(site.key,'post')}>Post a job</a>
              <a href={href(site.key,'post')}>Pricing</a>
              <a href={href(site.key,'employers')}>Employer directory</a>
              <a href={href(site.key,'soon','employer-dashboard')}>Employer dashboard <SoonPill/></a>
              <a href={href(site.key,'soon','manage')}>Manage listings <SoonPill/></a>
              <a href={href(site.key,'soon','candidates')}>Search candidates <SoonPill/></a>
            </div>
          </div>
          <div>
            <div className="fc-title">Company</div>
            <div className="fc-links">
              <a href={href(site.key,'about')}>About us</a>
              <a href={href(site.key,'about')}>Contact</a>
              <a href={href(site.key,'guide')}>Help center</a>
              <a href={href(site.key)}>{site.domain}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {site.name}. An independent job board.</span>
          <span style={{display:'flex',gap:'var(--s5)'}}>
            <a href={href(site.key,'about')}>Privacy</a><a href={href(site.key,'about')}>Terms</a><a href={href(site.key,'about')}>Accessibility</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  navigate, href, Link, Icon, CAT_ICON, Mono, CompanyLogo, BrandMark, Header, TrustBar, SaveBtn, SoonPill,
  SectionHead, JobCard, FeaturedCard, CityChips, RoleChips, Crumbs,
  EmailCapture, SalaryTeaser, GuideTeaser, Footer,
});
