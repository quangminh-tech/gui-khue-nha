import {createHmac} from 'node:crypto';
import {sessionRecord} from './session.mjs';
import {hash,randomToken,bad,cookie,encryptionKey} from './security.mjs';
export function readMobileRequest(url){const challenge=url.searchParams.get('mobile_challenge'),state=url.searchParams.get('mobile_state');if(!challenge&&!state)return null;if(!/^[A-Za-z0-9_-]{43}$/.test(challenge||'')||!/^[A-Za-z0-9_-]{32,100}$/.test(state||''))throw bad('Phiên đăng nhập trên app không hợp lệ. Mở lại app và thử lại.');return {challenge,state}}
export function verifierChallenge(verifier){if(!/^[A-Za-z0-9_-]{43,128}$/.test(verifier||''))throw bad('Phiên app không hợp lệ.',401);return Buffer.from(hash(verifier),'hex').toString('base64url')}
export async function issueMobileHandoff(db,owner,mobile){const code=randomToken();await db.collection('mobile_handoffs').insertOne({_id:hash(code),owner,challenge:mobile.challenge,expiresAt:new Date(Date.now()+600000)});return {code,state:mobile.state}}
export function mobileReturnPage(ticket){const link='guikhuenha://auth?'+new URLSearchParams(ticket);return `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Trở về Gửi Khuê Nhã</title><style>body{background:#17232a;color:#f2ecdf;font:16px/1.8 system-ui;display:grid;place-items:center;min-height:90vh;margin:0}main{max-width:440px;padding:28px;text-align:center}img{width:80px;border-radius:20px}a{display:inline-block;background:#e6bd6a;color:#18242b;padding:12px 22px;border-radius:9px;text-decoration:none}p{color:#bdcbd0}</style><main><img src="/brand/logo-app.webp" alt="Logo"><h1>Đăng nhập thành công</h1><p>Bấm nút để trở lại sổ tay trong ứng dụng.</p><a href="${link}">Trở về Gửi Khuê Nhã</a><p>Đây là bước quay về app, hiệu lực 10 phút. Sau khi đăng nhập, mở app bình thường để dùng tiếp; không cần mở lại liên kết này.</p></main></html>`}
// Production always supplies a MongoDB transaction; retries produce the SAME session.
export async function redeemMobile(req,res,db,origin,transact){
 if(typeof transact!=='function')throw bad('Chưa sẵn sàng nhận phiên đăng nhập.',503);
 let bytes='';for await(const part of req){bytes+=part.toString();if(Buffer.byteLength(bytes)>2048)throw bad('Yêu cầu quá lớn.',413)}
 const form=new URLSearchParams(bytes),code=form.get('code'),verifier=form.get('verifier');if(!/^[A-Za-z0-9_-]{43}$/.test(code||''))throw bad('Mã quay lại app không hợp lệ.',401);
 const challenge=verifierChallenge(verifier),token=createHmac('sha256',encryptionKey()).update('mobile-session-v2:'+code+':'+challenge).digest('base64url');
 await transact(async(options)=>{const now=new Date(),record=await db.collection('mobile_handoffs').findOne({_id:hash(code),challenge,expiresAt:{$gt:now}},options);
  if(!record)throw bad('Liên kết đã hết hạn. Mở sổ tay hoặc đăng nhập lại.',401);
  if(record.usedAt){if(+now-+new Date(record.usedAt)>60000||record.sessionId!==hash(token)||!await db.collection('sessions').findOne({_id:hash(token),owner:record.owner,expiresAt:{$gt:now}},options))throw bad('Liên kết đã được dùng. Mở sổ tay để tiếp tục.',401);return}
  await db.collection('sessions').insertOne(sessionRecord(record.owner,token,now).record,options);
  await db.collection('mobile_handoffs').updateOne({_id:record._id},{$set:{usedAt:now,sessionId:hash(token)}},options);
 });
 const headers={'Set-Cookie':cookie('kn_session',token,30*86400,origin),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'};
 if(req.headers?.accept?.includes('application/json')){res.writeHead(200,{...headers,'Content-Type':'application/json; charset=utf-8'});return res.end(JSON.stringify({ok:true}))}
 res.writeHead(303,{...headers,Location:'/'});res.end();
}
