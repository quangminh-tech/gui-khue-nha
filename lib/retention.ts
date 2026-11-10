export const RETENTION_DAYS = 10;
export type RetainedTask = { id: string; status: string; completedAt: string | null; parentId?: string | null };
function validDay(value: string): boolean {
 return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
}
export function localDay(now=new Date()):string{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function retentionCutoff(now=new Date()):string{const day=new Date(localDay(now)+'T00:00:00Z');day.setUTCDate(day.getUTCDate()-RETENTION_DAYS);return day.toISOString().slice(0,10)}
/** The scheduled batch removes ALL completed tasks strictly older than 10 days.
 * Surviving children are reparented to the closest surviving ancestor (or root).
 * Invalid dates, duplicate identifiers, and cyclic nodes are kept conservatively.
 */
export function pruneCompleted<T extends RetainedTask>(tasks:T[],now=new Date()){
 const cutoff=retentionCutoff(now);
 if(new Set(tasks.map(t=>t.id)).size!==tasks.length)return {tasks:[...tasks],deletedCount:0,cutoff};
 const byId=new Map(tasks.map(t=>[t.id,t]));const cyclic=new Set<string>();
 for(const t of tasks){const path:string[]=[];const positions=new Map<string,number>();let current:T|undefined=t;while(current){if(positions.has(current.id)){for(const id of path.slice(positions.get(current.id)!))cyclic.add(id);break}positions.set(current.id,path.length);path.push(current.id);current=current.parentId?byId.get(current.parentId):undefined}}
 const removed=new Set(tasks.filter(t=>!cyclic.has(t.id)&&t.status==='done'&&!!t.completedAt&&validDay(t.completedAt)&&t.completedAt<cutoff).map(t=>t.id));
 const kept=tasks.filter(t=>!removed.has(t.id)).map(t=>{if(!t.parentId||!removed.has(t.parentId))return t;let parent=t.parentId;const visited=new Set<string>();while(removed.has(parent)&&!visited.has(parent)){visited.add(parent);parent=byId.get(parent)?.parentId||''}return {...t,parentId:parent||null}});
 return {tasks:kept,deletedCount:removed.size,cutoff};
}
