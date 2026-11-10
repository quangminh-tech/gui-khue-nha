import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({configFile:'apps/web/vite.config.ts',server:{middlewareMode:true},appType:'custom'});
try{
 const docs=await server.ssrLoadModule('/@fs/'+process.cwd()+'/lib/task-documents.ts');
 const hierarchy=await server.ssrLoadModule('/@fs/'+process.cwd()+'/lib/task-hierarchy.ts');
 const {blank}=await server.ssrLoadModule('/@fs/'+process.cwd()+'/lib/journal.ts');
 const {dataSchema}=await server.ssrLoadModule('/@fs/'+process.cwd()+'/lib/journal-schema.ts');
 const task={...blank(),title:'Meeting',id:'task'};const draft={title:'Agenda',url:'docs.google.com/document/d/test/edit',kind:'auto'};
 const saved=docs.preparedTask(task,draft,'Prepare');assert.equal(saved.links[0].url,'https://docs.google.com/document/d/test/edit');assert.equal(saved.links[0].kind,'doc');assert.equal(saved.checklist.length,1);assert(!task.links?.length);
 assert.equal(docs.applyDocumentDraft(saved,draft).links.length,1);
 const edited=docs.applyDocumentDraft(saved,{...draft,title:'Updated',editId:saved.links[0].id});assert.equal(edited.links[0].id,saved.links[0].id);assert.equal(edited.links[0].title,'Updated');
 for(const url of ['javascript:alert(1)','file:///etc/passwd','https://user:pass@example.com'])assert.throws(()=>docs.applyDocumentDraft(task,{...draft,url}));
 assert.throws(()=>docs.applyDocumentDraft(task,{...draft,url:''}));
 const picked=docs.addPickedDocuments(saved,[{...saved.links[0],driveFileId:'drive-1'}]);assert.equal(picked.links.length,1);assert.equal(picked.links[0].driveFileId,'drive-1');
 const changed=docs.applyDocumentDraft(picked,{...draft,url:'https://example.com/new.pdf',editId:picked.links[0].id});assert.equal(changed.links[0].driveFileId,undefined);assert.equal(changed.links[0].kind,'pdf');
 const max={...task,links:Array.from({length:30},(_,i)=>({id:'l'+i,title:'Link',url:'https://example.com/'+i,kind:'website'}))};assert.throws(()=>docs.applyDocumentDraft(max,draft));
 const child={...saved,id:'child',parentId:task.id,project:'AMORA'},grandchild={...task,id:'grandchild',parentId:child.id},other={...task,id:'other',title:'BCARE',project:'Công ty'};const tasks=[task,child,grandchild,other];
 assert.equal(docs.collectTaskDocuments(tasks,task.id,true).length,1);assert.equal(docs.collectTaskDocuments(tasks,task.id,false).length,0);assert.equal(task.links,undefined);
 assert.equal(docs.filterTaskDocuments(docs.collectTaskDocuments(tasks,task.id,true),'agenda','drive').length,1);
 const tree=hierarchy.parentTree(tasks,child.id);assert(!tree.allowed.some(t=>t.id==='child'||t.id==='grandchild'));assert(tree.allowed.some(t=>t.id==='task'));
 assert.deepEqual(hierarchy.taskPath(tasks,grandchild.id).map(t=>t.id),['task','child','grandchild']);
 assert.deepEqual(hierarchy.projectChoices(tasks),['AMORA','Cá nhân','Công ty']);
 const filtered=hierarchy.parentTree(tasks,'new','meeting');assert(filtered.visible.has('task'));assert(filtered.visible.has('child'));
 const parsed=dataSchema.parse({members:[],tasks:[saved]});assert.equal(parsed.tasks[0].links[0].url,saved.links[0].url);
 console.log('PASS document draft on Save; checklist flush; URLs; dedupe/edit/remove metadata; limits; child document ownership; schema; hierarchy cycles/search; project choices.');
}finally{await server.close()}
