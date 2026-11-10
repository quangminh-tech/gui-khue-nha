import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['--experimental-strip-types','--env-file-if-exists=.env','apps/api/src/index.mjs'],{stdio:'inherit',env:{...process.env,PORT:process.env.KN_API_PORT||'3001'}}),spawn(process.execPath,['node_modules/vite/bin/vite.js','--config','apps/web/vite.config.ts',...process.argv.slice(2)],{stdio:'inherit',env:process.env})];
function stop(){for(const child of children)child.kill('SIGTERM')}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,stop);
for(const child of children)child.on('exit',code=>{stop();process.exitCode=code||0});
