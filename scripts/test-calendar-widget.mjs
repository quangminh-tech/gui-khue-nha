import assert from 'node:assert/strict';
import {createCalendarSync,eventFields,eventPayload,taskFingerprint} from '../apps/api/src/calendar-sync.mjs';
import {androidSnapshot} from '../shared/android-snapshot.mjs';
import {hash} from '../apps/api/src/security.mjs';
const tables=new Map();const table=name=>{if(!tables.has(name))tables.set(name,new Map());return tables.get(name)};
const matches=(row,q)=>Object.entries(q).every(([k,v])=>k==='$or'||row[k]===v);
const db=()=>({collection(name){const rows=table(name);return {async findOne(q){return [...rows.values()].find(r=>matches(r,q))||null},find(q){return {toArray:async()=>[...rows.values()].filter(r=>matches(r,q))}},async updateOne(q,u,opts={}){let r=[...rows.values()].find(r=>matches(r,q));if(!r&&!opts.upsert)return {matchedCount:0};r={...r,...u.$set};if(!r._id)r._id=q._id;rows.set(r._id,r);return {matchedCount:1}},async findOneAndUpdate(q,u){const old=rows.get(q._id);if(old?.until>new Date())throw Object.assign(Error('lock'),{code:11000});const r={_id:q._id,...u.$set};rows.set(q._id,r);return r},async deleteOne(q){const row=await this.findOne(q);if(row)rows.delete(row._id)}}}});
const date=new Date().toISOString().slice(0,10),task=(id,extra={})=>({id,title:id,description:'notes',due:date,time:'09:00',priority:'Vừa',status:'todo',completedAt:null,project:'Cá nhân',assignee:'',parentId:null,checklist:[{id:'step',text:'Keep me',done:false}],...extra});
let w={data:{tasks:[task('app-task')],members:[],settings:{name:'Test'}},version:1};let revision=1,writes=0;
const events=new Map([['external',{id:'external',etag:'e0',summary:'Google meeting',description:'remote note',start:{dateTime:date+'T04:00:00Z'},end:{dateTime:date+'T06:00:00Z'}}]]);
let force412=false;const fetcher=async(raw,opts)=>{const url=new URL(raw),id=decodeURIComponent(url.pathname.split('/').pop()),method=opts.method;let status=200,body;
 if(url.search){body={items:[...events.values()]}}else if(method==='GET'){body=events.get(id);if(!body)status=404}
 else if(method==='POST'){body=JSON.parse(opts.body);body.etag='e'+revision++;events.set(body.id,body);writes++}
 else if(method==='PATCH'){const old=events.get(id);if(force412||opts.headers['If-Match']!==old.etag){status=412;force412=false}else{body={...old,...JSON.parse(opts.body),etag:'e'+revision++};events.set(id,body);writes++}}
 else if(method==='DELETE'){if(opts.headers['If-Match']!==events.get(id)?.etag)status=412;else{events.delete(id);status=204;writes++}}
 return {status,ok:status>=200&&status<300,json:async()=>structuredClone(body)};
};
const api=createCalendarSync({db,getWorkspace:async()=>structuredClone(w),saveWorkspace:async(owner,data,expected)=>{assert.equal(expected,w.version);w={data:structuredClone(data),version:w.version+1};return w.version},googleToken:async()=> 'fake',fetcher});
await api.configure('a',true);let result=await api.sync('a');assert.equal(result.imported,1);assert.equal(result.pushed,1);assert.equal(w.data.tasks.length,2);const ownId=hash('a:app-task');assert(events.has(ownId));
const unchanged=writes;await api.sync('a');assert.equal(writes,unchanged,'idempotence');
w.data.tasks[0].title='Edited in app';w.version++;await api.sync('a');assert.equal(events.get(ownId).summary,'Edited in app');
const remote=events.get(ownId);events.set(ownId,{...remote,summary:'Edited in Google',etag:'remote-change'});await api.sync('a');assert.equal(w.data.tasks[0].title,'Edited in Google');assert.equal(w.data.tasks[0].checklist[0].text,'Keep me');
w.data.tasks[0].title='Concurrent app';events.set(ownId,{...events.get(ownId),summary:'Concurrent Google',etag:'new-google'});result=await api.sync('a');assert.equal(result.conflicts,1);assert.equal(w.data.tasks[0].title,'Concurrent Google');
w.data.tasks[0].description='new local';force412=true;result=await api.sync('a');assert.equal(result.conflicts,1);assert.notEqual(events.get(ownId).description,'new local');await api.sync('a');assert.equal(events.get(ownId).description,'new local');
const imported=w.data.tasks.find(t=>t.project==='Google Calendar');assert.equal(imported.time,'11:00');w.data.tasks=w.data.tasks.filter(t=>t.id!=='app-task');await api.sync('a');assert(!events.has(ownId));
w.data.tasks=[];await api.sync('a');assert(events.has('external'),'deleting imported task must keep original event');await api.sync('a');assert.equal(w.data.tasks.length,0,'detached imported event must not reappear');
assert.equal((await api.status('b')).enabled,false,'owner isolation');
const allDay={summary:'Trip',start:{date:'2026-11-10'},end:{date:'2026-11-12'}};assert.equal(eventFields(allDay).time,'09:00');assert.equal(eventPayload(task('trip',{due:'2026-11-20'}),allDay).end.date,'2026-11-22');
// Cancellation keeps task/checklist, detaches link; avoids destructive Google->task deletion.
w.data.tasks=[task('cancel')];await api.sync('a');const cancelId=hash('a:cancel');events.set(cancelId,{id:cancelId,status:'cancelled'});await api.sync('a');assert(w.data.tasks[0].tags.includes('Lịch đã xóa'));await api.sync('a');assert.equal(events.get(cancelId).status,'cancelled');
// Deletion after a concurrent Google edit retries using the latest read etag.
w.data.tasks.push(task('delete-race'));await api.sync('a');const raceId=hash('a:delete-race');events.set(raceId,{...events.get(raceId),etag:'concurrent-delete'});w.data.tasks=w.data.tasks.filter(t=>t.id!=='delete-race');result=await api.sync('a');assert.equal(result.conflicts,1);assert(events.has(raceId));await api.sync('a');assert(!events.has(raceId));
const now=+new Date('2026-11-10T05:00:00Z'),snap=androidSnapshot([task('today',{due:'2026-11-10'}),task('urgent',{due:'2026-12-01',priority:'Cao'}),task('late',{due:'2026-11-09'}),task('ordinary',{due:'2026-11-12'}),task('done',{status:'done'})],{name:'Test'},now);assert.deepEqual(new Set(snap.widgetTasks.map(t=>t.id)),new Set(['today','urgent','late']));assert(!snap.widgetTasks.some(t=>['done','ordinary'].includes(t.id)));
const midnight=androidSnapshot([task('tomorrow',{due:'2026-11-11'})],{},+new Date('2026-11-10T17:01:00Z'));assert.equal(midnight.widgetTasks[0].id,'tomorrow');
console.log('PASS Calendar and widget: bidirectional edits, imports, idempotence, preserved checklist, conflict/412, safe deletion, all-day duration, owner isolation, today/urgent/overdue, Vietnam midnight. Mock Google/Mongo; not device/provider integration.');
