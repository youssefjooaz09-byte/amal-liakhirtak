window.AmalExtra9=function(API){
const {Pages,app,$,$$,LS,AR,esc,norm,loadScript,needQ,toast,crumbs,route}=API;
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const css=`<style>
.p9g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.p9g label{display:flex;gap:6px;align-items:center;border:1px solid var(--cardb);border-radius:12px;padding:8px 10px;cursor:pointer;background:var(--card);font-size:.9rem}
.p9g label.on{border-color:var(--gold);background:rgba(226,199,121,.14)}
.p9bar{height:14px;border-radius:9px;background:rgba(255,255,255,.12);border:1px solid var(--cardb);overflow:hidden}
.p9bar i{display:block;height:100%;background:linear-gradient(90deg,#5b2a9e,#e2c779)}
.p9big{font-family:'Reem Kufi','Amiri',serif;font-size:2rem;color:var(--gold2)}
.p9t{font-family:'Amiri',serif;font-size:1.25rem;line-height:2.1;white-space:pre-wrap}
.p9q{font-family:'Amiri Quran','Amiri',serif;font-size:1.5rem;line-height:2.4}
.p9row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.p9row>*{max-width:100%}
.p9 textarea.field{width:100%;min-height:110px;box-sizing:border-box}
.p9 .field{max-width:100%;box-sizing:border-box}
.p9 details summary{cursor:pointer;font-family:'Amiri',serif;font-size:1.3rem;color:var(--gold2)}
.p9 canvas{max-width:100%;height:auto;border-radius:12px;border:2px solid var(--gold)}
.p9dot{display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid var(--gold);margin:0 2px}
.p9dot.on{background:var(--gold)}
</style>`;
const wrapP=(title,crumb,body)=>{app.innerHTML=crumbs([[crumb]])+css+`<div class="p9"><h2 class="sec">${title}</h2>${body}</div>`};
const BOOKS=()=>loadScript('data/library.js','LIBRARY');
/* ---------- khatm ---------- */
Pages.khatm=async()=>{const Q=await needQ();const total=Q.reduce((a,s)=>a+s.count,0);
 const g=()=>LS.get('khatm',{s:[],j:[]});
 const draw=()=>{const k=g(),S=new Set(k.s),J=new Set(k.j);const done=Q.filter(s=>S.has(s.n)).reduce((a,s)=>a+s.count,0);const pct=Math.round(done/total*1000)/10;const jp=Math.round(J.size/30*1000)/10;
  wrapP('رحلة ختم القرآن','رحلة الختم',`<div class="notice">تقدمك محفوظ على جهازك فقط. علّم السور التي أنهيت قراءتها والأجزاء التي أنهيتها. النسبة بحسب عدد الآيات من إجمالي ${AR(total)} آية.</div>
  <div class="card"><div class="p9big">${AR(pct)}٪ <small class="muted" style="font-size:1rem">من السور (${AR(S.size)} من ١١٤ سورة)</small></div><div class="p9bar"><i style="width:${pct}%"></i></div><br>
  <div class="p9big">${AR(jp)}٪ <small class="muted" style="font-size:1rem">من الأجزاء (${AR(J.size)} من ٣٠ جزءاً)</small></div><div class="p9bar"><i style="width:${jp}%"></i></div></div>
  <h3 class="sec">الأجزاء</h3><div class="p9g" id="kj">${Array.from({length:30},(_,i)=>`<label class="${J.has(i+1)?'on':''}"><input type="checkbox" data-j="${i+1}" ${J.has(i+1)?'checked':''}> الجزء ${AR(i+1)}</label>`).join('')}</div>
  <h3 class="sec">السور</h3><div class="p9g" id="ks">${Q.map(s=>`<label class="${S.has(s.n)?'on':''}"><input type="checkbox" data-s="${s.n}" ${S.has(s.n)?'checked':''}> ${esc(s.name)}</label>`).join('')}</div>
  <div class="toolbar" style="margin-top:14px"><button class="btn" id="kr">تصفير الرحلة</button></div>`);
  $$('#kj input').forEach(i=>i.onchange=()=>{const k=g();const n=+i.dataset.j;k.j=i.checked?[...new Set([...k.j,n])]:k.j.filter(x=>x!==n);LS.set('khatm',k);const y=scrollY;draw();scrollTo(0,y)});
  $$('#ks input').forEach(i=>i.onchange=()=>{const k=g();const n=+i.dataset.s;k.s=i.checked?[...new Set([...k.s,n])]:k.s.filter(x=>x!==n);LS.set('khatm',k);const y=scrollY;draw();scrollTo(0,y)});
  $('#kr').onclick=()=>{if(confirm('تصفير تقدم رحلة الختم؟')){LS.set('khatm',{s:[],j:[]});draw()}}};
 draw()};
/* ---------- shelf ---------- */
Pages.shelf=async()=>{const B=await BOOKS();
 const draw=()=>{const pos=LS.get('libpos',{}),fav=LS.get('libfav',[]),add=LS.get('shelfAdd',[]);
  const ids=[...new Set([...add,...Object.keys(pos),...fav])].filter(id=>B.some(b=>b.id===id));
  const rows=ids.map(id=>{const b=B.find(x=>x.id===id);const p=pos[id];return `<div class="card" style="margin:8px 0"><b style="font-family:Amiri;font-size:1.2rem">${esc(b.t)}</b><div class="muted">${esc(b.a)}</div><div class="p9row" style="margin-top:8px"><a class="btn gold" href="book.html?id=${id}">${p?'تابع القراءة من صفحة '+AR(p):'ابدأ القراءة'}</a>${add.includes(id)?`<button class="btn" data-rm="${id}">إزالة من الرف</button>`:''}</div></div>`}).join('');
  wrapP('رفّ كتبي','رفّ كتبي',`<div class="notice">الكتب التي فتحتها في المكتبة أو أضفتها لمفضلتك تظهر هنا تلقائياً مع آخر صفحة وصلت لها. الحفظ على جهازك فقط.</div>
  <div class="card"><div class="p9row"><select class="field" id="sb" style="flex:1;min-width:0">${B.filter(b=>!ids.includes(b.id)).map(b=>`<option value="${b.id}">${esc(b.t)}</option>`).join('')}</select><button class="btn gold" id="sa">أضف للرف</button></div></div>
  ${rows||'<div class="notice">الرف فارغ. أضف كتاباً من القائمة أو افتح أي كتاب من المكتبة.</div>'}<a class="btn" href="library.html">المكتبة</a>`);
  $('#sa').onclick=()=>{const v=$('#sb').value;if(!v)return;LS.set('shelfAdd',[...LS.get('shelfAdd',[]),v]);draw()};
  $$('[data-rm]').forEach(b=>b.onclick=()=>{LS.set('shelfAdd',LS.get('shelfAdd',[]).filter(x=>x!==b.dataset.rm));draw()})};
 draw()};
/* ---------- journal ---------- */
const TYPES=['فائدة','آية','حديث'];
Pages.journal=async()=>{let f='',q='';
 const draw=(keep)=>{const J=LS.get('journal',[]);const L=J.filter(x=>(!f||x.type===f)&&(!q||norm(x.text+' '+(x.src||'')).includes(norm(q))));
  if(!keep)wrapP('مفكرتي الإيمانية','مفكرتي',`<div class="notice">اكتب هنا ما تريد الرجوع إليه. الكتابة منك أنت وتُحفظ على جهازك فقط، ولا يضيف الموقع إليها شيئاً.</div>
  <div class="card"><div class="p9row"><select class="field" id="jt">${TYPES.map(t=>`<option>${t}</option>`).join('')}</select><input class="field" id="js" placeholder="المصدر (اختياري): سورة ورقم الآية، أو الكتاب" style="flex:1;min-width:0"></div><br><textarea class="field" id="jx" placeholder="اكتب الفائدة أو الآية أو الحديث"></textarea><div class="p9row" style="margin-top:8px"><button class="btn gold" id="ja">حفظ</button></div></div>
  <div class="p9row" style="margin:12px 0"><input class="field" id="jq" type="search" placeholder="ابحث في مفكرتي" style="flex:1;min-width:0"><select class="field" id="jf"><option value="">الكل</option>${TYPES.map(t=>`<option>${t}</option>`).join('')}</select><button class="btn" id="je">نسخ الكل</button><button class="btn" id="jd">تنزيل ملف نصي</button></div><div id="jl"></div>`);
  $('#jl').innerHTML=L.map(x=>`<div class="card" style="margin:8px 0"><span class="muted">${x.type} · ${new Date(x.ts).toLocaleDateString('ar-EG')}${x.src?' · '+esc(x.src):''}</span><div class="p9t">${esc(x.text)}</div><div class="p9row"><button class="btn sm" data-c="${x.id}">نسخ</button><button class="btn sm" data-d="${x.id}">حذف</button></div></div>`).join('')||'<div class="notice">لا مدخلات.</div>';
  $$('[data-c]').forEach(b=>b.onclick=()=>{const x=LS.get('journal',[]).find(y=>y.id===b.dataset.c);navigator.clipboard.writeText(x.text+(x.src?'\n['+x.src+']':'')).then(()=>toast('تم النسخ'))});
  $$('[data-d]').forEach(b=>b.onclick=()=>{if(confirm('حذف هذا المدخل؟')){LS.set('journal',LS.get('journal',[]).filter(y=>y.id!==b.dataset.d));draw(true)}});
  if(keep)return;
  $('#ja').onclick=()=>{const t=$('#jx').value.trim();if(!t){toast('اكتب النص أولاً');return}LS.set('journal',[{id:'j'+Date.now(),type:$('#jt').value,text:t,src:$('#js').value.trim(),ts:Date.now()},...LS.get('journal',[])]);$('#jx').value='';$('#js').value='';draw(true)};
  $('#jq').oninput=e=>{q=e.target.value;draw(true)};$('#jf').onchange=e=>{f=e.target.value;draw(true)};
  const txt=()=>LS.get('journal',[]).map(x=>`[${x.type}] ${x.text}${x.src?'\n('+x.src+')':''}`).join('\n\n');
  $('#je').onclick=()=>navigator.clipboard.writeText(txt()).then(()=>toast('تم النسخ'));
  $('#jd').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt()],{type:'text/plain;charset=utf-8'}));a.download='mufakkirati.txt';a.click()}};
 draw(false)};
