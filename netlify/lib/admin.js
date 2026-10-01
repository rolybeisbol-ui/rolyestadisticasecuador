module.exports=function(){
/* Panel de administrador: solo se envía al navegador si hay sesión válida (ver auth.js) */
const needXL=()=>window.XLSX?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/vendor/xlsx.full.min.js';s.onload=ok;s.onerror=()=>no('No se pudo cargar el lector de Excel');document.head.appendChild(s)});
/* 07-excel.js · lectura del libro de Excel
   Los equipos se detectan por la ESTRUCTURA de cada hoja (título "O F E N S I V A" en C1) y el nombre
   real sale de la hoja ATLE (columna TEAM). La hoja TABLA ya no se usa: es una plantilla escrita a mano
   que se copia igual de una liga a otra. Celdas fijas de la plantilla: JJ=C53, G=T72, P=U72, E=AB72. */
const NO_EQUIPO=['ATLE','B_D','OFE-DEF','LANZ','TABLA','Colectivas','10 Pri Ofensiva','Pri Lanz','Pri Def','RECEPTORES','Líderes'];
async function loadXL(file){const st=m=>{const s=$('#st');if(s)s.textContent=m};try{st('Leyendo el archivo…');await needXL();const buf=await file.arrayBuffer(),jn=+($('#jn')&&$('#jn').value)||0,n=x=>+x||0;
 const at=XLSX.read(buf,{type:'array',sheets:['ATLE']}).Sheets.ATLE,num={};
 if(at)XLSX.utils.sheet_to_json(at,{header:1,defval:null}).forEach((r,i)=>{if(i&&r[0]!=null&&r[2])num[r[0]]=String(r[2]).trim()});
 const lgn=at&&at.E2&&at.E2.v,names=XLSX.read(buf,{type:'array',bookSheets:true}).SheetNames.filter(s=>!NO_EQUIPO.includes(s));
 const wb=XLSX.read(buf,{type:'array',sheets:names,sheetRows:75}),teams=[],used=new Set();
 for(const nm of names){const ws=wb.Sheets[nm];if(!ws||String(ws.C1&&ws.C1.v).replace(/\s/g,'').toUpperCase()!=='OFENSIVA')continue;
  const a=XLSX.utils.sheet_to_json(ws,{header:1,defval:null}),o=[],p=[],cnt={};
  for(let i=2;i<52;i++){const x=a[i];if(!x||!x[1])continue;const w=[x[0],x[1],...[4,5,6,7,8,9,10,11,12,13,14,15,19,29,30,31].map(j=>n(x[j]))];if(w[2]>0||w[15]+w[16]+w[17]>0){o.push(w);const t=num[x[0]];if(t)cnt[t]=(cnt[t]||0)+1}}
  for(let i=56;i<71;i++){const x=a[i];if(!x||!x[1])continue;const w=[x[0],x[1],...[2,4,5,6,7,8,9,10,11,12,13,14,15,19,20].map(j=>n(x[j]))];if(w[3]>0||w[5]>0)p.push(w)}
  if(!o.length&&!p.length)continue;
  let name=Object.keys(cnt).sort((u,v)=>cnt[v]-cnt[u])[0]||nm;if(used.has(name))name+=' ('+nm+')';used.add(name);
  const v=r=>n(ws[r]&&ws[r].v);teams.push({c:nm,n:name,t:[v('C53'),v('T72'),v('U72'),v('AB72')],o,p})}
 if(!teams.length)throw'No encontré hojas de equipo con jugadores y estadísticas en este libro';
 const J2=jn||Math.max(...teams.map(t=>t.t[0]));delete HIST[0];HIST[J2]={league:lgn||LIGAS[LID].n,teams};await kv('put','j:'+LID+':'+J2,HIST[J2]);use(J2);
 const ix={ligas:Object.entries(LIGAS).map(([id,L])=>({id,nombre:L.n,jornadas:Object.keys(L.h).map(Number).filter(n=>n>0).sort((a,b)=>a-b)}))};
  try{const pr=await fetch('/.netlify/functions/auth?a=publish',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({ligaId:LID,jornada:J2,data:HIST[J2],index:ix})});if(!pr.ok){let er='No se pudo publicar en Netlify';try{er=(await pr.json()).error||er}catch(_){}throw Error(er)}st(`Jornada ${J2} guardada y publicada: ${teams.length} equipos (${teams.map(t=>t.n).slice(0,4).join(', ')}…), ${teams.reduce((s,t)=>s+t.o.length,0)} jugadores.`)}catch(e){st('Guardada localmente, pero no publicada: '+e.message)}
 }catch(e){st('No se pudo leer: '+e)}}

