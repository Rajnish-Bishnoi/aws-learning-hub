const $=s=>document.querySelector(s),root=document.documentElement;
const ST=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null};
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const li=a=>a.map(x=>`<li>${x}</li>`).join("");
const dots=a=>a.map(x=>`<li><span class="dot">•</span>${x}</li>`).join("");
const TABS=[["o","Overview"],["p","Practical"],["c","Commands"],["s","Shortcuts"],["q","Questions"],["k","Cheat Sheet"],["n","My Notes"]];
let done=[];try{done=JSON.parse(ST("done")||"[]")}catch(e){}
let tab="o",cur=LS[0];

function cmd(c){return c.split("^").map(x=>{const p=x.split("~");return p.map((l,i)=>esc(l)+(i<p.length-1?" \\":"")).join("\n  ")}).join("\n")}
const card=(cls,t,h,b,x)=>`<section class="c ${cls}${x||""}" data-t="${t}"><h3>${h}</h3>${b}</section>`;

function navHtml(){
  const q=($("#q").value||"").toLowerCase();
  return S.map((s,i)=>{
    const n=i+1,ls=LS.filter(l=>l.id.split(".")[0]==n&&(!q||(l.t+l.d).toLowerCase().includes(q)));
    if(q&&!ls.length)return"";
    const isCur=cur.id.split(".")[0]==n,subs=ls.length?ls.map(l=>`<a href="#${l.id}" class="sub${l.id==cur.id?" on":""}">${done.includes(l.id)?"✓ ":""}${l.id} ${l.t}</a>`).join(""):`<a class="sub soon">Coming soon</a>`;
    return `<a href="#" class="${isCur?"open":""}" data-g="${n}"><span class="ic">${s[1]}</span>${n}. ${s[0]}</a><div class="g${isCur||q?" show":""}">${subs}</div>`}).join("");
}

function render(){
  const id=(location.hash||"#1.1").slice(1);cur=LS.find(l=>l.id==id)||LS[0];const l=cur,sec=S[l.id.split(".")[0]-1];
  document.title=`${l.t} – AWS Learning Hub`;
  const qa=[[`What is ${l.t}?`,l.d],["Explain it in simple words.",l.e],["Give a real-world example.",l.s],["What are the key benefits?",l.b.join(", ")+"."],["Common mistakes to avoid?",l.m.join("; ")+"."],["Any memory trick?",l.tr.join(" / ")]];
  const left=[
    card("blue","o","📘 1. Service Details",`<p>${l.d}</p>`),
    card("green","o","🧠 2. Easy Explanation",`<p>${l.e}</p>`),
    card("orange","o","🏢 3. Real Company Scenario",`<p>${l.s}</p>`),
    card("red","o","🎯 4. Key Benefits",`<ul class="ul">${l.b.map(x=>`<li><span class="ck">✓</span>${x}</li>`).join("")}</ul>`),
    card("green","o p","🔧 5. Practical - AWS Console Walkthrough",`<p>Follow these steps in the AWS Console:</p><ol class="steps">${li(l.p)}</ol>`," full"),
    card("orange","o","⚠ 8. Common Mistakes",`<ul class="ul" style="font-size:14px">${dots(l.m)}</ul>`),
    card("red","o","🧠 9. Remember Trick",`<p><b>“${l.tr.join("<br>")}”</b></p>`),
    card("white","q","❓ Questions &amp; Answers",qa.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join("")," full"),
    card("white","n","📝 My Notes",`<textarea id="note" placeholder="Write your notes for ${l.t}..."></textarea>`," full")].join("");
  const flow=l.f.map(x=>{const i=x.indexOf(" ");return `<div><b>${x.slice(0,i)}</b>${x.slice(i+1)}</div>`}).join('<span class="arrow">→</span>');
  const right=[
    card("white","o s","⚙ How AWS Fits In",`<div class="flow"><div><b>👥</b>Users</div><span class="arrow">⟷</span><div><b>☁</b>Internet</div><span class="arrow">⟷</span><div><b>🟠</b>AWS Cloud</div></div><div class="srv"><div><b>🔲</b>Compute (EC2)</div><div><b>🪣</b>Storage (S3)</div><div><b>🗄</b>Database (RDS)</div><div><b>🔗</b>Network (VPC)</div></div><div class="bar">On-demand, scalable, and secure infrastructure</div>`),
    card("orange","o s","⚡ 6. Flow / Shortcut",`<div class="flow">${flow}</div>`),
    card("purple","o c","⌨ 7. Important Commands (if using CLI)",`<pre># ${l.t} (AWS CLI)\n${cmd(l.c)}</pre>`),
    card("blue","o k","📄 10. Cheat Sheet",`<ul class="ul" style="font-size:14px">${dots(l.k)}</ul>`)].join("");
  const i=LS.indexOf(l),pv=LS[i-1],nx=LS[i+1];
  $("#main").innerHTML=`<div class="crumb">Home › ${sec[0]} › ${l.t}</div>
  <div class="top"><div><h1><span style="font-size:42px">${sec[1]}</span>${l.id} ${l.t}</h1><p class="sub-t">${l.sub}</p></div><button class="done" id="done"></button></div>
  <div class="tabs" id="tabs">${TABS.map(t=>`<button data-k="${t[0]}" class="${t[0]==tab?"on":""}">${t[1]}</button>`).join("")}</div>
  <div class="grid" id="grid"><div class="l">${left}</div><div class="r">${right}</div></div>
  <div class="pn">${pv?`<a href="#${pv.id}">← ${pv.t}</a>`:"<span></span>"}${nx?`<a href="#${nx.id}">${nx.t} →</a>`:""}</div>`;
  const dn=$("#done"),setD=()=>{const v=done.includes(l.id);dn.classList.toggle("on",v);dn.textContent=v?"✓ Completed":"✓ Mark as Completed";$("#pg").textContent=Math.round(done.length/LS.length*100)+"%";$("#nav").innerHTML=navHtml()};
  dn.onclick=()=>{done=done.includes(l.id)?done.filter(x=>x!=l.id):done.concat(l.id);ST("done",JSON.stringify(done));setD()};
  document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{tab=b.dataset.k;applyTab();document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",x==b))});
  const nt=$("#note");nt.value=ST("note-"+l.id)||"";nt.oninput=()=>ST("note-"+l.id,nt.value);
  setD();applyTab();scrollTo(0,0);
}
function applyTab(){
  $("#grid").classList.toggle("single",tab!="o");
  document.querySelectorAll(".c").forEach(c=>c.style.display=c.dataset.t.split(" ").includes(tab)?"":"none");
}
$("#nav").onclick=e=>{const a=e.target.closest("a[data-g]");if(a){e.preventDefault();a.nextElementSibling.classList.toggle("show")}};
$("#q").oninput=()=>{$("#nav").innerHTML=navHtml()};
$("#q").onkeydown=e=>{if(e.key=="Enter"){const a=$("#nav a.sub[href]");if(a)location.hash=a.getAttribute("href")}};
$("#theme").onclick=()=>{const dark=root.dataset.theme=="dark"||(!root.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches),n=dark?"light":"dark";root.dataset.theme=n;ST("theme",n)};
{const t=ST("theme");if(t)root.dataset.theme=t}
addEventListener("hashchange",render);render();
