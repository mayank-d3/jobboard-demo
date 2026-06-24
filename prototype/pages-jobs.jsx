/* ============================================================
   pages-jobs.jsx — Browse results + Job detail (+ apply flow)
   ============================================================ */

/* ---------- Apply modal ---------- */
function ApplyModal({ site, job, onClose }){
  const [step,setStep] = useState(0);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState('');
  const [f,setF] = useState({name:'',email:'',phone:'',note:'',file:null});
  const set = (k)=>(e)=>setF(s=>({...s,[k]:e.target.value}));
  useEffect(()=>{ window.track&&window.track('apply_start',{job_title:job.title,company:job.company,site:site.key}); const h=e=>{ if(e.key==='Escape') onClose(); }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h); },[]);
  async function submit(e){
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      const key = (window._W3F && window._W3F.key) || '';
      if(!key){ await new Promise(r=>setTimeout(r,700)); window.track&&window.track('apply_submit',{job_title:job.title,company:job.company,site:site.key,mode:'demo'}); setStep(1); }   // demo mode — no Web3Forms key set yet
      else {
        const fd = new FormData();
        fd.append('access_key', key);
        fd.append('subject', `New application — ${job.title} @ ${job.company}`);
        fd.append('from_name', `${site.name} applications`);
        fd.append('name', f.name); fd.append('email', f.email); fd.append('phone', f.phone||'');
        fd.append('Applying for', `${job.title} — ${job.company}`);
        fd.append('Board', site.name); fd.append('Listing contact', job.contactEmail||'n/a');
        fd.append('message', f.note||'(no note)');
        if(f.file) fd.append('attachment', f.file);
        const res = await fetch('https://api.web3forms.com/submit', { method:'POST', body:fd });
        const data = await res.json().catch(()=>({}));
        if(res.ok && (data.success===undefined || data.success)){ window.track&&window.track('apply_submit',{job_title:job.title,company:job.company,site:site.key,mode:'live'}); setStep(1); }
        else throw new Error(data.message || 'Submission failed. Please try again.');
      }
    } catch(err){ setError((err && err.message) || 'Something went wrong. Please try again.'); }
    finally { setSubmitting(false); }
  }
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(20,24,31,.42)',backdropFilter:'blur(3px)',display:'grid',placeItems:'center',padding:20}}>
      <div onClick={e=>e.stopPropagation()} className="card" style={{width:'min(520px,100%)',maxHeight:'90vh',overflow:'auto',padding:'var(--s8)'}}>
        {step===0 ? (
          <form onSubmit={submit}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
              <div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:21}}>Apply for this role</div>
                <div style={{color:'var(--ink-3)',fontSize:14,marginTop:4}}>{job.title} · {job.company}</div>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close"><Icon name="close" size={16}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--s4)',marginTop:'var(--s6)'}}>
              <div className="field"><label>Full name</label><input className="input" required value={f.name} onChange={set('name')} placeholder="Jordan Avery"/></div>
              <div className="grid-2" style={{gap:'var(--s3)'}}>
                <div className="field"><label>Email</label><input className="input" type="email" required value={f.email} onChange={set('email')} placeholder="you@email.com"/></div>
                <div className="field"><label>Phone</label><input className="input" value={f.phone} onChange={set('phone')} placeholder="(555) 123-4567"/></div>
              </div>
              <div className="field"><label>Resume <span style={{color:'var(--ink-4)',fontWeight:400}}>(optional)</span></label>
                <label className="card" style={{padding:'var(--s5)',border:'1px dashed var(--line-2)',textAlign:'center',color:'var(--ink-3)',fontSize:14,cursor:'pointer',display:'block'}}>
                  <input type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>setF(s=>({...s,file:(e.target.files&&e.target.files[0])||null}))}/>
                  <Icon name="doc" size={22} style={{margin:'0 auto 8px'}}/>
                  {f.file ? <span style={{color:'var(--accent-ink)',fontWeight:600}}>{f.file.name}</span> : <>Drag a file here or <span style={{color:'var(--accent-ink)',fontWeight:600}}>browse</span></>}
                  <div style={{fontSize:12,marginTop:4}}>PDF or DOCX, up to 5MB</div>
                </label>
              </div>
              <div className="field"><label>Note to the hiring team <span style={{color:'var(--ink-4)',fontWeight:400}}>(optional)</span></label><textarea className="textarea" style={{minHeight:88}} value={f.note} onChange={set('note')} placeholder="A sentence on why you’re a great fit."/></div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" style={{marginTop:'var(--s6)'}} disabled={submitting}>{submitting?'Submitting…':'Submit application'}</button>
            {error && <p style={{color:'#c0362c',fontSize:13,textAlign:'center',marginTop:10}}>{error}</p>}
            <p style={{color:'var(--ink-4)',fontSize:12.5,textAlign:'center',marginTop:12}}>Your application goes directly to {job.company}.</p>
          </form>
        ) : (
          <div style={{textAlign:'center',padding:'var(--s5) 0'}}>
            <span className="mono" style={{background:'var(--success-soft)',color:'var(--success)',width:60,height:60,margin:'0 auto var(--s5)'}}><Icon name="check" size={28} stroke={2.2}/></span>
            <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:23}}>Application sent</div>
            <p style={{color:'var(--ink-2)',marginTop:10,maxWidth:'34ch',margin:'10px auto 0'}}>Your application for <strong>{job.title}</strong> at {job.company} is on its way. You’ll hear back by email.</p>
            <button className="btn btn-primary btn-block" style={{marginTop:'var(--s6)'}} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Job detail ---------- */
