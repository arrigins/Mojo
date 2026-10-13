import json,re,os
# images are served as files from ../assets (no base64)
A={os.path.splitext(f)[0]:"assets/"+f for f in sorted(os.listdir("../assets"))}; I=json.load(open("icons.json")); t=open("template2.html").read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(t.count(a),a[:70]); t=t.replace(a,b)
def rex(p,b):
    global t
    cut=t.index("<script>") if p.startswith("/") else 0
    tail,k=re.subn(p,lambda m:b,t[cut:],count=1,flags=re.S); assert k==1,p[:60]
    t=t[:cut]+tail
TR='<span class="trial">%%i:gift%%One month of free access after the demo</span>'
t=t.replace('<span class="video__copy">','<div class="video__copy">').replace('</p></span>\n      <span class="video__label">','</p></div>\n      <span class="video__label">')
rex(r'<nav class="nav" aria-label="Main">.*?</nav>','<nav class="nav" aria-label="Main"><a href="#product">Product overview</a><a href="#ai">Mojo AI</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="#blog">Blog</a></nav>')
rep('<a href="#top" class="logo"','<a href="#home" class="logo"')
rep('Watch a video</a>\n        </div>','Watch a video</a>\n        </div>\n        '+TR)
rep('<section class="band band--flush" id="product">','<section class="band band--flush">')
rep('<section class="band band--flush" id="pricing">','<section class="band band--flush">')
rep('<section class="band band--flush" id="blog">','<section class="band band--flush">')
rep('href="https://mojo.education/modules/">All features','href="#product">All 43 modules')
rep('href="https://mojo.education/blog/">All articles','href="#blog">All articles')
rep('One yearly fee and a one-time installation payment.','One yearly fee and a one-time setup fee.')
rep('<a class="btn btn--primary" href="#demo">Get an offer</a>','<div class="hero__cta"><a class="btn btn--primary" href="#demo">Get an offer</a><a class="btn btn--ghost" href="#pricing">Build your plan</a></div>')
rex(r'<div class="posts">.*?</div>\n    <div class="posts__all">','<div class="posts" id="homePosts"></div>\n    <div class="posts__all">')
rex(r'<div><h4>Product</h4><ul>.*?</ul></div>','<div><h4>Product</h4><ul><li><a href="#product">Product overview</a></li><li><a href="#ai">Mojo AI</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#faq">FAQ</a></li><li><a href="#blog">Blog</a></li></ul></div>')
rep('show the platform’s features in action.</p>\n    </div>','show the platform’s features in action.</p>\n      '+TR+'\n    </div>')
m=re.search(r'  <section class="close" id="demo">.*?</section>\n',t,re.S); close=m.group(0); t=t.replace(close,'')
rep('<main>','<main data-page="home">')
rep('</main>','</main>\n'+open("pages.html").read()+'\n<div class="wrap" id="quickWrap">\n'+close.replace('id="demo"','id="quick"')+'</div>')
# scripts
rep('  function swap(els,fn){','  var MJ=window.MJ={svg:svg,tabs:tabs,$:$,IMG:IMG,reduce:reduce};\n  function swap(els,fn){')
rex(r'/\* modules \*/.*?/\* pricing \*/','''/* modules */
  var M="https://mojo.education/modules/",groups=window.MJD.groups;
  var v=function(c){return c.charAt(0)==="-"?"var("+c+")":c};
  MJ.modCard=function(g,m){var inner=m[3]==="#ai";return '<a class="mod" style="--tint:'+v(g[1])+';--tone:'+v(g[2])+'" href="'+(inner?"#ai":M+(m[3]||""))+'"><span class="mod__ic">'+svg(m[2])+'</span><span class="mod__go">'+svg(inner?"arrow-right":"arrow-up-right")+'</span><b>'+m[0]+'</b><small>'+m[1]+'</small></a>'};
  var q=function(s){var e=document.querySelector(s);return e?e.src:""};
  var FEAT=[["Educational Analytics","See where every class and subject stands, without building a report by hand.",function(){return IMG.ui_director},M+"educational-analytics/"],["Mojo Points","Recognition for effort and behaviour, with statistics for the whole year.",function(){return q(".app__devices")},"#product"],["Wellbeing check-ins","Form tutors record health, mood and activity for each student from their phone.",function(){return q('img[alt="Mojo mobile app: Wellbeing"]')},"#product"],["News","School and class news reach every family in the app.",function(){return IMG.ui_parent},"#product"],["Academic Management","Departments, subjects and workloads set up the way your school runs.",function(){return IMG.ui_head},"#product"]];
  tabs($("modTabs"),groups.map(function(g){return g[0]+"<span>"+g[4].length+"</span>"}),function(i){var g=groups[i],f=FEAT[i];
    $("modGrid").innerHTML='<a class="mod mod--feat" style="--tint:'+v(g[1])+';--tone:'+v(g[2])+'" href="'+f[3]+'"><span class="mod__shot"><img src="'+f[2]()+'" alt=""></span><b>'+f[0]+'</b><small>'+f[1]+'</small><span class="post__go">Learn more '+svg("arrow-right")+'</span></a>'+g[4].map(function(m){return MJ.modCard(g,m)}).join("")},"aria-selected");

  /* pricing */''')