/* ---------- daily cards ---------- */
const quote=t=>{const m=t.match(/"\s*([^"]{10,})"/);return m?m[1].trim():null};
Pages.cards=async(p)=>{const Q=await needQ(),T=await loadScript('data/tafsir-muyassar.js','TAFSIR_MUYASSAR'),N=await loadScript('data/hadith/nawawi-1.js','H_nawawi_1');
 const ay=[];Q.forEach((s,si)=>s.ayahs.forEach((a,i)=>{if(s.n>1&&a.length>=40&&a.length<=170&&T[si]&&T[si][i]&&T[si][i].length>=60&&T[si][i].length<=330)ay.push([si,i])}));
 const hd=N.filter(h=>{const q=quote(h[1]);return q&&q.length<=420});
 let off=+(p.get('o')||0);const seed=hash(today());
 const build=()=>{const [si,i]=ay[(seed+off*7919)%ay.length];const s=Q[si];const h=hd[(seed+off*31)%hd.length];const ben=T[si][i];
  return [{k:'آية',t:'﴿'+s.ayahs[i]+'﴾',src:`${s.name}، الآية ${AR(i+1)}`,link:`surah.html?s=${s.n}&a=${i+1}#a${i+1}`},
   {k:'حديث',t:quote(h[1]),src:`الأربعون النووية، حديث رقم ${AR(h[0])}`,full:h[1],link:'hadith.html?c=nawawi'},
   {k:'فائدة',t:ben,src:`التفسير الميسر (مجمع الملك فهد)، تفسير ${s.name} الآية ${AR(i+1)}`,link:`surah.html?s=${s.n}&a=${i+1}#a${i+1}`}]};
 let C=build(),cur=0;
 const draw=()=>{const c=C[cur];wrapP('بطاقات يومية','بطاقات يومية',`<div class="notice">بطاقة اليوم تتغير يومياً. الآية من مصحف المدينة، والحديث من الأربعين النووية كما ورد نصه بتخريجه، والفائدة نص من التفسير الميسر. كلها منقولة بلا تعديل.</div>
  <div class="p9row">${C.map((x,i)=>`<button class="btn ${i===cur?'gold':''}" data-t="${i}">${x.k}</button>`).join('')}<button class="btn" id="cn">بطاقة أخرى</button></div>
  <div class="card" style="margin:12px 0;text-align:center"><span class="muted">${c.k}</span><div class="${c.k==='آية'?'p9q':'p9t'}">${esc(c.t)}</div><div class="muted">${esc(c.src)}</div>${c.full?`<details style="text-align:right"><summary>النص كاملاً بتخريجه</summary><div class="p9t" style="font-size:1.05rem">${esc(c.full)}</div></details>`:''}</div>
  <div class="p9row"><button class="btn gold" id="cs">مشاركة كصورة</button><button class="btn" id="cc">نسخ النص</button><button class="btn" id="cj">حفظ في مفكرتي</button><a class="btn" href="${c.link}">في سياقه</a></div><br><canvas id="cv" width="1080" height="1350" style="display:none"></canvas><div id="cp"></div>`);
  $$('[data-t]').forEach(b=>b.onclick=()=>{cur=+b.dataset.t;draw()});
  $('#cn').onclick=()=>{off++;C=build();draw()};
  const txt=`${c.t}\n(${c.src})\n\nموقع اعمل لآخرتك`;
  $('#cc').onclick=()=>navigator.clipboard.writeText(txt).then(()=>toast('تم النسخ'));
  $('#cj').onclick=()=>{LS.set('journal',[{id:'j'+Date.now(),type:c.k,text:c.t,src:c.src,ts:Date.now()},...LS.get('journal',[])]);toast('تم الحفظ في مفكرتي')};
  $('#cs').onclick=async()=>{const D=window.AmalDraw;await D.loadFont('Amiri');await D.loadFont('Amiri Quran');await D.loadFont('Reem Kufi');const cv=$('#cv'),x=cv.getContext('2d'),w=1080,h=1350;
   const gr=x.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#0b1230');gr.addColorStop(.6,'#2d1a5a');gr.addColorStop(1,'#5b2a9e');x.fillStyle=gr;x.fillRect(0,0,w,h);
   x.strokeStyle='#e2c779';x.lineWidth=6;x.strokeRect(30,30,w-60,h-60);x.lineWidth=2;x.strokeRect(48,48,w-96,h-96);
   x.textAlign='center';x.direction='rtl';x.fillStyle='#e2c779';x.font='56px "Reem Kufi"';x.fillText('اعمل لآخرتك',w/2,150);x.font='36px "Amiri"';x.fillText(c.k,w/2,215);
   x.save();x.translate(0,230);const ok=D.drawBlock(x,w,h-480,c.t,{font:c.k==='آية'?'Amiri Quran':'Amiri',color:'#f6f1e6',scale:1});x.restore();
   x.fillStyle='#e2c779';x.font='34px "Amiri"';D.wrap(x,c.src,w-200).forEach((l,i)=>x.fillText(l,w/2,h-190+i*48));
   if(!ok){toast('النص طويل للصورة، استخدم النسخ');return}
   cv.toBlob(async b=>{const f=new File([b],'amal-card.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){}}
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='amal-card.png';a.click();$('#cp').innerHTML='';cv.style.display='block';$('#cp').appendChild(cv)},'image/png')}};
 draw()};
/* ---------- wird ---------- */
Pages.wird=async()=>{const B=await BOOKS();
 const g=()=>LS.get('wird',{cfg:{quran:{on:true,n:1},adhkar:{on:true,m:true,e:true},book:{on:false,id:'',n:5}},log:{}});
 const draw=()=>{const w=g(),c=w.cfg,t=today(),L=w.log[t]||{};
  const items=[];if(c.quran.on)items.push(['quran',`قراءة ${AR(c.quran.n)} ${c.quran.n==1?'صفحة':'صفحات'} من القرآن`,'quran.html']);
  if(c.adhkar.on){if(c.adhkar.m)items.push(['am','أذكار الصباح','azkar.html']);if(c.adhkar.e)items.push(['ae','أذكار المساء','azkar.html'])}
  if(c.book.on&&c.book.id){const b=B.find(x=>x.id===c.book.id);if(b)items.push(['book',`قراءة ${AR(c.book.n)} صفحات من «${b.t}»`,'book.html?id='+b.id])}
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-i*864e5);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');return [k,w.log[k]||{}]}).reverse();
  wrapP('ورد يومي','ورد يومي',`<div class="notice">وردك بينك وبين الله. هنا تسجّل ما أنجزته فقط، بلا نقاط ولا ترتيب ولا مقارنة. تُحفظ البيانات على جهازك فقط.</div>
  <h3 class="sec">ورد اليوم</h3>${items.map(([k,l,h])=>`<div class="card" style="margin:8px 0"><label class="p9row" style="cursor:pointer"><input type="checkbox" data-k="${k}" ${L[k]?'checked':''}><span style="flex:1;min-width:0">${esc(l)}</span><a class="btn sm" href="${h}">افتح</a></label></div>`).join('')||'<div class="notice">لم تحدد وِرداً بعد. اضبطه بالأسفل.</div>'}
  <div class="card"><b>آخر ٧ أيام</b><div style="margin-top:6px">${days.map(([k,l])=>`<span title="${k}" class="p9dot ${Object.values(l).some(Boolean)?'on':''}"></span>`).join('')}</div></div>
  <h3 class="sec">ضبط الورد</h3><div class="card">
  <label class="p9row"><input type="checkbox" id="wq" ${c.quran.on?'checked':''}> القرآن: عدد الصفحات <input class="field" id="wqn" type="number" min="1" max="100" value="${c.quran.n}" style="width:80px;min-width:0"></label><br>
  <label class="p9row"><input type="checkbox" id="wa" ${c.adhkar.on?'checked':''}> الأذكار</label>
  <div class="p9row" style="margin:6px 20px"><label><input type="checkbox" id="wm" ${c.adhkar.m?'checked':''}> الصباح</label><label><input type="checkbox" id="we" ${c.adhkar.e?'checked':''}> المساء</label></div>
  <label class="p9row"><input type="checkbox" id="wb" ${c.book.on?'checked':''}> قراءة كتاب</label>
  <div class="p9row" style="margin:6px 20px"><select class="field" id="wbi" style="flex:1;min-width:0"><option value="">اختر كتاباً</option>${B.map(b=>`<option value="${b.id}" ${c.book.id===b.id?'selected':''}>${esc(b.t)}</option>`).join('')}</select><input class="field" id="wbn" type="number" min="1" max="200" value="${c.book.n}" style="width:80px;min-width:0"> صفحات</div></div>`);
  $$('[data-k]').forEach(i=>i.onchange=()=>{const w=g();w.log[t]=w.log[t]||{};w.log[t][i.dataset.k]=i.checked;LS.set('wird',w)});
  const sv=()=>{const w=g();w.cfg={quran:{on:$('#wq').checked,n:Math.max(1,+$('#wqn').value||1)},adhkar:{on:$('#wa').checked,m:$('#wm').checked,e:$('#we').checked},book:{on:$('#wb').checked,id:$('#wbi').value,n:Math.max(1,+$('#wbn').value||1)}};LS.set('wird',w);draw()};
  ['wq','wqn','wa','wm','we','wb','wbi','wbn'].forEach(id=>$('#'+id).onchange=sv)};
 draw()};
