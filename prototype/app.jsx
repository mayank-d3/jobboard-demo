/* ============================================================
   app.jsx — router, prototype index launcher, App shell + Tweaks
   ============================================================ */

/* ---------- accent palette (computed in JS so no color-mix is needed) ---------- */
const SITE_ACCENT = { dietitian:'#0B7D61', electrician:'#C2410C', teaching:'#4338CA', company:'#1D4ED8' };
function hexRgb(h){ h=h.replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join(''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function mix(a,b,t){ return a.map((v,i)=>Math.round(v+(b[i]-v)*t)); }
function rgbHex(r){ return '#'+r.map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join(''); }
function accentVars(hex){
  const seed = hexRgb(hex); const black=[10,15,26]; const white=[255,255,255];
  return {
    '--accent': hex,
    '--accent-ink':    rgbHex(mix(seed, black, 0.20)),
    '--accent-deep':   rgbHex(mix(seed, black, 0.52)),
    '--accent-soft':   rgbHex(mix(seed, white, 0.87)),
    '--accent-soft-2': rgbHex(mix(seed, white, 0.94)),
    '--accent-on': '#fff',
  };
}

/* ---------- hash router ---------- */
function parseHash(){
  let h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const segs = path.split('/').filter(Boolean);
  const query = {};
  if(qs) qs.split('&').forEach(p=>{ const [k,v]=p.split('='); if(k) query[k]=decodeURIComponent((v||'').replace(/\+/g,' ')); });
  return { site: segs[0]||'', page: segs[1]||'', rest: segs[2]||'', query, raw: location.hash };
}

/* ---------- prototype index launcher ---------- */
const SITE_BLURB = {
  dietitian:  'Niche healthcare board for registered dietitians. Browse-first — location and specialty lead, no big search bar.',
  electrician:'Niche skilled-trades board for electricians. Browse-first by city and license level.',
  teaching:   'Niche education board for teachers and school staff. Browse-first by district and subject.',
  company:    'Generic national board across every industry. Search-first with a category grid up front.',
};
function Launcher(){
  const order = ['dietitian','electrician','teaching','company'];
  return (
    <div className="launcher">
      <div className="launcher-inner">
        <div className="reveal">
          <span className="lx-eyebrow"><span className="edot"></span>Prototype · one template, four configurations</span>
          <h1>One job-board template,<br/>configured four ways.</h1>
          <p className="lx-sub">Same layout, type, and component system across all four — only the brand, accent color, copy, and listings change. Pick a site to explore. Niche sites lead with browsing; the generic site leads with search.</p>
        </div>
        <div className="launcher-grid">
          {order.map((k)=>{
            const s = SITES[k];
            const chips = s.mode==='generic' ? s.categories.slice(0,3).map(c=>c.name) : s.roles.slice(0,3).map(r=>r.name);
            return (
              <a key={k} href={href(k)} data-site={k} className="site-card reveal" style={accentVars(SITE_ACCENT[k])}>
                <div className="sc-top">
                  <span className="mono" style={{background:'var(--accent)',width:46,height:46,borderRadius:13}}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" aria-hidden="true">
                      <rect x="3.5" y="13" width="4" height="7.5" rx="1.4"></rect>
                      <rect x="10" y="8" width="4" height="12.5" rx="1.4"></rect>
                      <rect x="16.5" y="3.5" width="4" height="17" rx="1.4"></rect>
                    </svg>
                  </span>
                  <div className="sc-id">
                    <div className="sc-name">{s.name}</div>
                    <div className="sc-domain">{s.domain}</div>
                  </div>
                </div>
                <p className="sc-desc">{SITE_BLURB[k]}</p>
                <div className="sc-prev">{chips.map(c=><span key={c} className="pchip">{c}</span>)}</div>
                <div className="sc-foot">
                  <span className="sc-mode">{s.mode==='generic'?'Search-first':'Browse-first'}</span>
                  <span className="sc-go">Open site <Icon name="arrow" size={15}/></span>
                </div>
              </a>
            );
          })}
        </div>
        <div className="lx-note reveal">
          <span className="ni"><Icon name="shield" size={15}/> Routes like <code>#/electrician/jobs</code> select the site — no demo chrome inside the app.</span>
          <span className="ni"><Icon name="sparkle" size={15}/> Switch sites &amp; theme anytime from the Tweaks panel.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- page router for a site ---------- */
function SitePages({ route, modeOverride }){
  const site = SITES[route.site];
  const { page, rest, query } = route;
  if(page==='' ) return <Home site={site} modeOverride={modeOverride}/>;
  if(page==='jobs') return rest ? <JobDetail site={site} id={rest}/> : <Browse site={site} query={query}/>;
  if(page==='employers') return <EmployerDirectory site={site}/>;
  if(page==='employer') return <EmployerProfile site={site} id={rest}/>;
  if(page==='post') return <PostJob site={site}/>;
  if(page==='salary') return <SalaryTool site={site}/>;
  if(page==='guide') return <GuidePage site={site}/>;
  if(page==='about') return <AboutPage site={site}/>;
  if(page==='soon') return <ComingSoon site={site} feature={rest}/>;
  return <NotFound site={site}/>;
}
function navPageOf(page){
  if(page==='employer') return 'employers';
  return page;
}

/* ---------- tweaks ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "site": "auto",
  "matchSiteAccent": true,
  "accent": "#1D4ED8",
  "homeMode": "auto",
  "density": "regular",
  "radius": "soft",
  "headFont": "Bricolage Grotesque"
}/*EDITMODE-END*/;

const DENSITY = { compact:0.86, regular:1, comfortable:1.14 };
const RADIUS = { sharp:0.28, rounded:0.7, soft:1.05 };

function App(){
  const [route,setRoute] = useState(parseHash());
  const [t,setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [liveVer,setLiveVer] = useState(0); // bump to re-render after live/snapshot jobs load

  useEffect(()=>{
    const h = ()=> setRoute(parseHash());
    window.addEventListener('hashchange', h);
    return ()=> window.removeEventListener('hashchange', h);
  },[]);

  // tweak: jump to a site
  useEffect(()=>{
    if(t.site && t.site!=='auto' && SITES[t.site] && route.site!==t.site){
      navigate(href(t.site));
    }
  },[t.site]);

  useEffect(()=>{ document.title = route.site && SITES[route.site] ? SITES[route.site].name : 'Job Board — Template Prototype'; },[route.site, route.page]);

  // Load real jobs for the current site (Tier A: static snapshot; Phase 2: swap URL to '/api/jobs?site=' + route.site).
  useEffect(()=>{
    if(!route.site || !SITES[route.site]) return;
    let cancelled = false;
    fetch('./jobs-' + route.site + '.json')
      .then(r=> r.ok ? r.json() : null)
      .then(d=>{ const jobs = (d && d.jobs) || d; if(!cancelled && jobs && jobs.length){ window.applyLiveJobs(route.site, jobs); setLiveVer(v=>v+1); } })
      .catch(()=>{}); // keep mock fallback on any failure
    return ()=>{ cancelled = true; };
  },[route.site]);


  const onSite = !!route.site && !!SITES[route.site];
  const site = onSite ? SITES[route.site] : null;

  // active accent: tweak override (when not matching site) or the site's own seed
  const activeAccent = (onSite && !t.matchSiteAccent && t.accent) ? t.accent : (onSite ? SITE_ACCENT[route.site] : SITE_ACCENT.company);
  // root style overrides from tweaks
  const rootStyle = {
    '--d': DENSITY[t.density] ?? 1,
    '--r': RADIUS[t.radius] ?? 1,
    '--font-head': `'${t.headFont}', system-ui, sans-serif`,
    ...accentVars(activeAccent),
  };

  const panel = (
    <TweaksPanel>
      <TweakSection label="Prototype" />
      <TweakSelect label="Example site" value={onSite?route.site:'auto'} options={['auto','dietitian','electrician','teaching','company']}
        onChange={(v)=>{ setTweak('site', v); if(v==='auto') navigate('#/'); else navigate(href(v)); }} />
      {onSite && site.mode!=='generic' && (
        <TweakRadio label="Home layout" value={t.homeMode} options={['auto','niche','generic']}
          onChange={(v)=>setTweak('homeMode', v)} />
      )}
      <TweakSection label="Theme" />
      <TweakToggle label="Match each site's accent" value={t.matchSiteAccent} onChange={(v)=>setTweak('matchSiteAccent', v)} />
      {!t.matchSiteAccent && (
        <TweakColor label="Accent" value={t.accent}
          options={['#1D4ED8','#0E8A6E','#C2410C','#4338CA','#0F766E','#9333EA','#B91C1C','#334155']}
          onChange={(v)=>setTweak('accent', v)} />
      )}
      <TweakSelect label="Heading font" value={t.headFont}
        options={['Bricolage Grotesque','Manrope','Hanken Grotesk','Newsreader']}
        onChange={(v)=>setTweak('headFont', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density} options={['compact','regular','comfortable']} onChange={(v)=>setTweak('density', v)} />
      <TweakRadio label="Corners" value={t.radius} options={['sharp','rounded','soft']} onChange={(v)=>setTweak('radius', v)} />
    </TweaksPanel>
  );

  if(!onSite){
    return <div style={rootStyle}>{<Launcher/>}{panel}</div>;
  }

  const modeOverride = (site.mode!=='generic' && t.homeMode!=='auto') ? t.homeMode : null;

  return (
    <div data-site={route.site} style={rootStyle}>
      <Header site={site} page={navPageOf(route.page)} />
      <main key={route.raw}>
        <SitePages route={route} modeOverride={modeOverride} />
      </main>
      <Footer site={site} />
      {panel}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
