import type {Task} from './journal';
import type {TaskLink} from './app-model';
import {uid,descendants} from './journal';
import {normalizeResourceUrl,inferResourceKind,resourceHost} from './resources';
export const DOCUMENT_TYPES:Record<TaskLink['kind'],string>={sheet:'Google Sheets',doc:'Google Docs',slides:'Google Slides',powerpoint:'PPTX / PowerPoint',pdf:'PDF',website:'Website / Drive',image:'Ảnh'};
export type DocumentDraft={title:string;url:string;kind:'auto'|TaskLink['kind'];editId?:string|null};
export function documentSource(url:string){try{const host=new URL(url).hostname;return host==='drive.google.com'||host==='docs.google.com'?'Google Drive':resourceHost(url)}catch{return 'Link không hợp lệ'}}
export function normalizedDocumentUrl(raw:string){const text=raw.trim();return normalizeResourceUrl(/^(?:www\.|(?:docs|drive)\.google\.com\/)/i.test(text)?'https://'+text:text)}
export function applyDocumentDraft(task:Task,draft:DocumentDraft):Task{
 if(!draft.url.trim()){if(draft.title.trim()||draft.editId)throw Error('Nhập đường dẫn tài liệu trước khi lưu.');return task}
 const url=normalizedDocumentUrl(draft.url);if(url.length>2048)throw Error('Link tài liệu tối đa 2048 ký tự.');
 const kind=draft.kind==='auto'?inferResourceKind(url):draft.kind;
 const title=(draft.title.trim()||((kind==='website'?documentSource(url):DOCUMENT_TYPES[kind])+' · '+(new URL(url).pathname.split('/').filter(Boolean).slice(-1)[0]||new URL(url).hostname))).slice(0,200);
 const links=[...(task.links||[])],duplicate=links.find(l=>l.id!==draft.editId&&normalizedDocumentUrl(l.url)===url);
 if(duplicate){if(draft.editId)throw Error('Đường dẫn này đã có trong danh sách. Gỡ bản trùng hoặc sửa đường dẫn.');return {...task,links:links.map(l=>l.id===duplicate.id&&draft.title.trim()?{...l,title,kind}:l)}}
 const previous=links.find(l=>l.id===draft.editId);if(draft.editId&&!previous)throw Error('Tài liệu đang sửa không còn trong danh sách.');
 const document:TaskLink={id:previous?.id||uid(),title,url,kind,...(previous?.url===url&&previous.driveFileId?{driveFileId:previous.driveFileId}:{})};
 if(previous)return {...task,links:links.map(l=>l.id===previous.id?document:l)};
 if(links.length>=30)throw Error('Mỗi công việc tối đa 30 tài liệu. Gỡ bớt link trước khi thêm.');
 return {...task,links:[...links,document]};
}
export function preparedTask(task:Task,draft:DocumentDraft,step=''){const result=applyDocumentDraft(task,draft);if(!step.trim())return result;if(result.checklist.length>=100)throw Error('Checklist tối đa 100 bước.');return {...result,checklist:[...result.checklist,{id:uid(),text:step.trim().slice(0,300),done:false}]}}
export function addPickedDocuments(task:Task,picked:TaskLink[]){let next=task;for(const link of picked){const previous=(next.links||[]).find(l=>normalizedDocumentUrl(l.url)===normalizedDocumentUrl(link.url));next=applyDocumentDraft(next,{title:link.title,url:link.url,kind:link.kind,editId:previous?.id});if(link.driveFileId)next={...next,links:next.links?.map(l=>l.url===normalizedDocumentUrl(link.url)?{...l,driveFileId:link.driveFileId}:l)}}return next}
export type TaskDocument=TaskLink&{taskId:string;taskTitle:string};
export function collectTaskDocuments(tasks:Task[],id:string,includeChildren=false):TaskDocument[]{const root=tasks.find(t=>t.id===id);if(!root)return [];return [root,...(includeChildren?descendants(tasks,id):[])].flatMap(t=>(t.links||[]).map(l=>({...l,taskId:t.id,taskTitle:t.title})))}
export function filterTaskDocuments(links:TaskDocument[],query:string,kind:string){const text=query.trim().toLocaleLowerCase('vi');return links.filter(l=>(!text||(l.title+' '+l.url+' '+l.taskTitle+' '+documentSource(l.url)).toLocaleLowerCase('vi').includes(text))&&(kind==='all'||kind==='drive'?kind==='all'||documentSource(l.url)==='Google Drive':kind===l.kind))}