/* ---------- glossary ---------- */
const GL=()=>loadScript('data/glossary.js','GLOSSARY');
Pages.glossary=async(p)=>{const G=await GL();let q=p.get('q')||'';
 const draw=()=>{const L=G.filter(g=>!q||norm(g.t+' '+g.ist+' '+g.lug).includes(norm(q)));
  $('#gl').innerHTML=L.map(g=>`<div class="card" style="margin:8px 0"><details ${q&&L.length<4?'open':''}><summary>${esc(g.t)}</summary>${g.lug?`<b>لغةً:</b><div class="p9t" style="font-size:1.1rem">${esc(g.lug)}</div><b>اصطلاحاً:</b>`:''}<div class="p9t" style="font-size:1.1rem">${esc(g.ist)}</div><div class="muted">المصدر: <a href="${g.url}" target="_blank" rel="noopener">${esc(g.src)}</a></div></details></div>`).join('')||'<div class="notice">لا نتائج.</div>'};
 wrapP('قاموس المصطلحات الشرعية','القاموس',`<div class="notice">النصوص منقولة كما هي من المصدر المذكور تحت كل مصطلح، ولا يكتب الموقع شرحاً من عنده. مصادر القاموس: موسوعة الأخلاق والسلوك (الدرر السنية) وكتاب التعريفات للجرجاني.<br>مصطلحات لم نجد لها بعد نصاً موثقاً من مصدر معتمد فلم تُضف: التوكل، التقوى.</div><input class="field" id="gs" type="search" placeholder="ابحث عن مصطلح" value="${esc(q)}" style="width:100%"><div id="gl"></div>`);
 $('#gs').oninput=e=>{q=e.target.value;draw()};draw()};
