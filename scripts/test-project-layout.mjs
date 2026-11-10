import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createServer} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const vite=await createServer({configFile:'apps/web/vite.config.ts',server:{middlewareMode:true},appType:'custom'});
try{
 const {normalizeProjectTasks,projectChoices,projectKey,canonicalProject}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/lib/projects.ts');
 const {migrateJournal}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/lib/app-model.ts');
 const {blank}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/lib/journal.ts');
 const {default:Editor}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/features/app/task-editor.tsx');
 const variants=['CÔNG TY',' CÔNG TY ','CÔNG\u00a0TY','CÔNG TY'.normalize('NFD'),'công ty','CÔNG\u200b TY','CÔNG  TY'];
 const tasks=variants.map((project,i)=>({...blank(),id:'task-'+i,title:'Task '+i,project,parentId:i?'task-0':null,links:[{id:'l'+i,title:'Document',url:'https://example.com/'+i,kind:'website'}],checklist:[{id:'c'+i,text:'Checklist',done:false}]}));
 const before=structuredClone(tasks),result=normalizeProjectTasks(tasks);
 assert.equal(projectChoices(tasks).length,1);assert.equal(projectChoices(tasks,'công ty ').length,1);assert.equal(projectChoices([...tasks,{project:'CONG TY'}]).length,2,'Do not remove accents/merge distinct names');
 assert.equal(canonicalProject(' công\u00a0ty ',tasks),'CÔNG TY');
 assert.equal(result.length,tasks.length);for(let i=0;i<result.length;i++){assert.equal(result[i].project,'CÔNG TY');assert.deepEqual({...result[i],project:before[i].project},before[i]);assert.equal(projectKey(before[i].project),projectKey('CÔNG TY'))}assert.deepEqual(tasks,before,'No mutation');assert.deepEqual(normalizeProjectTasks(result),result);
 const migrated=migrateJournal({members:[],tasks});assert.equal(projectChoices(migrated.tasks).length,1);assert(migrated.tasks.every(t=>t.project==='CÔNG TY'));
 const html=renderToStaticMarkup(createElement(Editor,{initial:{...tasks[0],id:'new'},tasks,busy:false,googleReady:false,calendarReady:false,onClose(){},onSave:async()=>true,onDelete(){},onChild(){},onOpen(){},onDrive:async()=>[],onCalendar(){}}));
 const datalist=html.match(/<datalist[^>]*>(.*?)<\/datalist>/s)[1];assert.equal((datalist.match(/<option/g)||[]).length,1);const chips=html.match(/<div class="kn-project-choices">(.*?)<\/div>/s)[1];assert.equal((chips.match(/<button/g)||[]).length,1);
 // Guard the real release asset, not a dead CSS file or only component markup.
 const entry=readFileSync('features/app/app-shell.tsx','utf8');assert(entry.includes("import './app.css'"));const cssName=readdirSync('apps/web/dist/assets').find(f=>f.endsWith('.css'));assert(cssName);const css=readFileSync('apps/web/dist/assets/'+cssName,'utf8');
 for(const [selector,declaration] of [['kn-parent-picker','display:grid'],['kn-parent-current','display:flex'],['kn-parent-row','display:flex'],['kn-project-choices','display:flex'],['kn-document-item','border'],['kn-document-thumbnail','object-fit:cover']]){const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');assert(new RegExp('\\.'+escaped+'[^{}]*\\{[^}]*'+declaration).test(css),'Built CSS missing '+selector+' / '+declaration)}
 console.log('PASS domains: whitespace/NBSP/Unicode/zero-width/case collapse to one choice; distinct accent names retained; IDs/parent/checklist/links intact; idempotent migration; editor chips and datalist deduped.');
 console.log('PASS actual built CSS: tree, current selection, rows, domain chips and document cards/thumbnail styles shipped in imported stylesheet. Not a visual browser/device test.');
}finally{await vite.close()}
