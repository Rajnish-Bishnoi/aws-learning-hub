const $=s=>document.querySelector(s),root=document.documentElement;
const ST=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null};
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const COL=["blue","green","orange","red","purple"];
let M=[],cur=null,tab=0,data=null,done=[];try{done=JSON.parse(ST("done")||"[]")}catch(e){}
const all=()=>M.flatMap(t=>t.lessons.map(l=>Object.assign({topic:t},l)));
const key=l=>l.topic.id+"/"+l.id;

function block(b,i){
  const c=b.c||COL[i%5],full=b.w=="full"||["table","qa"].includes(b.t)?" full":"";
  let x;
  if(b.t=="list")x=`<ul class="ul">${b.items.map(v=>`<li><span class="ck">✓</span>${v}</li>`).join("")}</ul>`;
  else if(b.t=="steps")x=`<ol class="steps">${b.items.map(v=>`<li>${v}</li>`).join("")}</ol>`;
  else if(b.t=="table")x=`<div class="tw"><table><tr>${b.cols.map(v=>`<th>${v}</th>`).join("")}</tr>${b.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</table></div>`;
  else if(b.t=="code")x=`<pre>${esc(Array.isArray(b.code)?b.code.join("\n"):b.code)}</pre>`;
  else if(b.t=="qa")x=b.items.map(v=>`<details><summary>${v[0]}</summary><p>${v[1]}</p></details>`).join("");
  else if(b.t=="svg")x=`<div class="tw">${b.svg}</div>`;
  else if(b.t=="flow")x=`<div class="flow">${b.items.map(v=>{const k=v.indexOf(" ");return `<div><b>${v.slice(0,k)}</b>${v.slice(k+1)}</div>`}).join('<span class="arrow">→</span>')}</div>`;
  else x=`<p>${b.p}</p>`;
  return `<section class="c ${c}${full}"><h3>${b.h||""}</h3>${x}</section>`;
}

function res(b){if(!b.ref)return b;const p=b.ref.split("."),o=Object.assign({},data.tabs[p[0]][+p[1]],b);delete o.ref;return o}
function nav(){
  const q=$("#q").value.toLowerCase(),h=(location.hash||"").slice(1),tid=h.split("/")[0];
  $("#nav").innerHTML=M.map(t=>{
    const ls=t.lessons.filter(l=>!q||(l.title+t.name).toLowerCase().includes(q));
    if(q&&!ls.length)return"";
    const subs=ls.length?ls.map(l=>{const k=t.id+"/"+l.id;return `<a href="#${k}" class="sub${k==h?" on":""}">${done.includes(k)?"✓ ":""}${l.title}</a>`}).join(""):`<a class="sub soon">Coming soon</a>`;
    return `<a href="#" class="${t.id==tid?"open":""}" data-g="1"><span class="ic">${t.icon}</span>${t.name}</a><div class="g${t.id==tid||q?" show":""}">${subs}</div>`}).join("");
  const n=all().length;$("#pg").textContent=(n?Math.round(done.length/n*100):0)+"%";
}

async function route(){
  $("#nav").classList.remove("m");
  const L=all(),h=(location.hash||"").slice(1),l=L.find(x=>key(x)==h)||L[0];
  if(!l){$("#main").innerHTML="<p>No lessons yet. Add one in content/manifest.json</p>";return}
  if(key(l)!=h)history.replaceState(null,"","#"+key(l));
  cur=l;tab=0;
  try{const r=await fetch("content/"+l.file);if(!r.ok)throw 0;data=await r.json()}
  catch(e){$("#main").innerHTML=`<p>Could not load <b>content/${l.file}</b>. Check the file name in manifest.json and that the JSON is valid.</p>`;return}
  document.title=l.title+" – AWS Learning Hub";draw();nav();scrollTo(0,0);
}

function draw(){
  const l=cur,names=Object.keys(data.tabs).concat("My Notes"),k=key(l),L=all(),i=L.findIndex(x=>key(x)==k),pv=L[i-1],nx=L[i+1];
  const body=tab==names.length-1
    ?`<section class="c white full"><h3>📝 My Notes</h3><textarea id="note" placeholder="Write your notes for ${l.title}..."></textarea></section>`
    :data.tabs[names[tab]].map(res).map(block).join("");
  const ov=names[tab]=="Overview",bl=ov?data.tabs.Overview.map(res):[];
  const main=ov?`<div class="grid"><div class="l">${bl.filter(b=>!b.r).map(block).join("")}</div><div class="r">${bl.filter(b=>b.r).map(block).join("")}</div></div>`:`<div class="cards">${body}</div>`;
  $("#main").innerHTML=`<div class="crumb">AWS › ${l.topic.name} › ${l.title}</div>
  <div class="top"><div><h1><span style="font-size:42px">${data.icon||l.topic.icon}</span>${l.title}</h1><p class="sub-t">${data.sub||""}</p></div><button class="done" id="done"></button></div>
  <div class="tabs">${names.map((n,j)=>`<button data-i="${j}" class="${j==tab?"on":""}">${n}</button>`).join("")}</div>
  ${main}
  <div class="pn">${pv?`<a href="#${key(pv)}">← ${pv.title}</a>`:"<span></span>"}${nx?`<a href="#${key(nx)}">${nx.title} →</a>`:""}</div>`;
  const d=$("#done"),setD=()=>{const v=done.includes(k);d.classList.toggle("on",v);d.textContent=v?"✓ Completed":"✓ Mark as Completed"};setD();
  d.onclick=()=>{done=done.includes(k)?done.filter(x=>x!=k):done.concat(k);ST("done",JSON.stringify(done));setD();nav()};
  document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{tab=+b.dataset.i;draw()});
  const nt=$("#note");if(nt){nt.value=ST("note-"+k)||"";nt.oninput=()=>ST("note-"+k,nt.value)}
}

$("#nav").onclick=e=>{const a=e.target.closest("a[data-g]");if(a){e.preventDefault();a.nextElementSibling.classList.toggle("show")}};
$("#q").oninput=nav;
$("#q").onkeydown=e=>{if(e.key=="Enter"){const a=$("#nav a.sub[href]");if(a)location.hash=a.getAttribute("href")}};
$("#menu").onclick=()=>$("#nav").classList.toggle("m");
$("#theme").onclick=()=>{const dk=root.dataset.theme=="dark"||(!root.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches),n=dk?"light":"dark";root.dataset.theme=n;ST("theme",n)};
{const t=ST("theme");if(t)root.dataset.theme=t}
addEventListener("hashchange",route);
fetch("content/manifest.json").then(r=>r.json()).then(m=>{M=m.topics;nav();route()}).catch(()=>{$("#main").innerHTML="<p>Could not load content/manifest.json. Open the site via GitHub Pages or a local server (not by double-clicking index.html).</p>"});