/* ---------- quiz extension (hadith narrators, from Arbaeen text) ---------- */
const oq=Pages.quiz;
Pages.quiz=async(p)=>{try{if(!window.EXTRA_BANK){const N=await loadScript('data/hadith/nawawi-1.js','H_nawawi_1');const ids=[1,3,4,5,6,7,9,13,17,20,22,23,30,31,41];const nar={};
  ids.forEach(n=>{const h=N.find(x=>x[0]===n);const m=h&&h[1].match(/^(?:عَنْ|عَن)\s+(.{3,90}?)\s+(?:رَضِيَ|رضي)/);if(m)nar[n]=m[1].trim()});
  const all=Object.values(nar);window.EXTRA_BANK=[];
  Object.keys(nar).forEach(n=>{const h=N.find(x=>x[0]==n);const mm=h[1].match(/صلى الله عليه (?:و )?سلم\)?\s*(?:-[^-]*-\s*)?(?:(?:يَقُولُ|قَالَ|قَال|فَقَالَ)\s*:?\s*)?([^]*)/);if(!mm)return;let ws=mm[1].replace(/["«»“”:]/g,'').split(/\s+/).filter(Boolean);const cut=ws.findIndex(x=>/^(رَوَاهُ|حَدِيثٌ|\[|\.)/.test(x));if(cut>=0)ws=ws.slice(0,cut);if(ws.length<6||ws.some(x=>/صلى/.test(x)))return;const w=ws.slice(0,14).join(' ');
   const d=all.filter(x=>x!==nar[n]).sort((a,b)=>hash(a+n)-hash(b+n)).slice(0,3);
   window.EXTRA_BANK.push({id:'hn'+n,cat:'الحديث',l:'m',q:`من راوي هذا الحديث من الأربعين النووية؟\n«${w}…»`,a:nar[n],d,e:`هذا الحديث رقم ${AR(n)} في الأربعين النووية، وهو عن ${nar[n]} رضي الله عنه.`})})}}catch(e){}
 return oq(p)};
/* ---------- unified search ---------- */
const os=Pages.search;
Pages.search=async(p)=>{await os(p);const gr=$('#gr');if(!gr)return;gr.insertAdjacentHTML('beforebegin','<div id="xr"></div>');
 const B=await BOOKS(),M=await loadScript('data/majalis.js','MAJALIS'),G=await GL();
 const upd=()=>{const v=norm($('#gq').value);const o=$('#xr');if(v.length<2){o.innerHTML='';return}
  const sec=(t,a)=>a.length?`<h3 class="sec">${t} <small class="muted">${AR(a.length)}</small></h3>${a.join('')}`:'';
  const bk=B.filter(b=>norm(b.t+' '+b.a).includes(v)).map(b=>`<a class="card" style="display:block;margin:6px 0" href="book.html?id=${b.id}">${esc(b.t)} <span class="muted">${esc(b.a)}</span></a>`);
  const ms=M.filter(s=>norm(s.t+' '+s.a).includes(v)).map(s=>`<a class="card" style="display:block;margin:6px 0" href="series.html?id=${s.id}">${esc(s.t)} <span class="muted">${esc(s.a)}</span></a>`);
  const gl=G.filter(g=>norm(g.t+' '+g.ist+' '+g.lug).includes(v)).map(g=>`<a class="card" style="display:block;margin:6px 0" href="glossary.html?q=${encodeURIComponent(g.t)}">${esc(g.t)} <span class="muted">${esc((g.ist||'').slice(0,90))}…</span></a>`);
  const jn=LS.get('journal',[]).filter(x=>norm(x.text+' '+(x.src||'')).includes(v)).map(x=>`<a class="card" style="display:block;margin:6px 0" href="journal.html">${x.type}: ${esc(x.text.slice(0,100))}</a>`);
  o.innerHTML=sec('الكتب (بحث بالعنوان والمؤلف فقط)',bk)+sec('الدروس والسلاسل (بالعنوان والعالم)',ms)+sec('قاموس المصطلحات',gl)+sec('مفكرتي',jn)};
 $('#gq').addEventListener('input',upd);$('#gb').addEventListener('click',upd);upd();
 const n=$('#gq').closest('.card');if(n)n.insertAdjacentHTML('beforeend','<div class="muted">البحث في الكتب والدروس يتم بالعنوان واسم المؤلف أو العالم، لا بمحتوى الملفات الصوتية أو الـPDF.</div>')};
/* ---------- stories ---------- */
const STO=()=>loadScript('data/stories.js','STORIES');
Pages.stories=async()=>{const S=await STO();let q='';
 const draw=()=>{const L=S.filter(x=>!q||norm(x.t).includes(norm(q)));const qs=L.filter(x=>x.s),hs=L.filter(x=>x.h);
  const card=x=>`<a class="card" style="display:block;margin:6px 0" href="story.html?id=${x.id}"><b style="font-family:Amiri;font-size:1.2rem">${esc(x.t)}</b><div class="muted">${x.s?'القرآن الكريم، سورة '+AR(x.s)+'، الآيات '+AR(x.a)+(x.b!==x.a?'–'+AR(x.b):''):esc(x.src)}</div></a>`;
  $('#sl').innerHTML=(qs.length?`<h3 class="sec">قصص من القرآن الكريم <small class="muted">${AR(qs.length)}</small></h3>`+qs.map(card).join(''):'')+(hs.length?`<h3 class="sec">قصص من الحديث الصحيح <small class="muted">${AR(hs.length)}</small></h3>`+hs.map(card).join(''):'')||'<div class="notice">لا نتائج.</div>'};
 wrapP('قصص وعبر','قصص وعبر',`<div class="notice">قصص من القرآن الكريم بنص الآيات، وقصص من الصحيحين بنص الحديث. العبر المعروضة منقولة بنصها من تفسير السعدي، ولم نكتب عبراً من عندنا ولا نسبنا إلى أحد كلاماً لم يقله. وقصص الأنبياء المفصلة لابن كثير في <a href="qisas.html">قصص الأنبياء</a>.</div><input class="field" id="ss" type="search" placeholder="ابحث في القصص" style="width:100%"><div id="sl"></div>`);
 $('#ss').oninput=e=>{q=e.target.value;draw()};draw()};
Pages.story=async(p)=>{const S=await STO(),x=S.find(y=>y.id===p.get('id'));if(!x){app.innerHTML='<div class="notice">القصة غير موجودة.</div>';return}
 if(x.h){const m=x.h.match(/^(\w+)-(\d+)$/);const A=await loadScript(`data/hadith/${x.h}.js`,'H_'+m[1]+'_'+m[2]);const h=A.find(y=>y[0]===x.n);
  wrapP(esc(x.t),'قصص وعبر',`<div class="notice">نص الحديث كما في الكتاب بسنده. ${esc(x.src)}. لم نضف عبراً منسوبة لأحد لعدم وجود مصدر معتمد لها في الموقع، والحديث نفسه هو الموعظة.</div><div class="card"><div class="p9t">${esc(h[1])}</div></div><a class="btn" href="stories.html">كل القصص</a>`);return}
 const Q=await needQ(),T=await loadScript('data/tafsir-muyassar.js','TAFSIR_MUYASSAR');let SA={};try{SA=await loadScript(`data/saadi/${x.s}.js`,'SAADI_'+x.s)}catch(e){}
 const s=Q[x.s-1],nums=[];for(let i=x.a;i<=x.b;i++)nums.push(i);
 const ays=nums.map(i=>`<span class="p9q">${esc(s.ayahs[i-1])} <small class="muted">﴿${AR(i)}﴾</small></span>`).join(' ');
 const sa=nums.filter(i=>SA[i]),mu=nums.filter(i=>T[x.s-1][i-1]);
 const les=(x.L||[]).filter(i=>SA[i]).map(i=>`<div class="card" style="margin:8px 0"><div class="muted">من تفسير السعدي للآية ${AR(i)}</div><div class="p9t" style="font-size:1.1rem">${esc(SA[i])}</div></div>`).join('');
 const qk=x.Q?`<div class="card" style="margin:8px 0"><div class="p9q">﴿${esc(Q[x.Q[0]-1].ayahs[x.Q[1]-1])}﴾</div><div class="muted">${esc(Q[x.Q[0]-1].name)}: ${AR(x.Q[1])}</div></div>`:'';
 wrapP(esc(x.t),'قصص وعبر',`<div class="muted">سورة ${esc(s.name)}، الآيات ${AR(x.a)}${x.b!==x.a?'–'+AR(x.b):''}</div>
 <h3 class="sec">القصة (نص الآيات)</h3><div class="card" style="text-align:center;line-height:2.6">${ays}</div>
 <div class="p9row" style="margin:8px 0"><a class="btn" href="surah.html?s=${x.s}&a=${x.a}#a${x.a}">في المصحف</a><a class="btn" href="qisas.html">قصص الأنبياء لابن كثير</a></div>
 <h3 class="sec">العبر والدروس</h3>${les||qk?`<div class="notice">منقولة بنصها من المصدر المذكور تحت كل فقرة.</div>${les}${qk}`:'<div class="notice">لم نجد في المصادر المتاحة للموقع نصاً صريحاً للعبر في هذه القصة، فلم نكتب شيئاً من عندنا. اقرأ تفسير السعدي والميسر بالأسفل، وفيهما بيان معاني الآيات.</div>'}
 <h3 class="sec">التفسير الميسر <small class="muted">مجمع الملك فهد</small></h3><details class="card"><summary>اعرض التفسير</summary>${mu.map(i=>`<div style="margin:8px 0"><span class="muted">آية ${AR(i)}</span><div class="p9t" style="font-size:1.05rem">${esc(T[x.s-1][i-1])}</div></div>`).join('')}</details>
 <h3 class="sec">تفسير السعدي <small class="muted">تيسير الكريم الرحمن، عبد الرحمن السعدي</small></h3><details class="card"><summary>اعرض التفسير</summary>${sa.map(i=>`<div style="margin:8px 0"><span class="muted">آية ${AR(i)}</span><div class="p9t" style="font-size:1.05rem">${esc(SA[i])}</div></div>`).join('')||'<div class="muted">لا يوجد.</div>'}</details>
 <br><a class="btn" href="stories.html">كل القصص</a>`)};

};
