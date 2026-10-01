/* Verificación de la cookie de sesión del administrador (misma lógica de auth.js, para otras funciones) */
const crypto=require('crypto');
const hash=a=>crypto.createHash('sha256').update(String(a)).digest();
const same=(a,b)=>crypto.timingSafeEqual(hash(a),hash(b));
const sign=p=>crypto.createHmac('sha256',process.env.SESSION_SECRET||'').update(p).digest('base64url');
function sessionFrom(h){if(!process.env.SESSION_SECRET)return null;const tok=((h.cookie||'').match(/(?:^|;\s*)adm=([^;]+)/)||[])[1];if(!tok)return null;
 const[p,s]=tok.split('.');if(!p||!s||!same(s,sign(p)))return null;try{const d=JSON.parse(Buffer.from(p,'base64url'));return d.exp>Date.now()?d:null}catch(e){return null}}
const sameOrigin=h=>{if(!h.origin)return true;try{return new URL(h.origin).host===h.host}catch(e){return false}};
module.exports={sessionFrom,sameOrigin};
