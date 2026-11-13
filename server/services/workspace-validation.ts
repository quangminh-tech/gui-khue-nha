import {validDate} from '../../shared/scheduling.mjs';
import type {Journal} from '../../lib/journal';
/** Validate relationships within one owner's workspace after Zod checks the fields. */
export function workspaceRelationshipError(data:Journal):string|null{
 const taskIds=new Set(data.tasks.map(t=>t.id)),byId=new Map(data.tasks.map(t=>[t.id,t]));
 if(taskIds.size!==data.tasks.length)return 'Mã công việc bị trùng.';
 const resources=data.resources||[],resourceIds=new Set(resources.map(r=>r.id));
 if(resourceIds.size!==resources.length)return 'Mã liên kết tài liệu bị trùng.';
 for(const t of data.tasks){if(!validDate(t.due)||t.startDate&&(!validDate(t.startDate)||t.startDate>t.due))return 'Ngày bắt đầu phải hợp lệ và không sau deadline.';if(t.recurrence){if(t.seriesId||data.tasks.some(c=>c.parentId===t.id&&c.seriesId!==t.id))return 'Lịch lặp chỉ áp dụng việc độc lập hoặc việc con không có hậu duệ.';if(t.recurrence.until&&!validDate(t.recurrence.until))return 'Ngày kết thúc lặp không hợp lệ.';if(t.recurrence.freq==='weekly'&&!t.recurrence.weekdays?.length)return 'Chọn ít nhất một thứ trong tuần.';}if(t.seriesId&&(!byId.get(t.seriesId)?.recurrence||!t.occurrenceDate||!validDate(t.occurrenceDate)))return 'Chuỗi lặp của lần thực hiện không tồn tại.';if((t.resourceIds||[]).some(id=>!resourceIds.has(id)))return 'Tài liệu liên quan không tồn tại trong thư viện cá nhân.';if(new Set(t.resourceIds).size!==(t.resourceIds||[]).length)return 'Một tài liệu bị gắn trùng trong công việc.';const seen=new Set([t.id]);let p=t.parentId;while(p){if(!taskIds.has(p)||seen.has(p))return 'Liên kết việc lớn và việc nhỏ không hợp lệ.';seen.add(p);p=byId.get(p)?.parentId}}
 return null;
}
