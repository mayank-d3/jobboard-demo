/* ============================================================
   pages-home.jsx — Home in two modes (niche browse-first,
   generic search-first). Shared sections below the fold.
   ============================================================ */

function HeroArt({ site }){
  const loading = window.__jobsLoading;
  const sk = (w)=> <div style={{height:12, width:w, borderRadius:6, background:'var(--paper-2)'}}></div>;
  const jobs = site.jobs.slice(0,2);
  return (
    <div className="hero-art">
      {(loading ? [0,1] : jobs).map((j,i)=> loading ? (
        <div key={i} className="hero-card">
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            <div style={{width:44,height:44,borderRadius:13,background:'var(--paper-2)',flex:'none'}}></div>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:9}}>{sk('72%')}{sk('46%')}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14,paddingTop:14,borderTop:'1px solid var(--line)'}}>{sk(60)}{sk(52)}</div>
        </div>
      ) : (
        <div key={j.id} className="hero-card reveal" style={{animationDelay:(0.15+i*0.08)+'s'}}>
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            <CompanyLogo name={j.company} size={44}/>
            <div style={{minWidth:0,flex:1}}>
              <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:16,letterSpacing:'-0.02em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{j.title}</div>
              <div style={{color:'var(--ink-3)',fontSize:13.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{j.company} · {j.remote?'Remote':`${j.city}, ${j.st}`}</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginTop:14,paddingTop:14,borderTop:'1px solid var(--line)'}}>
            <span className="tag">{j.type}</span>
            <span className="jc-salary tnum" style={{fontSize:15}}>{fmtSalaryShort(j)}</span>
          </div>
        </div>
      ))}
      <div className="ha-float reveal" style={{animationDelay:'0.4s'}}>
        <span className="pulse"></span>
        <div style={{fontSize:13.5}}>
          <strong style={{fontFamily:'var(--font-head)'}} className="tnum">{loading ? '…' : (site.jobs.length*3+4)}</strong> new this week
        </div>
      </div>
    </div>
  );
}