rex(r'/\* pricing \*/.*?/\* testimonials \*/','''/* pricing */
  var P=window.MJD.price,fmt=function(n){return n.toLocaleString("en-US")};
  tabs($("sizes"),P.tiers.map(function(t){return t.n}),function(i){var t=P.tiers[i];
    if(t.p){$("pAmount").innerHTML="€"+fmt(t.p)+"<small>per year</small>";
      $("pFacts").innerHTML="<span><b>€"+fmt(Math.round(t.p*.9))+"</b> if paid once a year (10% off)</span><span><b>€"+t.f+"</b> one-time setup fee</span><span><b>"+t.g+" GB</b> of storage</span>";}
    else{$("pAmount").innerHTML="Custom pricing";$("pFacts").innerHTML="<span>For large schools and school groups. We prepare an offer for your structure.</span>";}
    $("pIncl").innerHTML=P.mods.map(function(m,j){var on=j<t.inc;return '<li class="'+(on?"":"off")+'">'+svg(on?"check":"minus")+"<span>"+m+"</span>"+(on?"":"<small>or add for €150 a year</small>")+"</li>"}).join("");
  },"aria-pressed");

  /* testimonials */''')
rex(r'/\* third blog cover.*?/\* form \(concept only\) \*/','/* form (concept only) */')
rex(r'/\* hero personas.*?/\* logo marquee','''/* hero personas: rotate continuously; a click jumps to a role and the cycle carries on */
  var people=[["head","Head of school","I manage all processes from a single interface.","List of departments"],["director","Academic director","With analytics, I know our strengths and weaknesses.","Student performance by subject"],["teacher","Teacher","I like having all the information in one place.","Lesson information"],["student","Student","I always know my timetable and homework.","Assessment in Literature"],["parent","Parent","Modern school, modern app.","School news"]];
  var cur=0,first=true,timer=0,who=document.querySelector(".persona__who"),rt=$("roleTabs"),pickRole;
  function plan(ms){clearTimeout(timer);if(reduce)return;rt.style.setProperty("--dwell",ms+"ms");rt.classList.remove("run");void rt.offsetWidth;rt.classList.add("run");
    timer=setTimeout(function(){if(document.hidden||$("stage").offsetParent===null){plan(1500);return}pickRole((cur+1)%people.length,false)},ms)}
  pickRole=tabs(rt,people.map(function(p){return p[1]}),function(i,byUser){cur=i;var p=people[i];
    var set=function(){$("pImg").src=IMG["por_"+p[0]];$("pRole").textContent=p[1];$("pQuote").textContent=p[2];$("pUi").src=IMG["ui_"+p[0]];$("pUi").alt="Mojo screen: "+p[3]};
    if(first){first=false;set()}else swap([who,$("pUi")],set);
    plan(byUser?7000:3800);
  },"aria-selected");

  /* logo marquee''')