function JobDetail({ site, id }){
  const job = getJob(site.key, id);
  const [saved,setSaved] = useState(false);
  useEffect(()=>{ window.scrollTo(0,0); },[id]);
  if(!job) return <NotFound site={site}/>;
  const emp = getEmployer(site.key, job.companyId);
  const related = relatedJobs(site, job, 3);
  return (
    <div>
      <Crumbs site={site} items={[{label:`${site.vertical==='Job'?'Jobs':site.vertical+' jobs'}`,to:href(site.key,'jobs')},{label:job.title}]}/>
      <section style={{paddingBottom:'var(--s16)'}}>
        <div className="wrap">
          <div className="detail-grid">
            <div>
              {/* header */}
              <div style={{display:'flex',gap:'var(--s4)',alignItems:'flex-start'}}>
                <CompanyLogo name={job.company} size={64}/>
                <div style={{flex:1,minWidth:0}}>
                  <h1 style={{fontSize:'clamp(26px,3.4vw,36px)'}}>{job.title}</h1>
                  <a href={href(site.key,'employer',job.companyId)} style={{display:'inline-flex',alignItems:'center',gap:8,marginTop:8,color:'var(--accent-ink)',fontWeight:600,fontFamily:'var(--font-head)'}}>
                    {job.company} <Icon name="arrowUpRight" size={15}/>
                  </a>
                  <div className="jc-meta" style={{marginTop:14,fontSize:14.5}}>
                    <span className="m"><Icon name="pin" size={16}/>{job.remote?'Remote':`${job.city}, ${job.st}`}</span>
                    <span className="m"><Icon name="briefcase" size={16}/>{job.type}</span>
                    <span className="m"><Icon name="trending" size={16}/>{job.level}</span>
                    <span className="m"><Icon name="clock" size={16}/>{fmtPosted(job.posted)}</span>
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}}>
                    {job.tags.map(t=><span key={t} className="tag">{t}</span>)}
                    {job.featured && <span className="tag accent"><Icon name="star" size={12} stroke={2}/>Featured</span>}
                  </div>
                </div>
              </div>

              <hr className="divider" style={{margin:'var(--s6) 0'}}/>

              <div className="prose">
                <p>{job.desc.intro}</p>
                {job.desc.resp.length>0 && <><h3>What you’ll do</h3>
                <ul>{job.desc.resp.map((r,i)=><li key={i}>{r}</li>)}</ul></>}
                {job.desc.reqs.length>0 && <><h3>What we’re looking for</h3>
                <ul>{job.desc.reqs.map((r,i)=><li key={i}>{r}</li>)}</ul></>}
                <h3>Benefits</h3>
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {site.benefits.map(b=><span key={b} className="tag" style={{padding:'7px 12px'}}><Icon name="check" size={13} style={{color:'var(--accent)'}}/> {b}</span>)}
                </div>
              </div>

              <div className="card card-pad" style={{marginTop:'var(--s8)',display:'flex',gap:'var(--s4)',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
                <div style={{display:'flex',gap:14,alignItems:'center'}}>
                  <CompanyLogo name={job.company} size={48}/>
                  <div>
                    <div style={{fontFamily:'var(--font-head)',fontWeight:600}}>{job.company}</div>
                    <div style={{color:'var(--ink-3)',fontSize:13.5}}>{emp?emp.size:''} · {emp?emp.hq:''}</div>
                  </div>
                </div>
                <a href={href(site.key,'employer',job.companyId)} className="btn btn-ghost btn-sm">View company <Icon name="arrow" size={15}/></a>
              </div>
            </div>

            {/* sticky apply rail */}
            <aside>
              <div className="sticky-rail">
                <div className="card card-pad">
                  <div style={{color:'var(--ink-3)',fontSize:13,fontWeight:600,fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:'.06em'}}>Salary</div>
                  <div className="jc-salary tnum" style={{fontSize:26,marginTop:6}}>{fmtSalary(job)}</div>
                  {job.hourly && <div style={{color:'var(--ink-3)',fontSize:13,marginTop:4}}>≈ {fmtMoney(job.salLo)} – {fmtMoney(job.salHi)} / yr</div>}
                  {job.applyUrl && <a className="btn btn-primary btn-lg btn-block" style={{marginTop:'var(--s5)'}} href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={()=>{ window.track&&window.track('apply_clicked',{job_title:job.title,company:job.company,site:site.key,source:'detail'}); }}>Apply now <Icon name="arrowUpRight" size={16}/></a>}
                  <div style={{color:'var(--ink-4)',fontSize:12.5,textAlign:'center',marginTop:10}}>Opens the employer’s site in a new tab.</div>
                  <button className="btn btn-ghost btn-block" style={{marginTop:10}} onClick={()=>setSaved(s=>!s)}>
                    <Icon name="heart" size={16} style={saved?{color:'var(--accent)'}:undefined}/> {saved?'Saved':'Save job'}
                  </button>
                  <div style={{display:'flex',gap:'var(--s4)',marginTop:'var(--s5)',paddingTop:'var(--s5)',borderTop:'1px solid var(--line)',color:'var(--ink-3)',fontSize:13}}>
                    <span><Icon name="shield" size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:5}}/>Verified employer</span>
                  </div>
                </div>
                <div className="card card-pad">
                  <div style={{fontFamily:'var(--font-head)',fontWeight:600,marginBottom:10}}>Get jobs like this</div>
                  <SalaryMini site={site}/>
                </div>
              </div>
            </aside>
          </div>

          {/* related */}
          <div style={{marginTop:'var(--s16)'}}>
            <SectionHead eyebrow="Keep exploring" title="Related jobs" />
            <div className="grid-3">{related.map(j=><FeaturedCard key={j.id} site={site} job={j}/>)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
function SalaryMini({ site }){
  const [v,setV]=useState(''); const [ok,setOk]=useState(false);
  return ok ? <div style={{color:'var(--success)',fontSize:14,display:'flex',gap:8,alignItems:'center'}}><Icon name="check" size={16}/>Alert created.</div> :
  <form onSubmit={e=>{e.preventDefault(); if(v.includes('@')) setOk(true);}} style={{display:'flex',flexDirection:'column',gap:10}}>
    <input className="input" type="email" placeholder="you@email.com" value={v} onChange={e=>setV(e.target.value)} required/>
    <button className="btn btn-soft btn-block" type="submit">Create email alert</button>
  </form>;
}

/* ---------- Browse results ---------- */
function Browse({ site, query }){
  const initType = []; 
  const [types,setTypes] = useState(initType);
  const [remoteOnly,setRemote] = useState(false);
  const [levels,setLevels] = useState([]);
  const [sort,setSort] = useState('recent');
  const [page,setPage] = useState(1);
  const [filtersOpen,setFiltersOpen] = useState(false);
  const [q,setQ] = useState(query.q||'');
  const [cityF,setCityF] = useState(''); // refine box; the metro itself is driven by query.city -> the live fetch
  const roleF = query.role||''; const catF = query.cat||'';
  const PER = 300; // show the full live feed in one long scroll

  useEffect(()=>{ window.scrollTo(0,0); },[]);
  useEffect(()=>{ setPage(1); },[types,remoteOnly,levels,sort,q,cityF]);

  let results = site.jobs.filter(j=>{
    if(q){ const s=(j.title+' '+j.company).toLowerCase(); if(!s.includes(q.toLowerCase())) return false; }
    if(cityF && !((j.city||'').toLowerCase().includes(cityF.toLowerCase()))) return false;
    if(roleF){ const rk=roleF.toLowerCase().split(/[ /]+/)[0]; if(!j.title.toLowerCase().includes(rk)) return false; }
    if(types.length && !types.includes(j.type)) return false;
    if(remoteOnly && !j.remote) return false;
    if(levels.length && !levels.includes(j.level)) return false;
    return true;
  });
  if(sort==='recent') results = [...results].sort((a,b)=>a.posted-b.posted);
  else if(sort==='salaryHigh') results = [...results].sort((a,b)=>b.salHi-a.salHi);
  else if(sort==='salaryLow') results = [...results].sort((a,b)=>a.salLo-b.salLo);

  const total = results.length;
  const pages = Math.max(1, Math.ceil(total/PER));
  const pageJobs = results.slice((page-1)*PER, page*PER);

  const titleCity = cityF ? ` in ${cityF}` : '';
  const titleRole = roleF || catF || (site.vertical==='Job'?'Jobs':site.vertical+' jobs');
  const heading = q ? `“${q}”${titleCity}` : `${titleRole}${titleCity}`;

  const toggle = (arr,setArr,val)=> setArr(a=> a.includes(val)? a.filter(x=>x!==val): [...a,val]);
  const clearAll = ()=>{ setTypes([]); setRemote(false); setLevels([]); setQ(''); setCityF(''); };

  return (
    <div>
      <Crumbs site={site} items={[{label:'Browse jobs',to:href(site.key,'jobs')},{label: q?`Search`:(titleRole+titleCity)}]}/>
      <section style={{paddingBottom:'var(--s16)'}}>
        <div className="wrap">
          {/* search/refine bar */}
          <div className="card card-pad" style={{marginBottom:'var(--s6)'}}>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <div className="input-icon" style={{flex:'2 1 240px'}}><Icon name="search" size={18} className="ico"/><input className="input" placeholder="Job title, keyword, or company" value={q} onChange={e=>setQ(e.target.value)}/></div>
              <div className="input-icon" style={{flex:'1 1 180px'}}><Icon name="pin" size={18} className="ico"/><input className="input" placeholder="City or state" value={cityF} onChange={e=>setCityF(e.target.value)}/></div>
            </div>
          </div>

          <div className="filters-mobile">
            <button className="btn btn-ghost btn-block" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(o=>!o)}>
              <Icon name="filter" size={16}/> {filtersOpen?'Hide filters':'Filters'}{(types.length+levels.length+(remoteOnly?1:0))>0?` · ${types.length+levels.length+(remoteOnly?1:0)}`:''}
            </button>
          </div>

          <div className="results-grid">
            {/* filters */}
            <aside className={'filter-panel'+(filtersOpen?' open':'')}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:16,display:'flex',gap:8,alignItems:'center'}}><Icon name="filter" size={17}/>Filters</span>
                <button className="btn btn-ghost btn-sm" onClick={clearAll} style={{padding:'5px 10px',fontSize:12.5}}>Clear</button>
              </div>
              <div className="fp-group">
                <div className="fp-title">Job type</div>
                {['Full-time','Part-time','Contract','Per diem'].map(t=>{
                  const n = site.jobs.filter(j=>j.type===t).length;
                  return (
                    <label key={t} className={'check'+(n===0?' is-zero':'')}><input type="checkbox" disabled={n===0} checked={types.includes(t)} onChange={()=>toggle(types,setTypes,t)}/>{t}
                      <span className="cc tnum">{n}</span></label>
                  );
                })}
              </div>
              {site.jobs.some(j=>j.level) && (
              <div className="fp-group">
                <div className="fp-title">Experience</div>
                {site.levels.map(l=>{
                  const n = site.jobs.filter(j=>j.level===l).length;
                  return (
                    <label key={l} className={'check'+(n===0?' is-zero':'')}><input type="checkbox" disabled={n===0} checked={levels.includes(l)} onChange={()=>toggle(levels,setLevels,l)}/>{l}
                      <span className="cc tnum">{n}</span></label>
                  );
                })}
              </div>
              )}
              {site.jobs.filter(j=>j.remote).length > 0 && (
                <div className="fp-group">
                  <div className="fp-title">Workplace</div>
                  <label className="check"><input type="checkbox" checked={remoteOnly} onChange={()=>setRemote(r=>!r)}/>Remote only
                    <span className="cc tnum">{site.jobs.filter(j=>j.remote).length}</span></label>
                </div>
              )}
            </aside>

            {/* results */}
            <div>
              <div className="sec-top" style={{marginBottom:'var(--s5)'}}>
                <div style={{flex:'1 1 240px',minWidth:0}}>
                  <h1 style={{fontSize:'clamp(24px,3vw,32px)',textTransform:'capitalize',lineHeight:1.12}}>{heading}</h1>
                  <p style={{color:'var(--ink-3)',marginTop:10}}><span className="tnum">{total.toLocaleString('en-US')}</span> {total===1?'job':'jobs'} found</p>
                </div>
                <div className="field" style={{minWidth:180}}>
                  <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
                    <option value="recent">Most recent</option>
                    <option value="salaryHigh">Salary: high to low</option>
                    <option value="salaryLow">Salary: low to high</option>
                  </select>
                </div>
              </div>

              {total===0 ? (
                <div className="empty">
                  <span className="ei"><Icon name="search" size={26}/></span>
                  <h3>No jobs match your search</h3>
                  <p>We couldn’t find any roles for these filters. Try removing a filter, broadening your location, or set up an alert and we’ll email you when something matches.</p>
                  <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:'var(--s5)',flexWrap:'wrap'}}>
                    <button className="btn btn-primary" onClick={clearAll}>Clear all filters</button>
                    <a href={href(site.key,'salary')} className="btn btn-ghost">Create an alert</a>
                  </div>
                </div>
              ) : (
                <div className="grid-2">{pageJobs.map(j=><FeaturedCard key={j.id} site={site} job={j}/>)}</div>
              )}

              {pages>1 && (
                <div className="pager">
                  <button className="nav-arrow" disabled={page===1} onClick={()=>setPage(p=>p-1)}><Icon name="chevRight" size={16} style={{transform:'rotate(180deg)'}}/></button>
                  {Array.from({length:pages}).map((_,i)=>(
                    <button key={i} className={page===i+1?'active':''} onClick={()=>setPage(i+1)}>{i+1}</button>
                  ))}
                  <button className="nav-arrow" disabled={page===pages} onClick={()=>setPage(p=>p+1)}><Icon name="chevRight" size={16}/></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <EmailCapture site={site}/>
    </div>
  );
}

Object.assign(window, { JobDetail, Browse, ApplyModal });