const MEDIA_API='/.netlify/functions/media';
function shrink(file,max,png){return new Promise(r=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL(png?'image/png':'image/jpeg',.85))};i.src=URL.createObjectURL(file)})}
async function setImg(key,file,png){const data=await shrink(file,key[0]=='B'?1200:png?220:260,png);
 try{const r=await fetch(MEDIA_API+'?a=put',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({lid:LID,k:key,data})});const j=await r.json().catch(()=>({}));if(!r.ok)throw j.error||('error '+r.status);IM[key]=j.url;hdr();draw()}catch(e){alert('No se pudo guardar la imagen: '+e)}}
async function delImg(key){try{const r=await fetch(MEDIA_API+'?a=del',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({lid:LID,k:key})});if(!r.ok)throw'error '+r.status;delete IM[key];hdr();draw();$('#m').classList.remove('on')}catch(e){alert('No se pudo quitar la imagen: '+e)}}
function dl(j){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(HIST[j],(k,v)=>['O','P','A','B','pts','ok'].includes(k)?undefined:v)],{type:'application/json'}));a.download='j'+j+'.json';a.click()}
function dli(){const o={ligas:Object.entries(LIGAS).map(([id,L])=>({id,nombre:L.n,jornadas:Object.keys(L.h).map(Number).filter(n=>n>0).sort((a,b)=>a-b)}))},a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,1)],{type:'application/json'}));a.download='index.json';a.click()}
V.adm=function(){const t=D.teams[tm]||{O:[],P:[],c:''};
 return`<div class="card"><h3>Ligas y temporadas</h3><p class="mut" style="margin-top:0">Cada liga tiene sus propias jornadas, logos y fotos. Crea una liga para cada temporada o torneo (también para ligas pasadas) y sube sus Excel.</p><div class="g">${Object.keys(LIGAS).map(i=>`<div class="ld"><span class="n"><b>${LIGAS[i].n}</b>${i==LID?' ✓':''}<br><small>${Object.keys(LIGAS[i].h).filter(x=>x>0).length} jornadas</small></span><button class="btn s" data-lg="${i}">Ver</button>&nbsp;<button class="btn s" data-dlg="${i}">Borrar</button></div>`).join('')}</div><div class="row" style="margin-top:10px"><input type="text" id="nl" placeholder="Nueva liga (ej. XV Liga 2027)" style="min-width:240px"><button class="btn" data-nl="1">Crear liga</button><button class="btn s" data-dli="1">Descargar index.json</button></div></div>
 <div class="card"><h3>Liga actual</h3><div class="row"><input type="text" id="ln" value="${LIGAS[LID].n}" style="min-width:240px"><label class="btn s">Logo de la liga<input type="file" accept="image/*" hidden data-img="L" data-png="1"></label>${IM.L?'<button class="btn s" data-del="L">Quitar</button>':''}</div></div>
 <div class="card"><h3>Subir jornada</h3><div class="row"><input type="number" id="jn" placeholder="N.º de jornada (auto)" style="width:170px"><label class="btn">Subir Excel de la jornada<input type="file" accept=".xlsm,.xlsx" id="xl" hidden></label><span id="st" class="mut">Sube el libro actualizado después de cada jornada. Si dejas el número vacío usa los juegos jugados. Se guarda en este navegador; usa Descargar para publicarla en el sitio (ver README).</span></div><div class="g">${jk().map(j=>`<div class="ld"><span class="n"><b>Jornada ${j}</b><br><small>${HIST[j].teams.length} equipos</small></span><button class="btn s" data-j="${j}">Ver</button>&nbsp;<button class="btn s" data-dl="${j}">Descargar</button>&nbsp;<button class="btn s" data-dj="${j}">Borrar</button></div>`).join('')}</div></div>
 <div class="card"><h3>Imágenes del sitio (portadas)</h3><p class="mut" style="margin-top:0">Franja con imagen arriba de cada pantalla; solo lleva el título, no tapa números ni nombres. Tamaño recomendado 1200×300. Todas las imágenes que subes aquí las ven todos los visitantes.</p><div class="g">${[['pos','Posiciones'],['jor','Jornada'],['col','Colectivas'],['ind','Individuales'],['lid','Líderes']].map(([k,l])=>`<div class="ld">${IM['B:'+k]?`<img class="lg" style="width:64px;height:34px;object-fit:cover" src="${IM['B:'+k]}">`:''}<span class="n">${l}</span><label class="btn s">Subir<input type="file" accept="image/*" hidden data-img="B:${k}"></label>${IM['B:'+k]?`<button class="btn s" data-del="B:${k}">Quitar</button>`:''}</div>`).join('')}</div></div>
 <div class="card"><h3>Logos de equipos</h3><div class="g">${D.teams.map(x=>`<div class="ld">${lg(x.c)||'<span class="av">'+ini(x.n)+'</span>'}<span class="n">${x.n}</span><label class="btn s">Subir<input type="file" accept="image/*" hidden data-img="T:${x.c}" data-png="1"></label></div>`).join('')}</div></div>
 <div class="card"><h3>Fotos de jugadores</h3><div class="row"><select id="ts">${D.teams.map((x,i)=>`<option value="${i}" ${i==tm?'selected':''}>${x.n}</option>`).join('')}</select></div><div class="g">${t.O.map(x=>`<div class="ld">${av(x.k,x.n)}<span class="n">${x.n}</span><label class="btn s">Foto<input type="file" accept="image/*" hidden data-img="P:${x.k}"></label></div>`).join('')}</div></div>`};
