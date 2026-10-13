window.OJ=(function(){
  var TOP={
    orig:"M78,116 C80,88 100,60 121,58 C140,56 136,78 134,88 C131,104 148,104 152,88 C156,70 160,52 177,52 C190,52 196,78 215,116",
    bolt:"M78,116 L96,56 L124,96 L150,46 L176,96 L204,56 L215,116",
    heart:"M78,116 C86,104 120,108 150,104 C120,80 118,48 138,48 C148,48 150,58 150,64 C150,58 152,48 162,48 C182,48 180,80 150,104 C180,108 208,104 215,116",
    cap:"M78,116 V94 H222 V116 M96,74 L150,54 L204,74 L150,94 Z M204,74 V100",
    crown:"M78,116 L70,60 L110,90 L150,46 L190,90 L230,60 L222,116",
    signal:"M78,116 C78,90 110,84 150,84 C190,84 215,90 215,116 M150,84 V56",
    check:"M78,116 L96,82 L130,104 L204,44 L215,116",
    wave:"M78,116 C84,56 112,56 124,82 C136,106 164,106 176,82 C188,56 212,56 215,116",
    none:"",
    rabbit:"M78,116 C70,70 84,28 100,30 C116,32 118,84 124,100 C130,114 170,114 176,100 C182,84 184,32 200,30 C216,28 230,70 222,116",
    hare:"M78,116 C70,70 84,28 100,30 C116,32 118,84 124,100 C130,114 170,114 176,100 C180,84 182,44 200,44 C218,44 240,56 250,74 C232,66 218,70 214,84 C216,96 220,106 222,116",
    cat:"M70,120 L80,60 L116,96 Q150,84 184,96 L220,60 L230,120",
    lion:"M62,128 C40,100 60,78 80,84 C78,58 108,48 122,66 C134,44 166,44 178,66 C192,48 222,58 220,84 C240,78 260,100 238,128",
    owl:"M60,126 L64,66 L110,104 L150,120 L190,104 L236,66 L240,126"
  };
  var FAM={lion:"#b98658",cat:"#e3975f",rabbit:"#8f6ad8",hare:"#3ba995",owl:"#3a78d4"};
  function eye(x,y,k){
    if(k==="happy")return '<path d="M'+(x-30)+','+(y+8)+' A30,30 0 0 1 '+(x+30)+','+(y+8)+'"/>';
    var r='<circle cx="'+x+'" cy="'+y+'" r="30"/>';
    if(k==="wow")return r+'<circle class="fill" cx="'+x+'" cy="'+y+'" r="4.5"/>';
    if(k==="lid")return r+'<g class="pg"><circle class="fill pupil" cx="'+x+'" cy="'+y+'" r="6.6"/></g><path class="thin" d="M'+(x-21)+','+(y-8)+' H'+(x+21)+'"/>';
    return r+'<g class="pg"><circle class="fill pupil" cx="'+x+'" cy="'+y+'" r="6.6"/></g>';
  }
  function inner(o){var e=o.eyes||"open",top=TOP[o.top||"orig"],s="";
    if(top)s+='<path d="'+top+'"/>';
    if(o.top==="signal")s+='<circle class="fill" cx="150" cy="46" r="8"/><path class="thin" d="M126,40 C130,24 170,24 174,40"/>';
    s+=eye(84,150,e)+eye(216,150,e);
    if(o.nose!==0)s+='<path d="M153,143 V178 C153,198 132,204 119,193"/>';
    return s}
  function look(o){var l=o.look||[.51,.86];return "--dx:"+l[0]+";--dy:"+l[1]}
  function ojo(o){o=o||{};return '<svg class="oj ojo'+(o.fix?"":" track")+'" viewBox="'+(o.vb||"14 20 272 196")+'" style="'+look(o)+'" aria-hidden="true">'+inner(o)+"</svg>"}
  function g(o,cx,cy,s,col){o=o||{};return '<g class="oj'+(o.fix?"":" track")+'" style="color:'+col+";"+look(o)+'" transform="translate('+(cx-150*s)+","+(cy-118*s)+") scale("+s+')">'+inner(o)+"</g>"}
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    var raf=0,px=0,py=0;
    addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(function(){raf=0;
      [].forEach.call(document.querySelectorAll(".oj.track"),function(s){var r=s.getBoundingClientRect();if(!r.width||r.bottom<-100||r.top>innerHeight+100)return;
        var a=Math.atan2(py-(r.top+r.height*.62),px-(r.left+r.width/2));s.style.setProperty("--dx",Math.cos(a).toFixed(3));s.style.setProperty("--dy",Math.sin(a).toFixed(3))})})},{passive:true});
  }
  return {ojo:ojo,g:g,FAM:FAM};
})();
