/* ============================================================
   pages-misc.jsx — Post a Job + Pricing, Salary tool,
   Guide/FAQ, About/Contact, NotFound
   ============================================================ */

const PLANS = [
  { id:'free', name:'Free', price:0, blurb:'Get a role in front of seekers.', feats:[['30-day listing',true],['Standard placement in search',true],['Apply by email',true],['Featured badge',false],['Homepage placement',false],['Candidate screening questions',false],['Priority support',false]] },
  { id:'silver', name:'Silver', price:79, blurb:'More visibility, faster hires.', pop:true, feats:[['60-day listing',true],['Boosted placement in search',true],['Apply by email',true],['Featured badge',true],['Homepage placement',false],['Candidate screening questions',true],['Priority support',false]] },
  { id:'gold', name:'Gold', price:129, blurb:'Maximum reach for key roles.', feats:[['90-day listing',true],['Top placement in search',true],['Apply by email',true],['Featured badge',true],['Homepage placement',true],['Candidate screening questions',true],['Priority support',true]] },
];

function PostJob({ site }){
  const [plan,setPlan] = useState('silver');
  const [sent,setSent] = useState(false);
  const [f,setF] = useState({title:'',company:'',city:'',type:'Full-time',salLo:'',salHi:'',desc:'',email:''});
  const set=(k)=>(e)=>setF(s=>({...s,[k]:e.target.value}));
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  return (
    <div>
      <section className="section-sm" style={{background:'var(--accent-soft-2)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{textAlign:'center',maxWidth:760}}>
          <span className="eyebrow" style={{justifyContent:'center'}}>For employers</span>
          <h1 style={{fontSize:'clamp(30px,4.4vw,46px)',marginTop:12}}>Hire {site.mode==='generic'?'great people':`the right ${site.roleNoun}`}, faster.</h1>
          <p className="lede" style={{margin:'var(--s4) auto 0',maxWidth:'48ch'}}>Reach candidates who are actively looking. Post in minutes — pick a plan that fits the role.</p>
          <div className="stat-row" style={{justifyContent:'center',marginTop:'var(--s8)'}}>
            <div className="st center"><div className="n tnum">{(site.totalJobs*5).toLocaleString('en-US')}</div><div className="l">Monthly seekers</div></div>
            <div className="st center"><div className="n tnum">{site.employers.length*40+120}+</div><div className="l">Employers hiring</div></div>
            <div className="st center"><div className="n">4.2 days</div><div className="l">Median time to first apply</div></div>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="section-sm">
        <div className="wrap">
          <SectionHead center eyebrow="Pricing" title="Simple, per-listing pricing" sub="No subscriptions, no contracts. Pay per job and only when you post." />
          <div className="price-grid">
            {PLANS.map(p=>(
              <div key={p.id} className={'price-card'+(p.pop?' pop':'')+(plan===p.id?'':'')} style={plan===p.id?{borderColor:'var(--accent)',boxShadow:'var(--shadow-md)'}:undefined}>
                {p.pop && <span className="pc-badge tag accent" style={{background:'var(--accent)',color:'#fff'}}>Most popular</span>}
                <div>
                  <div className="pc-name">{p.name}</div>
                  <div style={{color:'var(--ink-3)',fontSize:14,marginTop:4}}>{p.blurb}</div>
                </div>
                <div className="pc-price tnum">{p.price===0?'Free':'$'+p.price}{p.price!==0 && <span className="per"> / post</span>}</div>
                <div className="price-feats">
                  {p.feats.map(([t,on])=>(
                    <div key={t} className={'pf'+(on?'':' off')}>
                      <span className="ck"><Icon name={on?'check':'close'} size={15} stroke={2}/></span>{t}
                    </div>
                  ))}
                </div>
                <button className={'btn btn-block '+(plan===p.id?'btn-primary':'btn-ghost')} onClick={()=>{ setPlan(p.id); const el=document.getElementById('postform'); if(el) window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - 76); }}>
                  {plan===p.id?'Selected — scroll to form':`Choose ${p.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* form */}
      <section className="section-sm bg-surface" id="postform" style={{borderTop:'1px solid var(--line)'}}>
        <div className="wrap" style={{maxWidth:760}}>
          {sent ? (
            <div className="empty" style={{borderStyle:'solid',borderColor:'var(--line)'}}>
              <span className="ei" style={{background:'var(--success-soft)',color:'var(--success)'}}><Icon name="check" size={28} stroke={2.2}/></span>
              <h3>Your job is ready to go live</h3>
              <p>We’ve saved your <strong>{PLANS.find(p=>p.id===plan).name}</strong> listing for <strong>{f.title||'your role'}</strong>. Confirm payment and it’ll be visible to seekers within minutes.</p>
              <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:'var(--s5)',flexWrap:'wrap'}}>
                <button className="btn btn-primary" onClick={()=>setSent(false)}>Post another</button>
                <a href={href(site.key,'jobs')} className="btn btn-ghost">Preview the board</a>
              </div>
            </div>
          ) : (
            <form onSubmit={e=>{
              e.preventDefault();
              window.track&&window.track('job_post_submitted',{site:site.key,plan});
              setSent(true); window.scrollTo(0,0);
            }}>
              <SectionHead eyebrow={`${PLANS.find(p=>p.id===plan).name} plan selected`} title="Post a job" sub="Fill in the details below. You can edit anything before it goes live." />
              <div style={{display:'flex',flexDirection:'column',gap:'var(--s4)'}}>
                <div className="grid-2" style={{gap:'var(--s4)'}}>
                  <div className="field"><label>Job title</label><input className="input" required placeholder={site.titles?site.titles[0]:'e.g. Account Manager'} value={f.title} onChange={set('title')}/></div>
                  <div className="field"><label>Company</label><input className="input" required placeholder="Your organization" value={f.company} onChange={set('company')}/></div>
                </div>
                <div className="grid-2" style={{gap:'var(--s4)'}}>
                  <div className="field"><label>Location</label><input className="input" required placeholder="City, state or Remote" value={f.city} onChange={set('city')}/></div>
                  <div className="field"><label>Job type</label>
                    <select className="select" value={f.type} onChange={set('type')}>{['Full-time','Part-time','Contract','Per diem'].map(t=><option key={t}>{t}</option>)}</select>
                  </div>
                </div>
                <div className="grid-2" style={{gap:'var(--s4)'}}>
                  <div className="field"><label>Salary from</label><input className="input" type="number" placeholder="e.g. 60000" value={f.salLo} onChange={set('salLo')}/></div>
                  <div className="field"><label>Salary to</label><input className="input" type="number" placeholder="e.g. 80000" value={f.salHi} onChange={set('salHi')}/></div>
                </div>
                <div className="field"><label>Job description</label><textarea className="textarea" placeholder="Describe the role, responsibilities, and requirements…" value={f.desc} onChange={set('desc')}/></div>
                <div className="field"><label>Contact email for applications</label><input className="input" type="email" required placeholder="hiring@company.com" value={f.email} onChange={set('email')}/></div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--s4)',marginTop:'var(--s6)',flexWrap:'wrap'}}>
                <div style={{color:'var(--ink-3)',fontSize:14}}>Plan: <strong style={{color:'var(--ink)'}}>{PLANS.find(p=>p.id===plan).name}</strong> · {PLANS.find(p=>p.id===plan).price===0?'Free':'$'+PLANS.find(p=>p.id===plan).price+' per post'}</div>
                <button type="submit" className="btn btn-primary btn-lg">Continue to {PLANS.find(p=>p.id===plan).price===0?'publish':'payment'} <Icon name="arrow" size={17}/></button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- Salary tool ---------- */
function SalaryTool({ site }){
  const roles = site.factors.role;
  const exps = site.factors.exp;
  const [role,setRole] = useState(roles[0]);
  const [loc,setLoc] = useState(site.cities[0].city+', '+site.cities[0].st);
  const [exp,setExp] = useState(exps[1]);
  const [calc,setCalc] = useState(true);
  useEffect(()=>{ window.scrollTo(0,0); },[]);

  const mid = (site.salary.lo + site.salary.hi)/2;
  const roleF = 0.84 + (roles.indexOf(role)/(Math.max(1,roles.length-1)))*0.46;
  const expF = [0.82,0.97,1.16,1.34][exps.indexOf(exp)] || 1;
  const bigCity = /New York|Los Angeles|Seattle|Boston|San/.test(loc) ? 1.08 : 1;
  const est = Math.round(mid*roleF*expF*bigCity/1000)*1000;
  const lo = Math.round(est*0.88/1000)*1000, hi = Math.round(est*1.14/1000)*1000;
  const rLo = Math.round(site.salary.lo/1000)*1000, rHi = Math.round(site.salary.hi*1.1/1000)*1000;
  const pct = Math.max(6, Math.min(94, ((est - rLo)/(rHi - rLo))*100));
  const related = site.jobs.filter(j=>j.title.toLowerCase().includes(role.toLowerCase().split(/[ /]+/)[0])).slice(0,3);
  const relFallback = related.length?related:site.jobs.slice(0,3);

  return (
    <div>
      <Crumbs site={site} items={[{label:'Salary tool'}]}/>
      <section style={{paddingBottom:'var(--s16)'}}>
        <div className="wrap" style={{maxWidth:920}}>
          <SectionHead eyebrow="Salary tool" title={`What ${site.mode==='generic'?'does this job':'should you'} pay?`} sub={`Estimate ${site.mode==='generic'?'salaries':site.roleNoun+' pay'} by role, location, and experience — based on current listings.`} />
          <div className="salary-grid">
            <div className="card card-pad" style={{display:'flex',flexDirection:'column',gap:'var(--s4)'}}>
              <div className="field"><label>Role</label><select className="select" value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r}>{r}</option>)}</select></div>
              <div className="field"><label>Location</label>
                <select className="select" value={loc} onChange={e=>setLoc(e.target.value)}>{site.cities.map(c=><option key={c.city+c.st}>{c.city}, {c.st}</option>)}</select>
              </div>
              <div className="field"><label>Experience</label><select className="select" value={exp} onChange={e=>setExp(e.target.value)}>{exps.map(x=><option key={x}>{x}</option>)}</select></div>
              <button className="btn btn-primary btn-lg btn-block" onClick={()=>{ window.track&&window.track('salary_estimated',{role,location:loc,exp,site:site.key}); setCalc(true); }}>Estimate salary</button>
            </div>

            <div className="salary-result">
              <div className="veil"></div>
              <div style={{position:'relative'}}>
                <div style={{color:'rgba(255,255,255,.75)',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase'}}>Estimated salary</div>
                <div className="sr-amount tnum">{fmtMoney(est)}</div>
                <div className="sr-range tnum">{fmtMoney(lo)} – {fmtMoney(hi)} per year</div>
                <div className="salary-bar"><div className="fill" style={{left:pct+'%',transition:'left .35s cubic-bezier(.2,.7,.3,1)'}}></div></div>
                <div style={{display:'flex',justifyContent:'space-between',maxWidth:460,margin:'10px auto 0',color:'rgba(255,255,255,.6)',fontSize:12.5}} className="tnum">
                  <span>{fmtMoney(Math.round(site.salary.lo/1000)*1000)}</span><span>{fmtMoney(Math.round(site.salary.hi*1.1/1000)*1000)}</span>
                </div>
                <div style={{marginTop:'var(--s6)',display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <span className="tag" style={{background:'rgba(255,255,255,.14)',color:'#fff'}}>{role}</span>
                  <span className="tag" style={{background:'rgba(255,255,255,.14)',color:'#fff'}}>{loc}</span>
                  <span className="tag" style={{background:'rgba(255,255,255,.14)',color:'#fff'}}>{exp}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop:'var(--s12)'}}>
            <SectionHead eyebrow="Now hiring" title={`${role} jobs`} action={<a href={href(site.key,'jobs')+'?role='+encodeURIComponent(role)} className="btn btn-ghost btn-sm hide-sm">See all <Icon name="arrow" size={15}/></a>}/>
            <div className="grid-3">{relFallback.map(j=><FeaturedCard key={j.id} site={site} job={j}/>)}</div>
          </div>
        </div>
      </section>
      <EmailCapture site={site} title="Get pay updates for this role" sub="We’ll email you when salaries shift and new matching jobs are posted."/>
    </div>
  );
}

/* ---------- Guide / FAQ ---------- */
function GuidePage({ site }){
  const [open,setOpen] = useState(0);
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  return (
    <div>
      <section className="section-sm" style={{background:'var(--accent-soft-2)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{maxWidth:760}}>
          <span className="eyebrow">{site.mode==='generic'?'Career advice':'Guides & resources'}</span>
          <h1 style={{fontSize:'clamp(30px,4.4vw,46px)',marginTop:12}}>{site.mode==='generic'?'Advice to move your career forward':`Everything about becoming a ${site.roleNoun}`}</h1>
          <p className="lede" style={{marginTop:'var(--s4)'}}>Clear, practical guides on training, licensing, pay, and landing the role — written for people in the field.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap">
          <SectionHead eyebrow="Guides" title="Start here" />
          <div className="grid-2">
            {site.guide.map((g,i)=>(
              <a key={i} href="#" onClick={e=>e.preventDefault()} className="guide-card" style={{flexDirection:'row',alignItems:'flex-start',gap:'var(--s4)'}}>
                <span className="mono" style={{background:'var(--accent-soft)',color:'var(--accent-ink)',width:48,height:48,flex:'none'}}><Icon name={['cap','trending','shield','doc'][i%4]} size={22}/></span>
                <div style={{flex:1}}>
                  <span className="gc-kicker">{g.kicker}</span>
                  <div className="gc-title" style={{marginTop:4}}>{g.title}</div>
                  <div className="gc-desc" style={{marginTop:6}}>{g.desc}</div>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:10,color:'var(--ink-4)',fontSize:12.5}}><Icon name="clock" size={13}/>{g.read}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-surface" style={{borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{maxWidth:820}}>
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <div>
            {site.faq.map((item,i)=>(
              <div key={i} className={'faq-item'+(open===i?' open':'')}>
                <div className="faq-q" onClick={()=>setOpen(open===i?-1:i)}>{item.q}<span className="fi-ico"><Icon name="plus" size={20}/></span></div>
                {open===i && <div className="faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailCapture site={site}/>
    </div>
  );
}

/* ---------- About + Contact ---------- */
function AboutPage({ site }){
  const [sent,setSent] = useState(false);
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  return (
    <div>
      <section className="section-sm" style={{background:'var(--accent-soft-2)',borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{maxWidth:760}}>
          <span className="eyebrow">About us</span>
          <h1 style={{fontSize:'clamp(30px,4.4vw,46px)',marginTop:12}}>An independent job board, built for one community.</h1>
          <p className="lede" style={{marginTop:'var(--s4)'}}>{site.name} exists to connect {site.mode==='generic'?'job seekers and employers across every industry':`${site.roleNoun}s with employers who value their work`} — without the noise of a general-purpose site.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap">
          <div className="stat-row" style={{justifyContent:'space-between'}}>
            {[[site.totalJobs.toLocaleString('en-US'),'Open roles right now'],[(site.totalJobs*5).toLocaleString('en-US'),'Seekers each month'],[site.employers.length*40+120+'+','Hiring employers'],['Daily','Listings refreshed']].map(([n,l])=>(
              <div className="st" key={l}><div className="n tnum">{n}</div><div className="l">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-surface" style={{borderTop:'1px solid var(--line)'}}>
        <div className="wrap">
          <div className="detail-grid">
            <div>
              <SectionHead eyebrow="Our approach" title="Trustworthy by design" />
              <div className="prose">
                <p>We focus on one thing: helping people find good work. Every employer on {site.name} is verified before their listings go live, every job shows a real salary range and posting date, and seekers never pay a cent.</p>
                <p>We don’t sell your data, we don’t bury jobs behind paywalls, and we don’t pad results with duplicates. When a role is filled, it comes down.</p>
                <h3>What you can count on</h3>
                <ul>
                  <li>Verified employers and accurate, dated listings.</li>
                  <li>Transparent salary ranges on every job.</li>
                  <li>Free for job seekers, always.</li>
                  <li>Your information is never sold to third parties.</li>
                </ul>
              </div>
            </div>
            <aside>
              <div className="card card-pad">
                <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:18}}>Contact us</div>
                <p style={{color:'var(--ink-3)',fontSize:14,marginTop:6}}>Questions, feedback, or press? We read every message.</p>
                {sent ? (
                  <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--success)',marginTop:'var(--s5)'}}><Icon name="check" size={20}/>Thanks — we’ll be in touch.</div>
                ) : (
                  <form onSubmit={e=>{e.preventDefault(); setSent(true);}} style={{display:'flex',flexDirection:'column',gap:'var(--s3)',marginTop:'var(--s5)'}}>
                    <div className="field"><label>Name</label><input className="input" required placeholder="Your name"/></div>
                    <div className="field"><label>Email</label><input className="input" type="email" required placeholder="you@email.com"/></div>
                    <div className="field"><label>Message</label><textarea className="textarea" style={{minHeight:96}} required placeholder="How can we help?"/></div>
                    <button className="btn btn-primary btn-block" type="submit">Send message</button>
                  </form>
                )}
                <div style={{marginTop:'var(--s5)',paddingTop:'var(--s5)',borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:10,color:'var(--ink-2)',fontSize:14}}>
                  <span style={{display:'flex',gap:10,alignItems:'center'}}><Icon name="mail" size={16} style={{color:'var(--accent)'}}/>hello@{site.domain}</span>
                  <span style={{display:'flex',gap:10,alignItems:'center'}}><Icon name="phone" size={16} style={{color:'var(--accent)'}}/>(800) 555-0142</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound({ site }){
  return (
    <section className="section">
      <div className="wrap">
        <div className="empty">
          <span className="ei"><Icon name="search" size={26}/></span>
          <h3>Page not found</h3>
          <p>That page doesn’t exist or has moved.</p>
          <a href={href(site.key)} className="btn btn-primary" style={{marginTop:'var(--s5)'}}>Back to home</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Coming soon (one reusable pattern for deferred features) ---------- */
const SOON = {
  signin:    { side:'seeker', icon:'user', name:'Accounts', line:'Job-seeker and employer accounts and sign-in are on the way. For now, you can browse and apply to any job — no account needed.' },
  register:  { side:'seeker', icon:'user', name:'Accounts', line:'Creating an account is coming soon. Today, you can apply to any role directly with your email and resume.' },
  profile:   { side:'seeker', icon:'users', name:'Job-seeker profiles', line:'Soon you’ll build a profile and let employers find you. For now, apply directly to any listing in seconds.' },
  saved:     { side:'seeker', icon:'bookmark', name:'Saved jobs', line:'A place to save and track the roles you love — across visits — is coming soon. For now, saved jobs last for this session.' },
  account:   { side:'seeker', icon:'user', name:'Your account', line:'A personal dashboard for your applications and alerts is coming soon. Today, set up an email alert and apply to any job.' },
  'employer-dashboard': { side:'employer', icon:'building', name:'The employer dashboard', line:'Managing all your listings, applicants, and billing in one place is coming soon. For now, posting a job takes just a few minutes.' },
  candidates:{ side:'employer', icon:'search', name:'Candidate search', line:'Searching our candidate database to reach out directly is coming soon. Today, post a role and qualified applicants come to you.' },
  manage:    { side:'employer', icon:'doc', name:'Listing management', line:'Editing, pausing, and renewing your live listings is coming soon. For now, post a new role anytime — it’s live within minutes.' },
};
function ComingSoon({ site, feature }){
  const f = SOON[feature] || { side:'seeker', icon:'sparkle', name:'This feature', line:'This part of the experience is coming soon. In the meantime, everything you need to find and apply for jobs is ready to go.' };
  const [v,setV] = useState(''); const [ok,setOk] = useState(false);
  useEffect(()=>{ window.scrollTo(0,0); },[feature]);
  const back = f.side==='employer'
    ? { to: href(site.key,'post'), label:'Post a job' }
    : { to: href(site.key,'jobs'), label:`Browse ${site.mode==='generic'?'jobs':site.roleNoun+' jobs'}` };
  return (
    <section className="section">
      <div className="wrap">
        <div className="coming-soon">
          <span className="cs-icon"><Icon name={f.icon} size={32}/></span>
          <span className="cs-kicker"><span className="edot" style={{width:7,height:7,borderRadius:'50%',background:'var(--accent)'}}></span>Coming soon</span>
          <h1>{f.name} {f.name.endsWith('s') ? 'are' : 'is'} coming soon</h1>
          <p className="cs-line">{f.line}</p>
          {ok ? (
            <div className="cs-ok"><Icon name="check" size={18}/> Thanks — we’ll let you know the moment it’s live.</div>
          ) : (
            <form className="cs-form" onSubmit={e=>{e.preventDefault(); if(v.includes('@')) setOk(true);}}>
              <input className="input" type="email" placeholder="you@email.com" value={v} onChange={e=>setV(e.target.value)} required/>
              <button className="btn btn-primary" type="submit" style={{flex:'none'}}>Notify me</button>
            </form>
          )}
          <a href={back.to} className="btn btn-ghost cs-back"><Icon name="arrow" size={16} style={{transform:'rotate(180deg)'}}/> {back.label}</a>
          <div className="cs-meta">You can keep using everything that’s live right now.</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PostJob, SalaryTool, GuidePage, AboutPage, NotFound, ComingSoon, SOON });
