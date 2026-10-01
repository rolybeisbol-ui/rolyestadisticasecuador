/* Servidor local con la función de login:  node tools/dev-server.js   (lee las variables de .env) */
const http=require('http'),fs=require('fs'),path=require('path');
try{fs.readFileSync(path.join(__dirname,'..','.env'),'utf8').split('\n').forEach(l=>{const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')})}catch(e){}
const fns=n=>require('../netlify/functions/'+n+'.js').handler,root=path.join(__dirname,'..','public'),T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{const u=new URL(req.url,'http://x');
 const fm=u.pathname.match(/^\/\.netlify\/functions\/(auth|media|data)$/);
 if(fm){let b='';for await(const c of req)b+=c;let r;try{r=await fns(fm[1])({httpMethod:req.method,queryStringParameters:Object.fromEntries(u.searchParams),headers:req.headers,body:b})}catch(e){r={statusCode:500,headers:{},body:'error local: '+e.message}}res.writeHead(r.statusCode,r.headers||{});return res.end(r.isBase64Encoded?Buffer.from(r.body,'base64'):r.body)}
 const f=path.join(root,u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('No encontrado')}
 res.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)
}).listen(process.env.PORT||8888,()=>console.log('http://localhost:'+(process.env.PORT||8888)));
