(function(){
  var MJ=window.MJ,D=window.MJD,$=MJ.$,svg=MJ.svg,tabs=MJ.tabs,reduce=MJ.reduce;
  var eur=function(n){return "€"+Math.round(n).toLocaleString("en-US")};

  /* ---------- router: one file, six pages ---------- */
  var mains=[].slice.call(document.querySelectorAll("main[data-page]")),pages=mains.map(function(m){return m.dataset.page});
  function show(p,keepScroll){
    mains.forEach(function(m){m.hidden=m.dataset.page!==p});
    [].forEach.call(document.querySelectorAll(".nav a"),function(a){var h=a.getAttribute("href");if(h==="#"+p||(p==="article"&&h==="#blog"))a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    $("quickWrap").hidden=p==="demo";
    if(!keepScroll)scrollTo(0,0);
    dispatchEvent(new Event("scroll"));
  }
  function route(tok,push){
    tok=tok||"home";
    if(pages.indexOf(tok)>=0){show(tok);if(push){try{history.pushState(null,"","#"+tok)}catch(e){}}return}
    var el=document.getElementById(tok);if(!el)return;
    var m=el.closest("main");if(m&&m.hidden)show(m.dataset.page,true);
    el.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
  }
  document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();route(a.getAttribute("href").slice(1),true)});
  addEventListener("popstate",function(){route(location.hash.slice(1))});

  /* highlight the section in view */
  function spy(nav){var links=[].slice.call(nav.querySelectorAll('a[href^="#"]')),els=links.map(function(a){return document.getElementById(a.getAttribute("href").slice(1))});
    function upd(){if(!nav.offsetParent)return;var y=innerHeight*.4,best=0;els.forEach(function(el,i){if(el&&el.getBoundingClientRect().top<y)best=i});links.forEach(function(a,i){a.classList.toggle("on",i===best)})}
    addEventListener("scroll",upd,{passive:true});upd()}

  /* ---------- product ---------- */
  $("prodNav").innerHTML=D.groups.map(function(g,i){return '<a href="#p-'+i+'">'+g[0]+"<span>"+g[4].length+"</span></a>"}).join("");
  $("prodSecs").innerHTML=D.groups.map(function(g,i){return '<section class="msec" id="p-'+i+'"><h2>'+g[0]+'</h2><p class="lead">'+g[3]+'</p><div class="grid">'+g[4].map(function(m){return MJ.modCard(g,m)}).join("")+"</div></section>"}).join("");
  spy($("prodNav"));spy($("aiToc"));

  /* ---------- pricing ---------- */
  var P=D.price,st={t:0,pay:0,add:{}};
  function addons(t){var a=P.mods.slice(1).map(function(m,j){return {k:"m"+j,n:m,inc:j+1<t.inc,p:150}});
    a.push({k:"fin",n:"Finance",p:t.fin},{k:"tb",n:"Timetable Builder",p:t.tb},{k:"gb",n:"Additional 50 GB of storage",p:50});return a}
  function draw(){
    var t=P.tiers[st.t],base=t.p?(st.pay===0?Math.round(t.p*.9):t.p):0,A=addons(t),sum=0,picked=[];
    $("prAdd").innerHTML='<li><label class="addon inc" for="ad-core"><input type="checkbox" id="ad-core" checked disabled><span>'+P.mods[0]+"</span><b>Included</b></label></li>"+A.map(function(a){var on=a.inc||!!st.add[a.k];if(!a.inc&&on){sum+=a.p;picked.push(a)}
      return '<li><label class="addon'+(a.inc?" inc":"")+'" for="ad-'+a.k+'"><input type="checkbox" id="ad-'+a.k+'" data-k="'+a.k+'"'+(on?" checked":"")+(a.inc?" disabled":"")+"><span>"+a.n+"</span><b>"+(a.inc?"Included":"+"+eur(a.p)+" a year")+"</b></label></li>"}).join("");
    var rows="",head;
    if(t.p){
      head='<div class="amount">'+eur(base+sum)+"<small>per year</small></div>";
      rows+="<div><span>"+t.n+" students</span><b>"+eur(base)+"</b></div>";
      if(st.pay===0)rows+="<div><span>Paid once a year, 10% off "+eur(t.p)+"</span><b>−"+eur(t.p-base)+"</b></div>";
      else rows+="<div><span>"+(st.pay+1)+" payments of</span><b>"+eur((base+sum)/(st.pay+1))+"</b></div>";
      picked.forEach(function(a){rows+="<div><span>"+a.n+"</span><b>+"+eur(a.p)+"</b></div>"});
      rows+="<div><span>One-time setup fee</span><b>"+eur(t.f)+"</b></div><div><span>Storage</span><b>"+(t.g+(st.add.gb?50:0))+" GB</b></div><div><span>Per student a year, at "+t.s+" students</span><b>€"+((base+sum)/t.s).toFixed(2)+"</b></div>";
    }else{
      head='<div class="amount" style="font-size:clamp(34px,4vw,48px)">Custom pricing</div>';
      rows+="<div><span>More than 750 students</span><b>On request</b></div>";
      picked.forEach(function(a){rows+="<div><span>"+a.n+"</span><b>+"+eur(a.p)+"</b></div>"});
      rows+="<div><span>Storage</span><b>On request</b></div>";
    }
    $("prSum").innerHTML=head+'<div class="sumrows">'+rows+'</div><a class="btn" href="#demo">Get an offer</a><span class="trial">'+svg("gift")+"One month of free access after the demo</span>";
    [].forEach.call($("prTable").querySelectorAll("[data-c]"),function(c){c.classList.toggle("csel",+c.dataset.c===st.t)});
  }
  $("prAdd").addEventListener("change",function(e){var k=e.target.dataset.k;if(k){st.add[k]=e.target.checked;draw()}});
  (function(){var T=P.tiers,ok=svg("check"),h='<thead><tr><th scope="col">Students</th>'+T.map(function(t,i){return '<th scope="col" data-c="'+i+'">'+t.n+"</th>"}).join("")+"</tr></thead><tbody>";
    function row(name,sub,fn){h+='<tr><th scope="row">'+name+(sub?"<small>"+sub+"</small>":"")+"</th>"+T.map(function(t,i){var v=fn(t,i);return '<td data-c="'+i+'"'+(v===ok?"":' class="pay"')+">"+v+"</td>"}).join("")+"</tr>"}
    row("Price per year","before the 10% discount for one payment",function(t){return t.p?"<b style='color:var(--ink)'>"+eur(t.p)+"</b>":"Custom"});
    row("One-time setup fee","",function(t){return t.f?eur(t.f):"Custom"});
    P.mods.forEach(function(m,j){row(m,"",function(t){return j<t.inc?ok:eur(150)})});
    row("Finance","",function(t){return eur(t.fin)});row("Timetable Builder","",function(t){return eur(t.tb)});
    row("Available storage","",function(t){return t.g?t.g+" GB":"On request"});row("Additional 50 GB of storage","",function(){return eur(50)});
    $("prTable").innerHTML=h+"</tbody>"})();
  $("prCore").innerHTML=P.core.map(function(g){return "<li><h3>"+g[0]+"</h3><ul>"+g[1].map(function(x){return "<li>"+svg("check")+"<span>"+x+"</span></li>"}).join("")+"</ul></li>"}).join("");
  tabs($("prSizes"),P.tiers.map(function(t){return t.n}),function(i){st.t=i;draw()},"aria-pressed");
  tabs($("prPay"),["Once a year<em>−10%</em>","Twice a year","Three times a year"],function(i){st.pay=i;draw()},"aria-pressed");

  /* ---------- faq ---------- */
  [].forEach.call(document.querySelectorAll("[data-faq]"),function(box,n){box.innerHTML=D.faq[box.dataset.faq].map(function(q,i){return "<details"+(i===0&&n<2?" open":"")+"><summary>"+q[0]+'</summary><div class="a">'+q[1]+"</div></details>"}).join("")});

  /* ---------- blog ---------- */
  function cover(cat,k){
    var C=[["#dcefeb","#23766a","orig"],["#ece6fb","#6a55d6","bolt"],["#f2ede8","#a9795a","cap"],["#e5ebfd","#3a78d4","crown"]][cat],v=k%3,r=function(n){k=(k*9301+49297)%233280;return k/233280*n};
    var s='<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="'+C[0]+'"/><circle cx="'+(70+r(260))+'" cy="'+(30+r(60))+'" r="'+(90+r(40))+'" fill="#fff" opacity=".4"/>';
    if(v===0)s+=OJ.g({top:C[2]},200,150,1.02,C[1]);
    else if(v===1)s+=OJ.g({top:"none",nose:0},200,96,1.7,C[1]);
    else s+='<rect x="40" y="150" width="190" height="130" rx="18" fill="#fff"/><rect x="62" y="176" width="96" height="10" rx="5" fill="#1c2927"/><rect x="62" y="198" width="140" height="8" rx="4" fill="#dfe6e3"/><rect x="62" y="216" width="110" height="8" rx="4" fill="#dfe6e3"/>'+OJ.g({top:C[2],eyes:r(2)>1?"wow":"open"},280,150,.86,C[1]);
    return s+"</svg>"}
  var B="https://mojo.education/blog/",link=function(p){return p[5].charAt(0)==="#"?p[5]:B+p[5]};
  function card(p,i){return '<a class="post" href="'+link(p)+'"><div class="post__cover">'+cover(p[3],i*37+11)+'</div><div class="meta"><span class="tag">'+D.cats[p[3]]+'</span><time datetime="'+p[1]+'">'+p[2]+"</time></div><h3>"+p[0]+"</h3><p>"+p[4]+'</p><span class="post__go">Read the article '+svg("arrow-right")+"</span></a>"}
  MJ.card=card;
  var hp=$("homePosts");if(hp)hp.innerHTML=D.posts.slice(0,3).map(card).join("");
  var counts=D.cats.map(function(c,i){return D.posts.filter(function(p){return p[3]===i}).length});
  tabs($("blogPills"),["All<span>"+D.posts.length+"</span>"].concat(D.cats.map(function(c,i){return c+"<span>"+counts[i]+"</span>"})),function(i){
    var f=D.posts[0],list=D.posts.map(function(p,k){return [p,k]}).filter(function(x){return i===0?x[1]>0:x[0][3]===i-1});
    $("blogFeature").innerHTML=i===0?'<a class="feature" href="'+link(f)+'"><div class="post__cover">'+cover(f[3],11)+'</div><div class="feature__copy"><div class="meta"><span class="tag">'+D.cats[f[3]]+'</span><time datetime="'+f[1]+'">'+f[2]+"</time></div><h2>"+f[0]+"</h2><p>"+f[4]+'</p><span class="post__go">Read the article '+svg("arrow-right")+"</span></div></a>":"";
    $("blogGrid").innerHTML=list.map(function(x){return card(x[0],x[1])}).join("");
  },"aria-pressed");

  $("artMore").innerHTML=D.posts.slice(1,4).map(function(p,i){return card(p,i+1)}).join("");spy($("artNav"));
  $("dmPhoto").src=MJ.IMG.ph_ruslan;
  $("demoForm2").addEventListener("submit",function(e){e.preventDefault();var ok=$("formOk2");ok.hidden=false;
    ok.textContent=!e.target.checkValidity()?"Please fill in your name, phone, email and organization, and confirm the agreement.":"This is where the confirmation appears. In this concept nothing is sent."});
  /* ---------- the logo character across the site ---------- */
  var O=OJ.ojo;
  [].forEach.call(document.querySelectorAll("#roleTabs button"),function(b,i){var k=["lion","owl","cat","rabbit","hare"][i];b.insertAdjacentHTML("afterbegin",'<i class="chipav" style="background:'+OJ.FAM[k]+'">'+O({top:k,fix:1})+"</i>")});
  [].forEach.call(document.querySelectorAll(".msec"),function(s,i){var g=D.groups[i],c=g[2].charAt(0)==="-"?"var("+g[2]+")":g[2];s.querySelector("h2").insertAdjacentHTML("afterbegin",'<span class="secface" style="color:'+c+'">'+O({top:["cap","crown","heart","signal","check"][i]})+"</span>")});
  var rt=document.querySelector(".ra__top");if(rt){rt.querySelector("svg").remove();rt.insertAdjacentHTML("afterbegin",'<span class="aiface">'+O({top:"bolt"})+"</span>")}
  [].forEach.call(document.querySelectorAll(".ask"),function(a){a.insertAdjacentHTML("afterbegin",'<span class="ask__peek">'+O({})+"</span>")});
  document.querySelector("footer .wrap").insertAdjacentHTML("afterbegin",'<div class="foot__eyes"><p>Eyes on what matters.</p><div>'+O({top:"none",nose:0,vb:"40 106 220 88"})+"</div></div>");
  [["demoForm","formOk"],["demoForm2","formOk2"]].forEach(function(f){$(f[0]).addEventListener("submit",function(e){var ok=$(f[1]),good=e.target.checkValidity();
    ok.className=ok.className.replace(/ ?is-\w+/g,"")+(good?" is-ok":" is-warn");ok.innerHTML='<span class="okface">'+O(good?{top:"check",eyes:"happy",fix:1}:{eyes:"lid",look:[0,1],fix:1})+"</span><span>"+ok.textContent+"</span>"})});
  route(location.hash.slice(1));
})();
