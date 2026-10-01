/* 05-vistas.js */
const V={
pos(){const L=[...D.teams].sort((a,b)=>b.pts-a.pts||b.t[1]-a.t[1]),pv=prevJ(J),pr=pv&&rk(pv);
 return`<div class="card"><h3>Tabla de posiciones</h3>${tbl('pos',[{h:'RK',v:r=>L.indexOf(r)+1},{h:'EQUIPO',v:r=>r.n,f:r=>lg(r.c)+r.n},{h:'JJ',v:r=>r.t[0]},{h:'G',v:r=>r.t[1]},{h:'P',v:r=>r.t[2]},{h:'E',v:r=>r.t[3]},{h:'PTS',v:r=>r.pts,f:r=>`<b>${r.pts}</b>`},{h:'AVE',v:r=>r.t[1]/(r.t[1]+r.t[2]),f:r=>f3(r.t[1]/(r.t[1]+r.t[2]))},{h:'MOV',v:r=>pr?pr.indexOf(r.c)-L.indexOf(r):0,f:r=>{const d=pr?pr.indexOf(r.c)-L.indexOf(r):0;return d>0?`<span style="color:#1a9d4a">▲${d}</span>`:d<0?`<span style="color:#d33">▼${-d}</span>`:'<span class="mut">–</span>'}}],L,r=>`data-t="${D.teams.indexOf(r)}"`)}<p class="mut">Puntos = G×3 + E (igual que la hoja TABLA). MOV = cambio de puesto frente a la jornada anterior cargada.</p></div>`},
jor(){const pv=prevJ(J),P=c=>pv&&pv.teams.find(t=>t.c==c),I=x=>x;
 const dt=D.teams.map(t=>{const q=P(t.c),a=t.t,b=q?q.t:[0,0,0,0];return{n:t.n,c:t.c,j:a[0]-b[0],g:a[1]-b[1],p:a[2]-b[2],e:a[3]-b[3],pts:t.pts-(q?q.pts:0)}});
 const m={};D.teams.forEach(t=>{const q=P(t.c);[...t.O,...t.P].forEach(x=>{const y=q&&q.O.find(z=>z.no==x.no)||{},z=q&&q.P.find(w=>w.no==x.no)||{},o=t.O.find(w=>w.no==x.no),p=t.P.find(w=>w.no==x.no),r=m[x.k]||(m[x.k]={k:x.k,n:x.n,tn:t.n,h:0,hr:0,c:0,ci:0,so:0,out:0});
  if(o){r.h=o.h-(y.h||0);r.hr=o.hr-(y.hr||0);r.c=o.c-(y.c||0);r.ci=o.ci-(y.ci||0)}if(p){r.so=p.so-(z.so||0);r.out=p.out-(z.out||0)}})});
 const R=Object.values(m),top=(t,k,fm=I)=>{const r=R.filter(x=>x[k]>0).sort((a,b)=>b[k]-a[k]).slice(0,5);return`<div class="card"><h3>${t}</h3>${r.map((x,i)=>`<div class="ld" data-p="${x.k}"><span class="rk">${i+1}</span>${av(x.k,x.n)}<span class="n">${x.n}<br><small>${x.tn}</small></span><b>${fm(x[k])}</b></div>`).join('')||'<span class="mut">Sin datos</span>'}</div>`};
 const ks=jk(),RK=ks.map(j=>rk(ens(HIST[j])));
 return`<div class="card"><h3>Jornada ${J} ${pv?'(vs jornada anterior cargada)':'(primera jornada cargada: acumulado)'}</h3>${tbl('jr',[{h:'EQUIPO',v:r=>r.n,f:r=>lg(r.c)+r.n},{h:'JUEGOS',v:r=>r.j},{h:'G',v:r=>r.g},{h:'P',v:r=>r.p},{h:'E',v:r=>r.e},{h:'PTS',v:r=>r.pts}],dt.filter(x=>x.j>0))}</div>
 <div class="g">${top('Más hits','h')}${top('Jonrones','hr')}${top('Carreras anotadas','c')}${top('Carreras impulsadas','ci')}${top('Ponches (lanzadores)','so')}${top('Entradas lanzadas','out',ip)}</div>
 <div class="card"><h3>Evolución del puesto por jornada</h3>${tbl('evo',[{h:'EQUIPO',v:r=>r.n,f:r=>lg(r.c)+r.n},...ks.map((j,i)=>({h:'J'+j,v:r=>RK[i].indexOf(r.c)+1}))],D.teams)}</div>`},
col(){const T=D.teams,sb=x=>`<div class="sub">${[['o','Ofensiva'],['p','Pitcheo'],['d','Defensa']].map(([k,l])=>`<button data-sub="${k}" class="${sub==k?'on':''}">${l}</button>`).join('')}</div>`;
 const E=(h,g,fm)=>({h,v:r=>g(r),f:fm&&(r=>fm(g(r)))}),nc={h:'EQUIPO',v:r=>r.n,f:r=>lg(r.c)+r.n},pj={h:'JJ',v:r=>r.t[0]};
 const C={o:[nc,pj,...['vb','c','h','d2','d3','hr','tb','ci','bb','so'].map(k=>E(k.toUpperCase().replace('D2','2B').replace('D3','3B'),r=>r.A[k])),E('AVE',r=>r.A.ave,f3),E('OBP',r=>r.A.obp,f3),E('SLU',r=>r.A.slu,f3),E('OPS',r=>r.A.ops,f3)],
 p:[nc,pj,E('ENT',r=>r.B.out,ip),E('HP',r=>r.B.hp),E('CP',r=>r.B.cp),E('CL',r=>r.B.cl),E('SO',r=>r.B.so),E('BB',r=>r.B.bb),E('HR',r=>r.B.hr),E('PCL',r=>r.B.pcl,f2),E('WHIP',r=>r.B.whip,f2),E('AVE',r=>r.B.ave,f3)],
 d:[nc,pj,E('O',r=>r.A.O),E('A',r=>r.A.A),E('E',r=>r.A.E),E('TL',r=>r.A.O+r.A.A+r.A.E),E('AVE',r=>r.A.dav,f3)]};
 return sb()+`<div class="card">${tbl('col'+sub,C[sub],T,r=>`data-t="${T.indexOf(r)}"`)}</div>`},
ind(){const t=D.teams[tm];const sel=`<div class="row"><select id="ts">${D.teams.map((x,i)=>`<option value="${i}" ${i==tm?'selected':''}>${x.n}</option>`).join('')}</select><span class="mut">${lg(t.c)}Toca un jugador para ver su perfil</span></div>`;
 const sb=`<div class="sub">${[['o','Ofensiva'],['p','Pitcheo'],['d','Defensa']].map(([k,l])=>`<button data-sub="${k}" class="${sub==k?'on':''}">${l}</button>`).join('')}</div>`;
 const C={o:[{h:'JUGADOR',v:r=>r.n,f:nm},N('CB','cb'),N('VB','vb'),N('C','c'),N('H','h'),N('2B','d2'),N('3B','d3'),N('HR','hr'),N('TB','tb'),N('CI','ci'),N('BB','bb'),N('SO','so'),N('AVE','ave',f3),N('OBP','obp',f3),N('SLU','slu',f3),N('OPS','ops',f3)],
 p:[{h:'LANZADOR',v:r=>r.n,f:nm},N('JL','jl'),{h:'ENT',v:r=>r.out,f:r=>ip(r.out)},N('VB','vb'),N('HP','hp'),N('CP','cp'),N('CL','cl'),N('SO','so'),N('BB','bb'),N('JG','jg'),N('JP','jp'),N('PCL','pcl',f2),N('WHIP','whip',f2),N('AVE','ave',f3)],
 d:[{h:'JUGADOR',v:r=>r.n,f:nm},N('O','O'),N('A','A'),N('E','E'),N('TL','TL'),N('AVE','dav',f3)]};
 return sel+sb+`<div class="card">${tbl('i'+sub+tm,C[sub],sub=='p'?t.P:t.O,pa)}</div>`},
lid(){const mk=(t,l)=>`<div class="card"><h3>${t}</h3>${l}</div>`;
 const cfg=`<div class="row mut">Mínimos para promedios: CB <input type="number" id="mb" value="${CFG.mb}" style="width:64px"> · Entradas <input type="number" id="mi" value="${CFG.mi}" style="width:64px"> · TL <input type="number" id="mt" value="${CFG.mt}" style="width:64px"></div>`;
 const P=players(),L=D.teams.flatMap(t=>t.P.map(x=>({...x,tn:t.n})));
 const card=(t,rows,k,fm,asc,sec)=>{const r=rows.filter(x=>isFinite(x[k])).sort((a,b)=>asc?a[k]-b[k]:b[k]-a[k]).slice(0,10);
  return`<div class="card"><h3>${t}</h3>${r.map((x,i)=>`<div class="ld" data-p="${x.k}"><span class="rk">${i+1}</span>${av(x.k,x.n)}<span class="n">${x.n}<br><small>${x.tn}</small></span><b>${fm(x[k])}</b></div>`).join('')||'<span class="mut">Sin datos</span>'}</div>`};
 const q=P.filter(x=>x.cb>=CFG.mb),qp=L.filter(x=>x.out/3>=CFG.mi),qd=P.filter(x=>x.TL>=CFG.mt),I=x=>x;
 const sb=`<div class="sub">${[['o','Ofensiva'],['p','Pitcheo'],['d','Defensa']].map(([k,l])=>`<button data-sub="${k}" class="${sub==k?'on':''}">${l}</button>`).join('')}</div>`;
 const G={o:[card('Promedio de bateo',q,'ave',f3),card('Carreras anotadas',P,'c',I),card('Carreras impulsadas',P,'ci',I),card('Hits',P,'h',I),card('Dobles',P,'d2',I),card('Triples',P,'d3',I),card('Jonrones',P,'hr',I),card('Slugging',q,'slu',f3),card('OBP',q,'obp',f3),card('OPS',q,'ops',f3),card('Bases por bolas',P,'bb',I)],
 p:[card('Entradas lanzadas',L,'out',ip),card('Ponches propinados',L,'so',I),card('Juegos ganados',L,'jg',I),card('Promedio G-P',qp,'pgp',f3),card('Prom. carreras limpias (menor)',qp,'pcl',f2,1),card('AVE permitido (menor)',qp,'ave',f3,1),card('WHIP (menor)',qp,'whip',f2,1)],
 d:[card('Outs',P,'O',I),card('Asistencias',P,'A',I),card('Errores',P,'E',I),card('Total de lances',P,'TL',I),card('AVE defensivo',qd,'dav',f3)]};
 return cfg+sb+`<div class="g">${G[sub].join('')}</div>`},
};
const TABS=[['pos','Posiciones'],['jor','Jornada'],['col','Colectivas'],['ind','Individuales'],['lid','Líderes']];
function useLeague(id){LID=id;const L=LIGAS[id];HIST=L.h;IM=IMS[id]||(IMS[id]={});if(!jk().length)HIST[0]={league:L.n,teams:[]};kv('put','cur',id);tm=0;const k=jk();use(k[k.length-1])}
function draw(){$('#nav').innerHTML=TABS.map(([k,l])=>`<button data-v="${k}" class="${view==k?'on':''}">${l}</button>`).join('');$('#v').innerHTML=(!D.teams.length&&view!='adm')?'<div class="card">Esta liga todavía no tiene datos publicados.</div>':hero(view)+V[view]()}
function prof(k){const{t,o,p}=byKey(k),n=(o||p).n,kv=(a)=>`<div class="kv">${a.map(([l,v])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>`;
 $('#m').innerHTML=`<div><div class="row">${av(k,n,'ph')}<div style="flex:1"><h2 style="margin:0">${n}</h2><div>${lg(t.c)}${t.n} · #${(o||p).no}</div><div class="row" style="margin:8px 0 0">${window.ADM?`<label class="btn s">Cambiar foto<input type="file" accept="image/*" hidden data-img="P:${k}"></label>${IM['P:'+k]?`<button class="btn s" data-del="P:${k}">Quitar</button>`:''}`:''}<button class="btn s" data-x="1">Cerrar</button></div></div></div>
 ${o?'<h3>Ofensiva</h3>'+kv([['AVE',f3(o.ave)],['OBP',f3(o.obp)],['SLU',f3(o.slu)],['OPS',f3(o.ops)],['VB',o.vb],['H',o.h],['2B',o.d2],['3B',o.d3],['HR',o.hr],['C',o.c],['CI',o.ci],['BB',o.bb],['SO',o.so]]):''}
 ${p?'<h3>Pitcheo</h3>'+kv([['ENT',ip(p.out)],['G-P',p.jg+'-'+p.jp],['PCL',f2(p.pcl)],['WHIP',f2(p.whip)],['AVE',f3(p.ave)],['SO',p.so],['BB',p.bb],['HP',p.hp]]):''}
 ${o?'<h3>Defensa</h3>'+kv([['O',o.O],['A',o.A],['E',o.E],['TL',o.TL],['AVE',f3(o.dav)]]):''}</div>`;$('#m').classList.add('on')}
