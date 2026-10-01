/* 08-inicio.js */
(async()=>{
 try{
  let ix=null;
  try{ix=await(await fetch('/.netlify/functions/data?a=index',{cache:'no-store'})).json()}catch(e){}
  if(!ix||!Array.isArray(ix.ligas))ix=await(await fetch('data/index.json',{cache:'no-store'})).json();
  for(const l of ix.ligas){const h={};LIGAS[l.id]={n:l.nombre,h};for(const j of l.jornadas){let d=null;try{d=await(await fetch(`/.netlify/functions/data?a=jornada&liga=${encodeURIComponent(l.id)}&j=${j}`,{cache:'no-store'})).json();if(d&&d.error)d=null}catch(e){}if(!d)d=await(await fetch(`data/${l.id}/j${j}.json`,{cache:'no-store'})).json();h[j]=d}}
 }catch(e){console.warn('Sin datos publicados:',e)}
 const all=await allKeys();
 for(const[k,v]of all)if(k.startsWith('l:')){const id=k.slice(2);(LIGAS[id]=LIGAS[id]||{n:v.n,h:{}}).n=v.n}
 for(const[k,v]of all){const p=k.split(':'),id=p[1];if(!LIGAS[id])continue;if(p[0]=='j')LIGAS[id].h[+p[2]]=v}
 try{const m=await(await fetch(MEDIA+'?a=list',{cache:'no-store'})).json();for(const x of m.items||[])(IMS[x.lid]=IMS[x.lid]||{})[x.k]=`${MEDIA}?id=${x.id}&v=${x.t}`}catch(e){}
 if(!Object.keys(LIGAS).length)LIGAS.liga={n:'Mi liga',h:{}};
 const c=await kv('get','cfg');if(c)CFG=c;const cur=await kv('get','cur');
 useLeague(LIGAS[cur]?cur:Object.keys(LIGAS)[0]);
 checkSession();
})();
