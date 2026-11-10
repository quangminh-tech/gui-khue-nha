import {createCipheriv,createDecipheriv,randomBytes,createHash,timingSafeEqual} from 'node:crypto';
export const hash=value=>createHash('sha256').update(value).digest('hex');
export const randomToken=()=>randomBytes(32).toString('base64url');
export function encryptionKey(value=process.env.APP_ENCRYPTION_KEY){const key=Buffer.from(value||'','base64');if(key.length!==32)throw Error('APP_ENCRYPTION_KEY must be 32 random bytes encoded as base64.');return key}
export function encrypt(value,key=encryptionKey()){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const body=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),body.toString('base64url')].join('.')}
export function decrypt(value,key=encryptionKey()){const [iv,tag,body]=value.split('.');const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(iv,'base64url'));decipher.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([decipher.update(Buffer.from(body,'base64url')),decipher.final()]).toString('utf8')}
export function safeEqual(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const first=Buffer.from(a),second=Buffer.from(b);return first.length===second.length&&timingSafeEqual(first,second)}
export function cookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').map(x=>x.trim().split('=')).filter(x=>x.length===2))}
export function cookie(name,value,maxAge,origin){return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${origin.startsWith('https:')?'; Secure':''}`}
export async function bodyJson(req,max=2_000_000){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max){const e=Error('Dữ liệu quá lớn.');e.status=413;throw e}chunks.push(chunk)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}catch{throw Object.assign(Error('JSON không hợp lệ.'),{status:400})}}
export function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
export const bad=(message,status=400)=>Object.assign(Error(message),{status});
