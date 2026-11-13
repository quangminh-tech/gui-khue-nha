import {renewSession} from './session.mjs';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {connectMongo,database,withMongoTransaction,getWorkspace,saveWorkspace,claimAiUsage} from './store.mjs';
import {bodyJson,json,bad,cookies,cookie,hash,safeEqual,encrypt,encryptionKey} from './security.mjs';
import {googleConfigured,pickerConfigured,currentUser,beginGoogle,finishGoogle,googleStatus,googleToken,selectFiles,thumbnail,syncCalendar,disconnectGoogle} from './google.mjs';
import {dataSchema} from '../../../lib/journal-schema.ts';
import {workspaceRelationshipError} from '../../../server/services/workspace-validation.ts';
import {generateGemini,safeAiContext} from '../../../shared/ai.mjs';
import {decrypt} from './security.mjs';
import {cleanup} from './retention.mjs';
import {createCalendarSync} from './calendar-sync.mjs';
import {androidSnapshot} from '../../../shared/android-snapshot.mjs';
import {redeemMobile} from './mobile-auth.mjs';
import {googleSetup,googleAuthErrorPage} from '../../../shared/google-connect.mjs';
const origin=process.env.APP_ORIGIN||'http://localhost:3000',port=Number(process.env.PORT||3001),publicDir=resolve(fileURLToPath(new URL('../../web/dist/',import.meta.url)));
if(process.env.APP_ENCRYPTION_KEY)encryptionKey();
let connected=false;try{connected=!!await connectMongo()}catch{console.error('MongoDB connection failed. Check private environment variables and Atlas Network Access.');process.exit(1)}
const calendar=createCalendarSync({db:database,getWorkspace,saveWorkspace,googleToken});
const server=createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');const url=new URL(req.url||'/',origin),path=url.pathname;
 try{
  if(path==='/api/health'){if(connected)await database().command({ping:1});return json(res,200,{status:connected?'ready':'demo-only',storage:connected?'mongodb':'unconfigured',googleConfigured:googleConfigured()})}
  if(path==='/api/config')return json(res,200,{runtime:'node',release:'1.7.7',schedulingVersion:1,commit:process.env.RENDER_GIT_COMMIT?.slice(0,12)||null,mobileAuthVersion:2,calendarSyncVersion:2,widgetSyncVersion:2,googleConfigured:googleConfigured(),googlePickerConfigured:pickerConfigured(),aiKeyPersistence:connected&&!!process.env.APP_ENCRYPTION_KEY,aiConfigured:true,setup:googleSetup()});
  if(path==='/auth/mobile/redeem'&&req.method==='POST'){if(!connected)throw bad('Backend chưa nối MongoDB.',503);return await redeemMobile(req,res,database(),origin,withMongoTransaction)}
  if(path==='/auth/google'&&req.method==='GET')return await beginGoogle(req,res,url);
  if(path==='/auth/google/callback'&&req.method==='GET')return await finishGoogle(req,res,url);
  if(path==='/api/maintenance/retention'){if(req.method!=='POST')throw bad('POST required.',405);if(!process.env.MAINTENANCE_TOKEN||!safeEqual(req.headers.authorization||'','Bearer '+process.env.MAINTENANCE_TOKEN))throw bad('Unauthorized.',401);const body=await bodyJson(req,2000);if(body.action!=='purge-completed-10-days')throw bad('Explicit cleanup action required.');return json(res,200,await cleanup())}
  if(path.startsWith('/api/')){
   if(req.method!=='GET'&&req.headers.origin!==origin)throw bad('Yêu cầu khác nguồn không được chấp nhận.',403);
   const user=connected?await currentUser(req):null;if(!user)throw bad('Đăng nhập Google để lưu vào tài khoản.',401);
   if(path==='/api/android/snapshot'&&req.method==='GET'){const w=await getWorkspace(user._id);return json(res,200,androidSnapshot(w.data?.tasks||[],{...w.data?.settings,name:w.data?.settings?.name||user.name}))}
   if(path==='/api/google/calendar/deletions'&&req.method==='POST')return json(res,200,await calendar.sync(user._id,{deletionsOnly:true}));
   if(path==='/api/google/calendar/status'&&req.method==='GET')return json(res,200,await calendar.status(user._id));
   if(path==='/api/google/calendar/two-way'&&req.method==='POST'){const body=await bodyJson(req,2000);if(typeof body.enabled==='boolean')await calendar.configure(user._id,body.enabled);return json(res,200,body.enabled===false?await calendar.status(user._id):await calendar.sync(user._id))}
   if(path==='/api/auth/session'&&req.method==='POST')return json(res,200,await renewSession(req,res,database(),origin));
   if(path==='/api/me'&&req.method==='GET')return json(res,200,{id:user._id,name:user.name,email:user.email});
   if(path==='/api/auth/logout'&&req.method==='POST'){await database().collection('sessions').deleteOne({_id:hash(cookies(req).kn_session||'')});res.setHeader('Set-Cookie',cookie('kn_session','',0,origin));return json(res,200,{ok:true})}
   if(path==='/api/workspace'){
    if(req.method==='GET')return json(res,200,await getWorkspace(user._id));
    if(req.method==='POST'){const input=await bodyJson(req),parsed=dataSchema.safeParse(input.data);if(!parsed.success||!Number.isSafeInteger(input.version)||input.version<0)throw bad('Thông tin công việc hoặc cài đặt không hợp lệ.');const relationError=workspaceRelationshipError(parsed.data);if(relationError)throw bad(relationError);const version=await saveWorkspace(user._id,parsed.data,input.version,input.calendarDeleteIds||[],input.calendarKeepIds||[]);return json(res,200,{version,data:parsed.data})}
   }
   if(path==='/api/google/status'&&req.method==='GET')return json(res,200,await googleStatus(user));
   if(path==='/api/google/picker-token'&&req.method==='POST'){if(!pickerConfigured())throw bad('Chưa cấu hình Google Picker trong backend.',503);return json(res,200,{accessToken:await googleToken(user._id,'https://www.googleapis.com/auth/drive.file'),pickerKey:process.env.GOOGLE_PICKER_API_KEY,appId:process.env.GOOGLE_CLOUD_PROJECT_NUMBER})}
   if(path==='/api/google/files/select'&&req.method==='POST'){const body=await bodyJson(req,10000);return json(res,200,{files:await selectFiles(user._id,body.ids)})}
   const imageMatch=path.match(/^\/api\/google\/files\/([a-zA-Z0-9_-]+)\/thumbnail$/);if(imageMatch&&req.method==='GET'){const image=await thumbnail(user._id,imageMatch[1]);res.writeHead(200,{'Content-Type':image.type,'Cache-Control':'private, no-store'});return res.end(image.bytes)}
   if(path==='/api/google/calendar/sync'&&req.method==='POST'){const body=await bodyJson(req,20000);if(typeof body.task?.id!=='string')throw bad('Thiếu công việc.');return json(res,200,await syncCalendar(user._id,body.task.id))}
   if(path==='/api/google/disconnect'&&req.method==='POST'){await disconnectGoogle(user._id);return json(res,200,{ok:true})}
   if(path==='/api/ai/key'){
    if(!process.env.APP_ENCRYPTION_KEY)throw bad('Backend chưa có khóa mã hóa.',503);
    if(req.method==='POST'){const {key}=await bodyJson(req,2000);if(typeof key!=='string'||key.length<10||key.length>400)throw bad('API key không hợp lệ.');await database().collection('ai_keys').updateOne({_id:user._id},{$set:{key:encrypt(key),updatedAt:new Date()}},{upsert:true});return json(res,200,{ok:true})}
    if(req.method==='DELETE'){await database().collection('ai_keys').deleteOne({_id:user._id});return json(res,200,{ok:true})}
   }
   if(path==='/api/ai/chat'&&req.method==='POST'){
    const input=await bodyJson(req,30000),workspace=await getWorkspace(user._id),settings=workspace.data?.settings;
    if(!settings?.aiEnabled||settings.aiProvider!=='gemini')throw bad('Bật Gemini trong Cài đặt và lưu trước khi hỏi.');
    const record=await database().collection('ai_keys').findOne({_id:user._id});if(!record)throw bad('Thêm API key trong Cài đặt.');
    if(!await claimAiUsage(user._id,settings.aiDailyLimit||20))throw bad('Đã chạm giới hạn Gemini hôm nay.',429);
    const context=settings.aiShareTasks?safeAiContext(workspace.data.tasks):[];const text=await generateGemini({key:decrypt(record.key),model:settings.aiModel,message:input.message,context,history:Array.isArray(input.history)?input.history:[]});return json(res,200,{text});
   }
   throw bad('Endpoint không tồn tại.',404);
  }
  if(!['GET','HEAD'].includes(req.method))throw bad('Method not allowed.',405);
  const decoded=decodeURIComponent(path),file=resolve(publicDir,'.'+decoded);if(file!==publicDir&&!file.startsWith(publicDir+sep))throw bad('Forbidden.',403);let target=file;try{if(!(await stat(target)).isFile())target=resolve(publicDir,'index.html')}catch{target=resolve(publicDir,'index.html')}
  let bytes;try{bytes=await readFile(target)}catch{throw bad('Chưa build frontend. Chạy npm run build:web trước.',503)}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':extname(target)==='.html'?'no-cache':'public,max-age=3600'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch(e){if(res.headersSent)return res.end();const status=e.status||400;if(path==='/auth/mobile/redeem'&&req.headers.accept?.includes('application/json'))return json(res,status,{error:status>=500?'Máy chủ tạm thời chưa nhận được phiên. Hãy thử lại.':e.message});if(path.startsWith('/auth/google')||path==='/auth/mobile/redeem'){res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(googleAuthErrorPage(status>=500?'Máy chủ chưa sẵn sàng. Chủ app cần kiểm tra cấu hình Google và MongoDB trên Render.':e.message||'Phiên kết nối hết hạn. Hãy thử lại.'))}if(status>=500)console.error('Request failed:',path,'status',status);json(res,status,{error:status>=500?'Dịch vụ chưa sẵn sàng. Kiểm tra cấu hình backend.':e.message||'Yêu cầu chưa thành công.'})}
});
server.requestTimeout=45000;server.headersTimeout=15000;server.listen(port,'0.0.0.0',()=>console.log(`Gui Khue Nha API listening on ${port}; storage=${connected?'mongodb':'demo-only'}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
