/** Calendar arithmetic uses UTC date-only values, independent of device timezone. */
export const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const stamp=s=>Date.parse(s+'T00:00:00Z');
export const addDays=(s,n)=>new Date(stamp(s)+n*86400000).toISOString().slice(0,10);
export const daysBetween=(a,b)=>Math.round((stamp(b)-stamp(a))/86400000);
export const localToday=(now=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export const isSeries=t=>!!t.recurrence;
export const occursOn=(t,day)=>(t.startDate||t.due)<=day&&t.due>=day;
export const overlaps=(t,from,to)=>(t.startDate||t.due)<=to&&t.due>=from;
const monthDay=(year,month,day)=>{const end=new Date(Date.UTC(year,month+1,0)).getUTCDate();return new Date(Date.UTC(year,month,Math.min(day,end))).toISOString().slice(0,10)};
const shortHash=s=>{let a=2166136261,b=2246822519;for(const c of s){a=Math.imul(a^c.charCodeAt(0),16777619);b=Math.imul(b^c.charCodeAt(0),3266489917)}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')};
export const instanceId=(id,date)=>(id.length>75?'series_'+shortHash(id):id)+'__on_'+date;
/** All scheduled starts, including excluded dates for stable COUNT/index calculations. */
export function* seriesDates(master,to='2200-12-31'){
 const r=master.recurrence,start=master.startDate||master.due;if(!r||!validDate(start))return;
 const interval=Math.max(1,r.interval||1),limit=r.count||200000,until=r.until&&r.until<to?r.until:to;
 if(until<start)return;const d=new Date(start+'T00:00:00Z'),day=d.getUTCDate(),year=d.getUTCFullYear(),month=d.getUTCMonth();let count=0;
 if(r.freq==='weekly'){
  const weekStart=addDays(start,-((d.getUTCDay()+6)%7)),weekdays=r.weekdays?.length?r.weekdays:[d.getUTCDay()];
  for(let key=start;key<=until&&count<limit;key=addDays(key,1)){const wd=new Date(key+'T00:00:00Z').getUTCDay();if(Math.floor(daysBetween(weekStart,key)/7)%interval===0&&weekdays.includes(wd)){yield key;count++}}return;
 }
 for(let i=0;i<limit;i++){const key=r.freq==='daily'?addDays(start,i*interval):r.freq==='monthly'?monthDay(year,month+i*interval,day):monthDay(year+i*interval,month,day);if(key>until)return;yield key}
}
export function isScheduled(master,date){if(!master?.recurrence||master.recurrence.excludedDates?.includes(date))return false;for(const key of seriesDates(master,date))if(key===date)return true;return false}
export function instantiate(master,date){const duration=Math.max(0,daysBetween(master.startDate||master.due,master.due));return {...master,id:instanceId(master.id,date),seriesId:master.id,occurrenceDate:date,recurrence:undefined,repeat:'none',parentId:master.id,startDate:date,due:addDays(date,duration),status:'todo',completedAt:null,manualProgress:0,checklist:master.checklist.map(c=>({...c,done:false}))}}
/** Virtual occurrences are bounded by the requested window; ordinary tasks remain intact. */
export function expandTasks(tasks,from,to,max=4000){
 const masters=tasks.filter(isSeries),overrides=new Map(tasks.filter(t=>t.seriesId).map(t=>[t.seriesId+'@'+t.occurrenceDate,t])),result=tasks.filter(t=>!isSeries(t)&&!t.seriesId);
 for(const master of masters){result.push({...master});let added=false;const duration=Math.max(0,daysBetween(master.startDate||master.due,master.due));for(const date of seriesDates(master,to)){if(date<addDays(from,-duration)||master.recurrence.excludedDates?.includes(date))continue;const key=master.id+'@'+date;result.push(overrides.get(key)||instantiate(master,date));added=true;overrides.delete(key);if(result.length>max)throw Error('Khoảng lịch có quá nhiều lần lặp. Thu hẹp thời gian hoặc giảm số chuỗi.')}if(!added){for(const date of seriesDates(master)){if(date>=from&&!master.recurrence.excludedDates?.includes(date)){const key=master.id+'@'+date;result.push(overrides.get(key)||instantiate(master,date));overrides.delete(key);break}}}}
 // Preserve edited occurrences moved outside their original dates/window, and orphan history.
 for(const task of overrides.values())if(!tasks.find(t=>t.id===task.seriesId)?.recurrence?.excludedDates?.includes(task.occurrenceDate))result.push(task);
 return result;
}
export function occurrenceForId(tasks,id){const direct=tasks.find(t=>t.id===id);if(direct)return direct;const date=id.slice(-10);if(!validDate(date))return null;const master=tasks.find(t=>isSeries(t)&&instanceId(t.id,date)===id);return master&&isScheduled(master,date)?instantiate(master,date):null}
export const scheduleLabel=t=>{const r=t.recurrence;if(!r)return t.seriesId?'Lần lặp riêng':t.repeat==='daily'?'Hằng ngày (cũ)':t.repeat==='weekly'?'Hằng tuần (cũ)':'';const unit={daily:'ngày',weekly:'tuần',monthly:'tháng',yearly:'năm'}[r.freq];return `Mỗi ${r.interval||1} ${unit}${r.freq==='weekly'?' · '+(r.weekdays||[]).map(d=>['CN','T2','T3','T4','T5','T6','T7'][d]).join(', '):''}${r.until?' · đến '+r.until:''}${r.count?' · '+r.count+' lần':''}`};
const clean=t=>{const next={...t};delete next.recurrence;next.repeat='none';return next};
const upsert=(tasks,t)=>tasks.some(x=>x.id===t.id)?tasks.map(x=>x.id===t.id?t:x):[...tasks,t];
const fresh=t=>({...t,status:'todo',completedAt:null,manualProgress:0,checklist:t.checklist.map(c=>({...c,done:false}))});
/** Save an occurrence or a series scope without resetting other occurrences' checklist/history. */
export function saveScheduledTask(tasks,edited,scope='this',newId=()=>crypto.randomUUID(),templateChecklist=undefined){
 const series=edited.seriesId?tasks.find(t=>t.id===edited.seriesId):null;
 if(series){
  if(scope==='this')return upsert(tasks,{...clean(edited),seriesId:series.id});
  const oldDates=[...seriesDates(series)],oldStart=edited.occurrenceDate,position=oldDates.indexOf(oldStart),newStart=edited.startDate||edited.due,duration=Math.max(0,daysBetween(newStart,edited.due));
  const rule=edited.recurrence||series.recurrence;
  if(scope==='future'){
   const master=fresh({...edited,id:newId(),parentId:edited.parentId===series.id?series.parentId||null:edited.parentId,seriesId:undefined,occurrenceDate:undefined,recurrence:{...rule,excludedDates:[]},repeat:'none',startDate:newStart,due:edited.due});
   const before=addDays(oldStart,-1),newDates=[...seriesDates(master)];master.recurrence.excludedDates=(series.recurrence.excludedDates||[]).filter(d=>d>=oldStart).map(d=>newDates[oldDates.indexOf(d)-Math.max(0,position)]).filter(Boolean);let next=tasks.filter(t=>position!==0||t.id!==series.id).map(t=>t.id===series.id?{...t,recurrence:{...t.recurrence,until:t.recurrence.until&&t.recurrence.until<before?t.recurrence.until:before}}:t);
   next=next.map(t=>{if(t.seriesId!==series.id||t.occurrenceDate<oldStart)return t;const index=oldDates.indexOf(t.occurrenceDate)-Math.max(0,position),date=newDates[index];return date?{...t,parentId:master.id,seriesId:master.id,occurrenceDate:date,startDate:date,due:addDays(date,duration),title:edited.title,description:edited.description,priority:edited.priority,reminder:edited.reminder,time:edited.time}:clean({...t,parentId:series.parentId||null,seriesId:undefined,occurrenceDate:undefined})});
   return upsert([...next,master],{...clean(edited),parentId:master.id,seriesId:master.id,occurrenceDate:newStart,id:edited.id});
  }
  const shift=daysBetween(oldStart,newStart),anchor=addDays(series.startDate||series.due,shift),master=fresh({...edited,id:series.id,parentId:edited.parentId===series.id?series.parentId||null:edited.parentId,seriesId:undefined,occurrenceDate:undefined,startDate:anchor,due:addDays(anchor,duration),checklist:templateChecklist||edited.checklist,recurrence:{...rule,excludedDates:(series.recurrence.excludedDates||[]).map(d=>addDays(d,shift))},repeat:'none'}),newDates=[...seriesDates(master)];
  let next=tasks.map(t=>{if(t.id===series.id)return master;if(t.seriesId!==series.id)return t;const date=newDates[oldDates.indexOf(t.occurrenceDate)];return date?{...t,title:edited.title,description:edited.description,project:edited.project,priority:edited.priority,time:edited.time,reminder:edited.reminder,startDate:date,due:addDays(date,duration),occurrenceDate:date}:clean({...t,parentId:series.parentId||null,seriesId:undefined,occurrenceDate:undefined})});
  const date=newDates[Math.max(0,position)];return date?upsert(next,{...clean(edited),parentId:master.id,seriesId:master.id,occurrenceDate:date,startDate:date,due:addDays(date,duration)}):next;
 }
 if(edited.recurrence){const existed=tasks.find(t=>t.id===edited.id);if(existed?.recurrence){const date=existed.startDate||existed.due;const first=tasks.find(t=>t.seriesId===existed.id&&t.occurrenceDate===date);return saveScheduledTask(tasks,{...edited,id:first?.id||instanceId(existed.id,date),status:first?.status||'todo',completedAt:first?.completedAt||null,manualProgress:first?.manualProgress||0,checklist:first?.checklist||edited.checklist.map(c=>({...c,done:false})),seriesId:existed.id,occurrenceDate:date},'all',newId,edited.checklist)}const master=fresh({...edited,repeat:'none'});let next=upsert(tasks,master);if(!existed?.recurrence&&(edited.status!=='todo'||edited.checklist.some(c=>c.done))){const date=master.startDate||master.due;next.push({...clean(edited),id:instanceId(master.id,date),parentId:master.id,seriesId:master.id,occurrenceDate:date})}return next}
 return upsert(tasks,edited);
}
function removeBranches(tasks,ids){const removed=new Set(ids);let changed=true;while(changed){changed=false;for(const t of tasks)if(!removed.has(t.id)&&(removed.has(t.parentId)||removed.has(t.seriesId))){removed.add(t.id);changed=true}}return tasks.filter(t=>!removed.has(t.id))}
export function deleteScheduledTask(tasks,task,scope='this'){
 const master=task.seriesId?tasks.find(t=>t.id===task.seriesId):null;
 if(!master)return removeBranches(tasks,[task.id]);
 if(scope==='all')return removeBranches(tasks,[master.id]);
 const date=task.occurrenceDate;
 if(scope==='future'&&date<=(master.startDate||master.due))return removeBranches(tasks,[master.id]);
 if(scope==='future')return removeBranches(tasks,[task.id,...tasks.filter(t=>t.seriesId===master.id&&t.occurrenceDate>=date).map(t=>t.id)]).map(t=>t.id===master.id?{...t,recurrence:{...t.recurrence,until:t.recurrence.until&&t.recurrence.until<addDays(date,-1)?t.recurrence.until:addDays(date,-1)}}:t);
 return removeBranches(tasks,[task.id]).map(t=>t.id===master.id?{...t,recurrence:{...t.recurrence,excludedDates:[...new Set([...(t.recurrence.excludedDates||[]),date])]}}:t);
}
/** A recurring template must not become done merely because its only stored exception is done. */
export function recurrenceState(master,tasks,day=localToday()){
 const byDate=new Map(tasks.filter(t=>t.seriesId===master.id).map(t=>[t.occurrenceDate,t]));let completed=false,pending=false;
 for(const date of seriesDates(master)){if(master.recurrence.excludedDates?.includes(date))continue;if(byDate.get(date)?.status==='done')completed=true;else{if(byDate.get(date)?.status==='doing')completed=true;pending=true;if(date>day)return completed?'doing':'todo'}}
 return pending?(completed?'doing':'todo'):'done';
}
