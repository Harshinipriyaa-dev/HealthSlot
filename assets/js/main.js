const $=(s,e=document)=>e.querySelector(s),money=n=>'₹'+(+n).toFixed(2),
DEP={'General Medicine':['Dr. Rao'],Cardiology:['Dr. Iyer'],Dermatology:['Dr. Shah']},SL=['09:00','09:30','10:00','10:30','11:00','11:30'],
L={now:'Now Serving',waiting:'Waiting',completed:'Completed'};
const D0={meds:[{id:1,n:'Paracetamol 500mg',c:'Pain relief',p:25,rx:0,a:1,dm:340},{id:2,n:'Amoxicillin 250mg',c:'Antibiotic',p:85,rx:1,a:1,dm:210},{id:3,n:'Cetirizine 10mg',c:'Allergy',p:30,rx:0,a:1,dm:180},{id:4,n:'Metformin 500mg',c:'Diabetes',p:45,rx:1,a:1,dm:150},{id:5,n:'ORS Sachet',c:'Hydration',p:12,rx:0,a:1,dm:260},{id:6,n:'Omeprazole 20mg',c:'Digestive',p:60,rx:0,a:1,dm:120}],
q:[{t:11,pt:'Asha Verma',dr:'Dr. Rao',s:'completed'},{t:12,pt:'Ravi Kumar',dr:'Dr. Rao',s:'now'},{t:13,pt:'Meera Nair',dr:'Dr. Rao',s:'waiting'},{t:14,pt:'Demo Patient',dr:'Dr. Rao',s:'waiting'},{t:5,pt:'Lena Das',dr:'Dr. Iyer',s:'now'},{t:6,pt:'Arjun Menon',dr:'Dr. Iyer',s:'waiting'}],
ap:[{id:1,pt:'Demo Patient',dr:'Dr. Rao',dep:'General Medicine',d:'2026-11-17',tm:'10:30',s:'confirmed',tk:14},{id:2,pt:'Demo Patient',dr:'Dr. Shah',dep:'Dermatology',d:'2026-11-24',tm:'09:30',s:'booked',tk:3},{id:3,pt:'Demo Patient',dr:'Dr. Iyer',dep:'Cardiology',d:'2026-10-02',tm:'11:00',s:'completed',tk:7},{id:4,pt:'Ravi Kumar',dr:'Dr. Rao',dep:'General Medicine',d:'2026-11-17',tm:'10:00',s:'confirmed',tk:12},{id:5,pt:'Meera Nair',dr:'Dr. Rao',dep:'General Medicine',d:'2026-11-17',tm:'10:00',s:'booked',tk:13},{id:6,pt:'Lena Das',dr:'Dr. Iyer',dep:'Cardiology',d:'2026-11-17',tm:'09:30',s:'cancelled',tk:4}],
pts:[{n:'Demo Patient',ph:'90000 00001',dob:'1990-04-12',h:'Seasonal allergies (fictional)'},{n:'Ravi Kumar',ph:'90000 00002',dob:'1975-08-30',h:'Hypertension (fictional)'},{n:'Meera Nair',ph:'90000 00003',dob:'1984-01-22',h:'None recorded'},{n:'Lena Das',ph:'90000 00004',dob:'1968-11-05',h:'Type 2 diabetes (fictional)'}],
cart:[],bills:[],rx:[{id:1,pt:'Demo Patient',dr:'Dr. Iyer',d:'2026-10-02',items:[{n:'Metformin 500mg',dose:'1 tablet',freq:'Twice daily',dur:'30 days',ins:'After meals'}]}],
deps:[{n:'General Medicine',s:'active'},{n:'Cardiology',s:'active'},{n:'Dermatology',s:'active'}],drs:[{n:'Dr. Rao',dep:'General Medicine',s:'active'},{n:'Dr. Iyer',dep:'Cardiology',s:'active'},{n:'Dr. Shah',dep:'Dermatology',s:'active'}],recs:[{n:'Priya Singh',s:'active'},{n:'Karan Joshi',s:'active'}]};
let S;try{S=JSON.parse(localStorage.hs)}catch(e){}S=S||D0;
const save=()=>localStorage.hs=JSON.stringify(S),
toast=m=>{const t=$('#toast');t.textContent=m;t.className='on';setTimeout(()=>t.className='',2200)},
act=(f,m)=>{f();save();render();m&&toast(m)},
badge=s=>`<span class="b ${s}">${L[s]||s}</span>`,
tbl=(h,r)=>r.length?`<div class=tw><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.map(x=>`<tr>${x.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`:'<p class=empty>Nothing here yet.</p>',
bars=d=>{const m=Math.max(...d.map(x=>x[1]),1);return d.length?d.map(x=>`<div class=bar><span>${x[0]}</span><i style="width:${x[1]/m*100}%"></i><b>${x[1]}</b></div>`).join(''):'<p class=empty>No data.</p>'},
dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t]));a.download=n;a.click()},
modal=h=>{const m=document.createElement('div');m.className='md';m.innerHTML=`<div class=card>${h}<br><button onclick="this.closest('.md').remove()">Close</button></div>`;document.body.append(m)},
opts=(a,v)=>a.map(x=>`<option${x==v?' selected':''}>${x}</option>`).join(''),
adv=dr=>{const c=S.q.find(x=>x.dr==dr&&x.s=='now');if(c)c.s='completed';const n=S.q.filter(x=>x.dr==dr&&x.s=='waiting').sort((a,b)=>a.t-b.t)[0];if(n)n.s='now'},
setQ=(dr,t,s)=>act(()=>{S.q.find(x=>x.dr==dr&&x.t==t).s=s},'Queue updated'),
qview=drs=>drs.map(dr=>{const l=S.q.filter(x=>x.dr==dr).sort((a,b)=>a.t-b.t);return`<div class=card><div class=row><h2>${dr}</h2><button onclick="act(()=>adv('${dr}'),'Queue advanced')">Advance queue</button></div>${tbl(['Token','Patient','Status','Update'],l.map(x=>[x.t,x.pt,badge(x.s),`<select onchange="setQ('${dr}',${x.t},this.value)">${['waiting','now','completed','skipped'].map(o=>`<option value=${o}${o==x.s?' selected':''}>${L[o]||o}</option>`).join('')}</select>`]))}</div>`}).join('');
function shell(role,title,secs){
 if(!sessionStorage['hs_'+role])return location.replace('login.html');
 document.body.innerHTML=`<aside id=sb><div class=brand>＋ HealthSlot<small>${title}</small></div>${secs.map(s=>`<a href="#${s[0]}">${s[1]}</a>`).join('')}<a href="#" id=out>Sign out</a></aside><main><button id=mn onclick="$('#sb').classList.toggle('open')">☰ Menu</button><p class=sim>Simulated demo: fictional data, simulated sign-in, stored only in this browser.</p><div id=v></div></main><div id=toast></div>`;
 window.render=()=>{const id=location.hash.slice(1),s=secs.find(x=>x[0]==id)||secs[0];$('#v').innerHTML=`<h1>${s[1]}</h1>`+s[2]();document.querySelectorAll('#sb a').forEach(a=>a.classList.toggle('on',a.hash=='#'+s[0]));$('#sb').classList.remove('open')};
 $('#out').onclick=e=>{e.preventDefault();sessionStorage.removeItem('hs_'+role);location.href='login.html'};
 addEventListener('hashchange',render);render();
}
function loginInit(role){const f=$('form');f.onsubmit=e=>{e.preventDefault();if(!f.u.value.trim()||f.p.value.length<4)return $('#err').textContent='Enter a username and a password of at least 4 characters.';sessionStorage['hs_'+role]=f.u.value.trim();location.href='dashboard.html'}}