/* ---------- NICHE home (browse-first, no big search) ---------- */
function NicheHome({ site }){
  const featured = site.jobs.filter(j=>j.featured).slice(0,6);
  const latest = [...site.jobs].sort((a,b)=>a.posted-b.posted).slice(0,6);
  return (
    <div>
      <section className="section hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow reveal"><span className="edot"></span>{site.field} · Updated daily</span>
              <h1 className="reveal" style={{animationDelay:'.05s'}}>{site.vertical} jobs,<br/><span className="ac">found faster.</span></h1>
              <p className="lede reveal" style={{animationDelay:'.1s'}}>{site.heroSub}</p>
              <div className="hero-cta reveal" style={{animationDelay:'.15s'}}>
                <a href={href(site.key,'jobs')} className="btn btn-primary btn-lg">Browse {site.vertical.toLowerCase()} jobs <Icon name="arrow" size={18}/></a>
                <a href={href(site.key,'post')} className="btn btn-ghost btn-lg">Post a job</a>
              </div>
              <div className="hero-sub reveal" style={{animationDelay:'.2s'}}>
                <div className="hs"><span className="n tnum">{site.totalJobs.toLocaleString('en-US')}</span><span className="l">Open roles</span></div>
                <div className="hs"><span className="n tnum">{site.employers.length*40+120}+</span><span className="l">Hiring employers</span></div>
                <div className="hs"><span className="n tnum">{site.cities.length*4}</span><span className="l">Cities & states</span></div>
              </div>
            </div>
            <HeroArt site={site}/>
          </div>
        </div>
      </section>

      <TrustBar site={site}/>

      {/* browse by city — primary for niche */}
      <section className="section-sm">
        <div className="wrap">
          <SectionHead eyebrow="Browse by location" title={`${site.vertical} jobs by city`}
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">All locations <Icon name="arrow" size={15}/></a>} />
          <CityChips site={site} limit={12}/>
        </div>
      </section>

      {/* browse by role */}
      <section className="section-sm" style={{paddingTop:0}}>
        <div className="wrap">
          <SectionHead eyebrow="Browse by role" title="Popular specialties" />
          <RoleChips site={site} limit={8}/>
        </div>
      </section>

      {/* featured */}
      <section className="section-sm bg-surface" style={{borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap">
          <SectionHead eyebrow="Hand-picked" title="Featured jobs"
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">View all <Icon name="arrow" size={15}/></a>} />
          <div className="grid-3">{featured.map(j=><FeaturedCard key={j.id} site={site} job={j}/>)}</div>
        </div>
      </section>

      {/* latest list */}
      <section className="section-sm">
        <div className="wrap">
          <SectionHead eyebrow="Fresh today" title="Latest openings"
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">See all jobs <Icon name="arrow" size={15}/></a>} />
          <div className="col-list">{latest.map(j=><JobCard key={j.id} site={site} job={j}/>)}</div>
        </div>
      </section>

      {/* salary + guides */}
      <section className="section-sm" style={{paddingTop:0}}>
        <div className="wrap" style={{display:'flex',flexDirection:'column',gap:'var(--s8)'}}>
          <SalaryTeaser site={site}/>
          <div>
            <SectionHead eyebrow="Career guides" title={`Becoming a ${site.roleNoun}`} sub="Practical guides on training, licensing, pay, and landing the role." />
            <GuideTeaser site={site}/>
          </div>
        </div>
      </section>

      <EmailCapture site={site}/>
    </div>
  );
}

/* ---------- GENERIC home (search-first + category grid) ---------- */
function GenericSearch({ site }){
  const [q,setQ] = useState(''); const [loc,setLoc] = useState('');
  const submit = (e)=>{ e.preventDefault(); window.track&&window.track('jobs_searched',{search_term:q||'',location:loc||'',site:site.key}); let u = href(site.key,'jobs'); const ps=[]; if(q) ps.push('q='+encodeURIComponent(q)); if(loc) ps.push('city='+encodeURIComponent(loc)); if(ps.length) u+='?'+ps.join('&'); navigate(u); };
  return (
    <form className="searchbar reveal" style={{animationDelay:'.12s'}} onSubmit={submit}>
      <div className="seg">
        <Icon name="search" size={20} className="ico"/>
        <div style={{flex:1}}>
          <div className="seg-label">What</div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Job title, keyword, or company" />
        </div>
      </div>
      <div className="seg">
        <Icon name="pin" size={20} className="ico"/>
        <div style={{flex:1}}>
          <div className="seg-label">Where</div>
          <input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="City, state, or remote" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-lg" style={{flex:'none'}}>Search jobs</button>
    </form>
  );
}
function GenericHome({ site }){
  const featured = site.jobs.filter(j=>j.featured).slice(0,6);
  const latest = [...site.jobs].sort((a,b)=>a.posted-b.posted).slice(0,6);
  // niche sites have no `categories` — derive a grid from their roles so generic mode never crashes
  const cats = site.categories || site.roles.slice(0,8).map(r=>({ name:r.name, count:r.count, icon:'briefcase' }));
  const popular = site.categories
    ? ['Registered Nurse','Warehouse Associate','Software Engineer','Remote','Customer Support']
    : site.roles.slice(0,4).map(r=>r.name).concat('Remote');
  return (
    <div>
      <section className="section hero" style={{background:'var(--accent-soft-2)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{maxWidth:880,textAlign:'center'}}>
          <span className="eyebrow reveal" style={{justifyContent:'center'}}><span className="edot"></span>{site.totalJobs.toLocaleString('en-US')} jobs · updated daily</span>
          <h1 className="reveal" style={{animationDelay:'.05s',fontSize:'clamp(38px,5.6vw,64px)',marginTop:12,letterSpacing:'-0.04em',lineHeight:1.02}}>{site.heroTitle ? <>{site.heroTitle.lead}<br/><span className="ac">{site.heroTitle.accent}</span></> : <>Find a job that<br/><span className="ac">fits your life.</span></>}</h1>
          <p className="lede reveal" style={{animationDelay:'.1s',margin:'var(--s5) auto 0',maxWidth:'52ch'}}>{site.tagline}</p>
          <div style={{marginTop:'var(--s8)'}}><GenericSearch site={site}/></div>
          <div className="reveal" style={{animationDelay:'.2s',marginTop:'var(--s5)',display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',alignItems:'center'}}>
            <span style={{color:'var(--ink-3)',fontSize:13.5}}>Popular:</span>
            {popular.map(p=>(
              <a key={p} href={href(site.key,'jobs')+'?q='+encodeURIComponent(p)} className="chip btn-sm" style={{padding:'6px 12px',fontSize:13}}>{p}</a>
            ))}
          </div>
        </div>
      </section>

      <TrustBar site={site}/>

      {/* category grid FIRST for generic */}
      <section className="section-sm">
        <div className="wrap">
          <SectionHead eyebrow="Explore by category" title="Browse all industries"
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">All categories <Icon name="arrow" size={15}/></a>} />
          <div className="cat-grid">
            {cats.map(c=>(
              <a key={c.name} href={href(site.key,'jobs')+'?cat='+encodeURIComponent(c.name)} className="cat">
                <span className="ci"><Icon name={CAT_ICON[c.icon]||'briefcase'} size={22}/></span>
                <div>
                  <div className="cn">{c.name}</div>
                  <div className="cc tnum">{c.count.toLocaleString('en-US')} jobs</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-surface" style={{borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap">
          <SectionHead eyebrow="Hand-picked" title="Featured jobs"
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">View all <Icon name="arrow" size={15}/></a>} />
          <div className="grid-3">{featured.map(j=><FeaturedCard key={j.id} site={site} job={j}/>)}</div>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap">
          <SectionHead eyebrow="Fresh today" title="Latest jobs"
            action={<a href={href(site.key,'jobs')} className="btn btn-ghost btn-sm hide-sm">See all jobs <Icon name="arrow" size={15}/></a>} />
          <div className="col-list">{latest.map(j=><JobCard key={j.id} site={site} job={j}/>)}</div>
        </div>
      </section>

      <section className="section-sm" style={{paddingTop:0}}>
        <div className="wrap">
          <SectionHead eyebrow="Browse by location" title="Jobs by city" />
          <CityChips site={site} limit={12}/>
        </div>
      </section>

      <section className="section-sm" style={{paddingTop:0}}>
        <div className="wrap" style={{display:'flex',flexDirection:'column',gap:'var(--s8)'}}>
          <SalaryTeaser site={site}/>
          <div>
            <SectionHead eyebrow="Career advice" title="Guides to help you land the job" />
            <GuideTeaser site={site}/>
          </div>
        </div>
      </section>

      <EmailCapture site={site}/>
    </div>
  );
}

function Home({ site, modeOverride }){
  const mode = modeOverride || site.mode;
  return mode==='generic' ? <GenericHome site={site}/> : <NicheHome site={site}/>;
}

Object.assign(window, { Home, NicheHome, GenericHome });
