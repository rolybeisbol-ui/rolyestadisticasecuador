/* Fotos de jugadores, logos y portadas: lectura pública, escritura solo con sesión de administrador.
   Se guardan en Netlify Blobs (mismo almacén que las jornadas). En local (sin Netlify) usa la carpeta .localblobs */
const crypto=require('crypto'),fs=require('fs'),path=require('path'),{sessionFrom,sameOrigin}=require('../lib/session.js');
let blobs=null;try{blobs=require('@netlify/blobs')}catch(e){}
function open(ev){
 if(blobs&&ev.blobs){blobs.connectLambda(ev);const s=blobs.getStore('liga-pichincha-data');
  return{json:k=>s.get(k,{type:'json'}),setJson:(k,v)=>s.setJSON(k,v),
   bin:async k=>{const b=await s.get(k,{type:'arrayBuffer'});return b?Buffer.from(b):null},
   setBin:(k,b)=>s.set(k,b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),del:k=>s.delete(k)}}
 const d=path.join(process.cwd(),'.localblobs'),f=k=>path.join(d,Buffer.from(k).toString('hex'));fs.mkdirSync(d,{recursive:true});
 const rd=k=>fs.existsSync(f(k))?fs.readFileSync(f(k)):null;
 return{json:async k=>{const b=rd(k);return b?JSON.parse(b):null},setJson:async(k,v)=>fs.writeFileSync(f(k),JSON.stringify(v)),bin:async k=>rd(k),setBin:async(k,b)=>fs.writeFileSync(f(k),b),del:async k=>{try{fs.unlinkSync(f(k))}catch(e){}}}}
const out=(c,o,x={})=>({statusCode:c,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...x},body:JSON.stringify(o)});
const KEY=/^(L|B:[a-z]{3}|T:[\p{L}\p{N}_.-]{1,30}|P:[\p{L}\p{N}_.-]{1,30}\|[\p{L}\p{N}_.-]{1,10})$/u,LIDR=/^[a-z0-9-]{1,60}$/;
const idOf=(l,k)=>crypto.createHash('sha1').update(l+'|'+k).digest('hex'),IX='media/index.json';
exports.handler=async ev=>{try{
 const q=ev.queryStringParameters||{},h=ev.headers||{},st=open(ev);
 if(ev.httpMethod==='GET'){
  if(q.a==='list'){const ix=(await st.json(IX))||{};return out(200,{items:Object.entries(ix).map(([id,m])=>({id,lid:m.lid,k:m.k,t:m.t}))},{'Cache-Control':'no-cache'})}
  if(/^[a-f0-9]{40}$/.test(q.id||'')){const ix=(await st.json(IX))||{},m=ix[q.id],b=m&&await st.bin('media/'+q.id);if(!b)return{statusCode:404,body:'No encontrado'};
   return{statusCode:200,isBase64Encoded:true,headers:{'Content-Type':m.m,'Cache-Control':'public, max-age=31536000, immutable'},body:b.toString('base64')}}
  return out(400,{error:'Solicitud no válida'})}
 if(ev.httpMethod!=='POST')return out(405,{error:'Método no permitido'});
 if(!sameOrigin(h)||!sessionFrom(h))return out(401,{error:'No autorizado'});
 let b={};try{b=JSON.parse(ev.body||'{}')}catch(e){}
 if(!LIDR.test(b.lid||'')||!KEY.test(b.k||''))return out(400,{error:'Datos no válidos'});
 const id=idOf(b.lid,b.k),ix=(await st.json(IX))||{};
 if(q.a==='put'){const m=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(b.data||'');if(!m)return out(400,{error:'Imagen no válida'});
  const buf=Buffer.from(m[2],'base64');if(buf.length>1500000)return out(413,{error:'La imagen es demasiado grande'});
  await st.setBin('media/'+id,buf);const t=Date.now();ix[id]={lid:b.lid,k:b.k,t,m:m[1]};await st.setJson(IX,ix);
  return out(200,{ok:true,url:`/.netlify/functions/media?id=${id}&v=${t}`})}
 if(q.a==='del'){await st.del('media/'+id);delete ix[id];await st.setJson(IX,ix);return out(200,{ok:true})}
 return out(400,{error:'Acción no válida'})
}catch(e){return out(500,{error:'Error en el almacenamiento de imágenes'})}};
