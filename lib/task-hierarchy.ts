import type {Task} from './journal';
import {descendants} from './journal';
export const searchText=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLocaleLowerCase('vi');
export function taskPath(tasks:Task[],id:string):Task[]{const result:Task[]=[],seen=new Set<string>();let task=tasks.find(t=>t.id===id);while(task&&!seen.has(task.id)){seen.add(task.id);result.unshift(task);task=tasks.find(t=>t.id===task!.parentId)}return result}
export function parentTree(tasks:Task[],id:string,query=''){
 const blocked=new Set([id,...descendants(tasks,id).map(t=>t.id)]),allowed=tasks.filter(t=>!blocked.has(t.id)),ids=new Set(allowed.map(t=>t.id));
 const matched=query.trim()?allowed.filter(t=>searchText(t.title+' '+t.project).includes(searchText(query.trim()))):allowed;
 const visible=new Set(matched.flatMap(t=>taskPath(allowed,t.id).map(p=>p.id)));
 const roots=allowed.filter(t=>!t.parentId||!ids.has(t.parentId));
 return {allowed,roots,visible,blocked};
}
export {projectChoices} from './projects';