rex(r'/\* role cards \*/.*?/\* modules \*/','''/* role cards: columns resize, text keeps its width and cross-fades */
  var rbox=$("rolesBox"),roles=[].slice.call(document.querySelectorAll(".role")),rtm=0;
  function sizeRoles(){rbox.style.setProperty("--openw",Math.max(260,Math.round((rbox.clientWidth-40)*2.2/4.2-56))+"px")}
  function openRole(el){var k=roles.indexOf(el);roles.forEach(function(r){r.classList.toggle("on",r===el)});rbox.style.setProperty("--cols",roles.map(function(r,j){return j===k?"2.2fr":"1fr"}).join(" "))}
  roles.forEach(function(r){r.addEventListener("mouseenter",function(){clearTimeout(rtm);rtm=setTimeout(function(){openRole(r)},110)});r.addEventListener("mouseleave",function(){clearTimeout(rtm)});
    ["focus","click"].forEach(function(e){r.addEventListener(e,function(){clearTimeout(rtm);openRole(r)})})});
  addEventListener("resize",sizeRoles);sizeRoles();

  /* modules */''')
rex(r'<div class="wrap trust__head">.*?</div>\n  <div class="marq"','''<div class="wrap trust__head">
    <div class="trust__copy"><h2 id="trustH">Schools that trust Mojo</h2><p class="lead">We work with schools following various educational standards (British, Cambridge, IB and local) and help them reach new heights with the expertise of market leaders.</p></div>
    <ul class="stats"><li><b>50,000+</b>users rely on Mojo every day</li><li><b>11</b>countries</li><li><b>24</b>schools shown below</li></ul>
  </div>
  <div class="marq"''')
import os
def BRAND(n):
    s=open("brand-icons/"+n+".svg").read(); d=re.search(r'<path d="([^"]+)"',s).group(1)
    return '<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="'+d+'"/></svg>'
assert t.count('%%i:apple%%')==2 and t.count('%%i:play%%<span><small>Get it on')==2
t=t.replace('%%i:apple%%',BRAND("apple")).replace('%%i:play%%<span><small>Get it on',BRAND("googleplay")+'<span><small>Get it on')
rep('<script>\n(function(){','<script>\n'+open("data.js").read()+'\n</script>\n<script>\n(function(){')
t=t.rstrip()+'\n<script>\n'+open("ojo.js").read()+'</script>\n<script>\n'+open("extra.js").read()+'</script>\n'
rep('</style>',open("extra.css").read()+'</style>')
names=["Heritage School","Unischool Cambridge International School","TISA","Adriatic International","The Russian School of Abu Dhabi","Oxbridge International School","One! International School","The Knowledge Academy","New Tone School","Intellectum Academy","Kinderville","Discovery","Rittel School","Edumonte","La Berezka","School logo","Nyberg School","Gymnasium Lider","School logo","Snegiri","Setun","Sverkhnovaya","Astreya","Schastlivoe Detstvo"]
li=[f'<li title="{n}"><img src="{A["sl%d"%i]}" alt="{n}"></li>' for i,n in enumerate(names)]
t=t.replace("%%logos_a%%","".join(li[0::2])).replace("%%logos_b%%","".join(li[1::2]))
t=t.replace("%%icons%%",json.dumps(I)).replace("%%imgs%%",json.dumps({k:v for k,v in A.items() if k[:3] in("por","ui_","ph_")}))
def ic(m):
    n=m.group(1); assert n in I,n
    return f'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{I[n]}</svg>'
t=re.sub(r"%%i:([\w-]+)%%",ic,t); t=re.sub(r"%%(\w+)%%",lambda m:A[m.group(1)],t)
used=set(re.findall(r'"([a-z][a-z-]+)"\]',open("data.js").read()))|set(re.findall(r'","([a-z-]+)"(?:,"[^"]*")?\]',open("data.js").read()))
miss=[u for u in used if u not in I and "-" in u or (u in("clock","users","eye","bot","award","flag","bell","link","school","folder")and u not in I)]
print("missing icons:",miss)
HEAD='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="description" content="Redesign concept of the Mojo school management system website, made for a design portfolio. Not the official Mojo website."><style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
open("../index.html","w").write(HEAD+t+'</body></html>')
print(len(t)//1024,"KB")
