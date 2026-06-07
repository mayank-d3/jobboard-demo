/* ============================================================
   pages-employers.jsx — Employer directory + Employer profile
   ============================================================ */

function EmployerDirectory({ site }){
  const [q,setQ] = useState('');
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  const list = site.employers.filter(e=> !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.hq.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <Crumbs site={site} items={[{label:'Employers'}]}/>
      <section style={{paddingBottom:'var(--s16)'}}>
        <div className="wrap">
          <SectionHead eyebrow="Hiring now" title={site.mode==='generic'?'Companies hiring':`Employers hiring ${site.roleNoun}s`}
            sub={`Browse organizations actively recruiting on ${site.name}. Every employer is verified.`} />
          <div className="card card-pad" style={{marginBottom:'var(--s6)',maxWidth:520}}>
            <div className="input-icon"><Icon name="search" size={18} className="ico"/><input className="input" placeholder="Search employers by name or city" value={q} onChange={e=>setQ(e.target.value)}/></div>
          </div>
          {list.length===0 ? (
            <div className="empty"><span className="ei"><Icon name="building" size={26}/></span><h3>No employers found</h3><p>Try a different name or location.</p></div>
          ) : (
            <div className="grid-2">
              {list.map(e=>(
                <a key={e.id} href={href(site.key,'employer',e.id)} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:'var(--s4)',transition:'all .15s'}}>
                  <div style={{display:'flex',gap:14,alignItems:'center'}}>
                    <CompanyLogo name={e.name} size={56}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:18,letterSpacing:'-.01em'}}>{e.name}</div>
                      <div style={{color:'var(--ink-3)',fontSize:13.5,display:'flex',gap:10,marginTop:3,flexWrap:'wrap'}}>
                        <span><Icon name="pin" size={13} style={{display:'inline',verticalAlign:'-2px',marginRight:3}}/>{e.hq}</span>
                        <span><Icon name="users" size={13} style={{display:'inline',verticalAlign:'-2px',marginRight:3}}/>{e.size}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{color:'var(--ink-2)',fontSize:14.5,lineHeight:1.55,flex:1}}>{e.blurb}</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'var(--s3)',borderTop:'1px solid var(--line)'}}>
                    <span className="tag accent"><span className="tnum">{e.openRoles}</span> open {e.openRoles===1?'role':'roles'}</span>
                    <span className="sc-go" style={{color:'var(--accent-ink)'}}>View profile <Icon name="arrow" size={15}/></span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EmployerProfile({ site, id }){
  useEffect(()=>{ window.scrollTo(0,0); },[id]);
  const e = getEmployer(site.key, id);
  if(!e) return <NotFound site={site}/>;
  const roles = site.jobs.filter(j=>j.companyId===id);
  const cities = [...new Set(roles.map(r=>r.remote?'Remote':`${r.city}, ${r.st}`))];
  return (
    <div>
      <Crumbs site={site} items={[{label:'Employers',to:href(site.key,'employers')},{label:e.name}]}/>
      <section style={{paddingBottom:'var(--s16)'}}>
        <div className="wrap">
          {/* header card */}
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{height:96,background:`linear-gradient(120deg, ${monoColor(e.name)}, ${monoColor(e.name)}cc)`,position:'relative'}}>
              <div style={{position:'absolute',inset:0,background:'radial-gradient(120% 140% at 85% -20%, rgba(255,255,255,.22), transparent 55%)'}}></div>
            </div>
            <div style={{padding:'0 var(--s6) var(--s6)'}}>
              <div style={{display:'flex',gap:'var(--s4)',alignItems:'flex-end',marginTop:-36,flexWrap:'wrap'}}>
                <CompanyLogo name={e.name} size={84} style={{border:'4px solid var(--surface)',boxShadow:'var(--shadow-sm)'}}/>
                <div style={{flex:1,minWidth:200,paddingBottom:4}}>
                  <h1 style={{fontSize:'clamp(24px,3.2vw,34px)'}}>{e.name}</h1>
                  <div style={{color:'var(--ink-3)',fontSize:14,display:'flex',gap:16,marginTop:8,flexWrap:'wrap'}}>
                    <span><Icon name="pin" size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:5}}/>{e.hq}</span>
                    <span><Icon name="users" size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:5}}/>{e.size}</span>
                    <span><Icon name="calendar" size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:5}}/>Founded {e.founded}</span>
                  </div>
                </div>
                <a href={'#'} onClick={ev=>ev.preventDefault()} className="btn btn-ghost btn-sm" style={{marginBottom:4}}><Icon name="globe" size={15}/>Visit website</a>
              </div>
            </div>
          </div>

          <div className="detail-grid" style={{marginTop:'var(--s8)'}}>
            <div>
              <SectionHead eyebrow="About" title={`About ${e.name}`} />
              <p className="prose" style={{marginBottom:'var(--s6)'}}>{e.blurb} The team is committed to investing in its people, with structured onboarding, ongoing training, and clear paths for advancement.</p>

              <SectionHead eyebrow={`${roles.length} open ${roles.length===1?'role':'roles'}`} title="Open positions" />
              {roles.length===0 ? (
                <div className="empty"><span className="ei"><Icon name="briefcase" size={26}/></span><h3>No open roles right now</h3><p>Follow this employer to be notified when they post a new job.</p></div>
              ) : (
                <div className="col-list">{roles.map(j=><JobCard key={j.id} site={site} job={j}/>)}</div>
              )}
            </div>

            <aside>
              <div className="sticky-rail">
                <div className="card card-pad">
                  <div style={{fontFamily:'var(--font-head)',fontWeight:600,marginBottom:'var(--s4)'}}>At a glance</div>
                  {[['Industry',site.field],['Headquarters',e.hq],['Company size',e.size],['Founded',String(e.founded)],['Open roles',String(e.openRoles)]].map(([k,v])=>(
                    <div key={k} style={{display:'flex',justifyContent:'space-between',gap:12,padding:'9px 0',borderBottom:'1px solid var(--line)',fontSize:14}}>
                      <span style={{color:'var(--ink-3)'}}>{k}</span><span style={{fontWeight:600,textAlign:'right'}} className="tnum">{v}</span>
                    </div>
                  ))}
                  <button className="btn btn-soft btn-block" style={{marginTop:'var(--s5)'}}><Icon name="bell" size={16}/>Follow employer</button>
                </div>
                {cities.length>0 && (
                  <div className="card card-pad">
                    <div style={{fontFamily:'var(--font-head)',fontWeight:600,marginBottom:12}}>Hiring locations</div>
                    <div className="chip-row">{cities.map(c=><span key={c} className="tag"><Icon name="pin" size={13}/>{c}</span>)}</div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { EmployerDirectory, EmployerProfile });
