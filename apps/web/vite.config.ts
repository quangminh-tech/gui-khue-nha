import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),plugins:[react()],publicDir:fileURLToPath(new URL('../../public',import.meta.url)),build:{outDir:'dist',emptyOutDir:true},server:{host:'127.0.0.1',port:Number(process.env.PORT||3000),strictPort:true,proxy:{'/api':'http://127.0.0.1:'+(process.env.KN_API_PORT||3001),'/auth':'http://127.0.0.1:'+(process.env.KN_API_PORT||3001)}}});
