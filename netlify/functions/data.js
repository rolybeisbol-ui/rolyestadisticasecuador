const {connectLambda,getStore}=require('@netlify/blobs');
const store=()=>getStore('liga-pichincha-data');
const out=(code,obj,extra={})=>({statusCode:code,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra},body:JSON.stringify(obj)});
exports.handler=async ev=>{
  try{connectLambda(ev);
    const q=ev.queryStringParameters||{}, a=q.a||'index', s=store();
    if(a==='index'){
      const data=await s.get('index.json',{type:'json'});
      return data?out(200,data):out(404,{error:'No hay índice publicado'});
    }
    if(a==='jornada'){
      const id=String(q.liga||'').replace(/[^a-zA-Z0-9_-]/g,''), j=Number(q.j);
      if(!id||!Number.isInteger(j)||j<1)return out(400,{error:'Parámetros inválidos'});
      const data=await s.get(`jornadas/${id}/j${j}.json`,{type:'json'});
      return data?out(200,data):out(404,{error:'Jornada no publicada'});
    }
    return out(400,{error:'Acción no válida'});
  }catch(e){return out(500,{error:'No se pudo leer el almacenamiento público'});}
};
