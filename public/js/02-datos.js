/* 02-datos.js */
function prep(){D.teams.forEach(t=>{
 t.O=t.o.map(a=>{const[no,n,cb,vb,c,h,d2,d3,hr,tb,ci,sf,bb,bi,so,O,A,E]=a,TL=O+A+E;return{k:t.c+'|'+no,no,n,t:t.c,cb,vb,c,h,d2,d3,hr,tb,ci,sf,bb,bi,so,O,A,E,TL,ave:h/vb,obp:(h+bb)/(vb+bb+sf),slu:tb/vb,ops:(h+bb)/(vb+bb+sf)+tb/vb,dav:(O+A)/TL}});
 t.P=t.p.map(a=>{const[no,n,jl,out,vb,be,hp,cp,cl,so,bb,d2,d3,hr,bi,jg,jp]=a;return{k:t.c+'|'+no,no,n,t:t.c,jl,out,vb,be,hp,cp,cl,so,bb,hr,jg,jp,pgp:jg/(jg+jp),pcl:cl*21/out,whip:(hp+bb)*3/out,ave:hp/vb,kbb:so/bb}});
 const S=(L,k)=>L.reduce((a,x)=>a+(x[k]||0),0),o=t.O,p=t.P;
 t.A={};['cb','vb','c','h','d2','d3','hr','tb','ci','sf','bb','so','O','A','E'].forEach(k=>t.A[k]=S(o,k));
 const A=t.A;A.ave=A.h/A.vb;A.obp=(A.h+A.bb)/(A.vb+A.bb+A.sf);A.slu=A.tb/A.vb;A.ops=A.obp+A.slu;A.dav=(A.O+A.A)/(A.O+A.A+A.E);
 t.B={};['out','vb','be','hp','cp','cl','so','bb','hr'].forEach(k=>t.B[k]=S(p,k));const B=t.B;B.pcl=B.cl*21/B.out;B.whip=(B.hp+B.bb)*3/B.out;B.ave=B.hp/B.vb;
 t.pts=t.t[1]*3+t.t[3]});
 $('#ht').textContent=LIGAS[LID]?LIGAS[LID].n:D.league}
const jk=()=>Object.keys(HIST).map(Number).sort((a,b)=>a-b),ens=d=>{if(!d.ok){const s=D;D=d;prep();D=s;d.ok=1}return d},rk=d=>[...d.teams].sort((a,b)=>b.pts-a.pts||b.t[1]-a.t[1]).map(t=>t.c);
const prevJ=j=>{const k=jk().filter(x=>x<j);return k.length?ens(HIST[k[k.length-1]]):null};
function use(j){J=j;ens(HIST[j]);D=HIST[j];hdr();draw()}
const players=()=>D.teams.flatMap(t=>t.O.map(x=>({...x,tn:t.n})));
const byKey=k=>{const[c,no]=k.split('|'),t=D.teams.find(t=>t.c==c);return{t,o:t.O.find(x=>x.no==no),p:t.P.find(x=>x.no==no)}};
