import {randomToken,hash,cookie,cookies,bad} from './security.mjs';
const DAY=86400000;
export function sessionRecord(owner,token=randomToken(),now=new Date()){return {token,record:{_id:hash(token),owner,createdAt:now,absoluteExpiresAt:new Date(+now+90*DAY),expiresAt:new Date(+now+30*DAY)}}}
export async function renewSession(req,res,db,origin,now=new Date()){
 const token=cookies(req).kn_session;if(!token)throw bad('Đăng nhập để tiếp tục.',401);
 const record=await db.collection('sessions').findOne({_id:hash(token),expiresAt:{$gt:now}});if(!record)throw bad('Phiên đăng nhập đã hết hạn.',401);
 const absolute=record.absoluteExpiresAt?new Date(record.absoluteExpiresAt):new Date(+(record.createdAt?new Date(record.createdAt):now)+90*DAY);
 if(+absolute<=+now)throw bad('Phiên đăng nhập đã hết hạn. Kết nối Google lại.',401);
 const expires=new Date(Math.min(+absolute,+now+30*DAY));
 if(+new Date(record.expiresAt)<+expires-DAY)await db.collection('sessions').updateOne({_id:record._id,expiresAt:{$gt:now}},{$set:{expiresAt:expires,absoluteExpiresAt:absolute,createdAt:record.createdAt||now}});
 const effective=+new Date(record.expiresAt)>=+expires-DAY?new Date(record.expiresAt):expires;
 res.setHeader('Set-Cookie',cookie('kn_session',token,Math.max(0,Math.floor((Math.min(+effective,+absolute)-+now)/1000)),origin));return {ok:true,expiresAt:effective.toISOString()};
}
