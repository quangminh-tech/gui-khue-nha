import type {Journal} from '../../lib/journal';
/** Validate relationships within one owner's workspace after Zod checks the fields. */
export function workspaceRelationshipError(data:Journal):string|null{
 const taskIds=new Set(data.tasks.map(t=>t.id)),byId=new Map(data.tasks.map(t=>[t.id,t]));
 if(taskIds.size!==data.tasks.length)return 'Mã công việc bị trùng.';
 const resources=data.resources||[],resourceIds=new Set(resources.map(r=>r.id));
 if(resourceIds.size!==resources.length)return 'Mã liên kết tài liệu bị trùng.';
 for(const t of data.tasks){if((t.resourceIds||[]).some(id=>!resourceIds.has(id)))return 'Tài liệu liên quan không tồn tại trong thư viện cá nhân.';if(new Set(t.resourceIds).size!==(t.resourceIds||[]).length)return 'Một tài liệu bị gắn trùng trong công việc.';const seen=new Set([t.id]);let p=t.parentId;while(p){if(!taskIds.has(p)||seen.has(p))return 'Liên kết việc lớn và việc nhỏ không hợp lệ.';seen.add(p);p=byId.get(p)?.parentId}}
 return null;
}
