/* Autenticación del administrador (Netlify Function, sin dependencias).
   Variables de entorno: ADMIN_USER, ADMIN_PASS_HASH (ver tools/hash-password.js), SESSION_SECRET.
   Acciones:  POST ?a=login  ·  GET ?a=me  ·  POST ?a=logout  ·  GET ?a=asset (código del panel, solo con sesión). */
const crypto=require('crypto');
const {connectLambda,getStore}=require('@netlify/blobs');
const TTL=8*3600; // duración de la sesión en segundos
const b64=s=>Buffer.from(s).toString('base64url');
const sign=p=>crypto.createHmac('sha256',process.env.SESSION_SECRET).update(p).digest('base64url');
const same=(a,b)=>{const x=crypto.createHash('sha256').update(String(a)).digest(),y=crypto.createHash('sha256').update(String(b)).digest();return crypto.timingSafeEqual(x,y)};
const mk=u=>{const p=b64(JSON.stringify({u,exp:Date.now()+TTL*1000}));return p+'.'+sign(p)};
function check(tok){if(!tok)return null;const[p,s]=tok.split('.');if(!p||!s||!same(s,sign(p)))return null;try{const d=JSON.parse(Buffer.from(p,'base64url'));return d.exp>Date.now()?d:null}catch(e){return null}}
function passOk(pass,stored){const[kind,salt,hash]=String(stored).split('$');if(kind!=='scrypt'||!salt||!hash)return false;const k=crypto.scryptSync(pass,salt,32),h=Buffer.from(hash,'hex');return h.length===k.length&&crypto.timingSafeEqual(k,h)}
const out=(code,obj,extra={})=>({statusCode:code,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...extra},body:JSON.stringify(obj)});
const blobStore=()=>getStore('liga-pichincha-data');
const safeId=s=>String(s||'').replace(/[^a-zA-Z0-9_-]/g,'');
const parseBody=ev=>{try{return JSON.parse(ev.body||'{}')}catch(e){return null}};
exports.handler=async ev=>{
 if(ev.blobs)connectLambda(ev);
 if(!process.env.ADMIN_USER||!process.env.ADMIN_PASS_HASH||!process.env.SESSION_SECRET)return out(500,{error:'Faltan las variables de entorno del administrador'});
 const a=(ev.queryStringParameters||{}).a,h=ev.headers||{},tok=((h.cookie||'').match(/(?:^|;\s*)adm=([^;]+)/)||[])[1];
 const sec=/^(localhost|127\.0\.0\.1)/.test(h.host||'')?'':' Secure';
 const ck=v=>`adm=${v}; HttpOnly;${sec} SameSite=Strict; Path=/; Max-Age=${v?TTL:0}`;
 if(a==='login'&&ev.httpMethod==='POST'){let b={};try{b=JSON.parse(ev.body||'{}')}catch(e){}
  const ok=typeof b.u==='string'&&typeof b.p==='string'&&same(b.u,process.env.ADMIN_USER)&&passOk(b.p,process.env.ADMIN_PASS_HASH);
  if(!ok){await new Promise(r=>setTimeout(r,900));return out(401,{error:'Usuario o contraseña incorrectos'})}
  return out(200,{ok:true},{'Set-Cookie':ck(mk(b.u))})}
 if(a==='logout')return out(200,{ok:true},{'Set-Cookie':ck('')});
 const s=check(tok);
 if(a==='me')return out(200,{admin:!!s});
 if(a==='asset'){if(!s)return out(401,{error:'No autorizado'});
  return{statusCode:200,headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'},body:'('+require('../lib/admin.js').toString()+')()'}}
 if(a==='publish'){
  if(!s)return out(401,{error:'No autorizado'});
  if(ev.httpMethod!=='POST')return out(405,{error:'Método no permitido'});
  const b=parseBody(ev);
  if(!b||!b.ligaId||!b.jornada||!b.data)return out(400,{error:'Faltan ligaId, jornada o data'});
  const id=safeId(b.ligaId),j=Number(b.jornada);
  if(!id||!Number.isInteger(j)||j<1||j>999||typeof b.data!=='object')return out(400,{error:'Datos de publicación inválidos'});
  const store=blobStore();
  await store.setJSON(`jornadas/${id}/j${j}.json`,b.data,{metadata:{updatedAt:new Date().toISOString(),by:s.u}});
  if(b.index&&typeof b.index==='object')await store.setJSON('index.json',b.index,{metadata:{updatedAt:new Date().toISOString(),by:s.u}});
  return out(200,{ok:true,ligaId:id,jornada:j,publicado:true});
 }
 return out(400,{error:'Acción no válida'})};