document.addEventListener('click',e=>{const q=s=>e.target.closest(s);let a;
 if(a=q('[data-del]'))return delImg(a.dataset.del);
 if(a=q('[data-dli]'))return dli();if(a=q('[data-lg]'))return useLeague(a.dataset.lg);
 if(a=q('[data-nl]')){const n=($('#nl').value||'').trim();if(!n)return;let id=n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'liga';while(LIGAS[id])id+='-2';LIGAS[id]={n,h:{}};kv('put','l:'+id,{n});return useLeague(id)}
 if(a=q('[data-dlg]')){const id=a.dataset.dlg;if(Object.keys(LIGAS).length>1){(async()=>{for(const[k]of await allKeys())if(k=='l:'+id||k.startsWith('j:'+id+':')||k.startsWith('i:'+id+':'))await kv('del',k);delete LIGAS[id];delete IMS[id];useLeague(Object.keys(LIGAS)[0])})()}return}
 if(a=q('[data-dl]'))return dl(+a.dataset.dl);if(a=q('[data-j]'))return use(+a.dataset.j);if(a=q('[data-dj]')){const j=+a.dataset.dj;if(jk().length>1){delete HIST[j];kv('del','j:'+LID+':'+j);const k=jk();use(J==j?k[k.length-1]:J)}return}});
document.addEventListener('change',async e=>{const t=e.target;
 if(t.id=='ln'){LIGAS[LID].n=t.value;await kv('put','l:'+LID,{n:t.value});hdr()}
 if(t.dataset.img&&t.files[0]){const k=t.dataset.img;await setImg(k,t.files[0],!!t.dataset.png);if(k[0]=='P'&&$('#m').classList.contains('on'))prof(k.slice(2))}
 if(t.id=='xl'&&t.files[0])loadXL(t.files[0])});
};
