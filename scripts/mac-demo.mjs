// Portable local demo. Only Node built-ins; never reads .env or connects to Mongo/Google.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
const root=fileURLToPath(new URL('../apps/web/dist/',import.meta.url));
const port=Number(process.env.DEMO_PORT||3000);
if(!Number.isInteger(port)||port<1024||port>65535){console.error('DEMO_PORT phải từ 1024 đến 65535.');process.exit(1)}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.wav':'audio/wav'};
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value))}
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),path=decodeURIComponent(url.pathname);
  if(!['GET','HEAD'].includes(req.method))return json(res,401,{error:'Bản demo lưu trên trình duyệt. Chưa kết nối tài khoản/backend thật.'});
  if(path==='/api/config')return json(res,200,{runtime:'node',googleConfigured:false,googlePickerConfigured:false,aiKeyPersistence:false,aiConfigured:false,setup:{missing:['MONGODB_URI','APP_ENCRYPTION_KEY','GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET'],database:false,oauth:false,encryption:false,picker:false}});
  if(path==='/api/health')return json(res,200,{status:'demo-only',storage:'browser-local'});
  if(path.startsWith('/api/'))return json(res,401,{error:'Demo trên thiết bị; chưa đăng nhập dịch vụ bên ngoài.'});
  if(path.startsWith('/auth/')||path.startsWith('/signin-with-chatgpt'))return json(res,409,{error:'Chạy chế độ dev và cấu hình Google/MongoDB trước khi đăng nhập.'});
  let filename=resolve(root,'.'+path);
  if(filename!==root.slice(0,-1)&&!filename.startsWith(root.endsWith(sep)?root:root+sep))return json(res,403,{error:'Forbidden'});
  if(path==='/'||!extname(path))filename=resolve(root,'index.html');
  let bytes;try{bytes=await readFile(filename)}catch{return json(res,404,{error:'Không tìm thấy file. Hãy giải nén toàn bộ project.'})}
  res.writeHead(200,{'Content-Type':mime[extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{json(res,400,{error:'Bad request'})}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Cổng ${port} đang bận. Thử: DEMO_PORT=3010 bash RUN-MAC.sh`:error.message);process.exitCode=1});
server.listen(port,'127.0.0.1',()=>console.log(`\nGửi Khuê Nhã — demo trên máy\nMở http://localhost:${port}\nDữ liệu thử lưu trong trình duyệt, không cần MongoDB/Google/API key.\nGiữ Terminal mở; Ctrl+C để dừng.\n`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
