const errors=[];const env=process.env;
try{const u=new URL(env.APP_ORIGIN||'');if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password||env.APP_ORIGIN.endsWith('/'))errors.push('APP_ORIGIN phải là HTTPS origin, không có đường dẫn hoặc dấu / cuối.')}catch{errors.push('Thiếu APP_ORIGIN hợp lệ.')}
if(!env.MONGODB_URI?.startsWith('mongodb+srv://'))errors.push('Thiếu MongoDB Atlas URI mongodb+srv://.');
if(!env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com'))errors.push('Thiếu GOOGLE_CLIENT_ID loại Web.');
if(!env.GOOGLE_CLIENT_SECRET)errors.push('Thiếu GOOGLE_CLIENT_SECRET.');
try{if(Buffer.from(env.APP_ENCRYPTION_KEY||'','base64').length!==32)errors.push('APP_ENCRYPTION_KEY phải giải mã thành 32 byte.')}catch{errors.push('APP_ENCRYPTION_KEY không hợp lệ.')}
if(!env.MONGODB_DB)errors.push('Thiếu MONGODB_DB.');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Cấu hình đủ trường cơ bản. Chưa xác minh kết nối MongoDB/Google thật.');
