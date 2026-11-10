import {pruneCompleted} from '../../lib/retention';
import type {AppJournal} from '../../lib/app-model';
import {migrateJournal} from '../../lib/app-model';
import {dataSchema} from '../../lib/journal-schema';
import {uid} from '../../lib/journal';
export const GUEST_KEY='khue-nha-local-journal-v1';
export type GuestRecord={savedAt:string;lastCleanupAt?:string;data:AppJournal};
export function readGuestJournal(storage:Pick<Storage,'getItem'>|null=typeof localStorage==='undefined'?null:localStorage):GuestRecord|null{try{const raw=storage?.getItem(GUEST_KEY);if(!raw)return null;const record=JSON.parse(raw),parsed=dataSchema.safeParse(record.data);if(!parsed.success||typeof record.savedAt!=='string')return null;return {savedAt:record.savedAt,lastCleanupAt:record.lastCleanupAt,data:migrateJournal(parsed.data as AppJournal)}}catch{return null}}
export function writeGuestJournal(data:AppJournal,storage:Pick<Storage,'getItem'|'setItem'>=localStorage){const previous=readGuestJournal(storage);const record={savedAt:new Date().toISOString(),lastCleanupAt:previous?.lastCleanupAt||new Date().toISOString(),data};storage.setItem(GUEST_KEY,JSON.stringify(record));return record}
export function mergeGuestJournal(account:AppJournal,guest:AppJournal):AppJournal{const ids=new Map(guest.tasks.map(t=>[t.id,uid()]));return {...account,tasks:[...account.tasks,...guest.tasks.map(t=>({...t,id:ids.get(t.id)!,resourceIds:[],parentId:t.parentId?ids.get(t.parentId)||null:null,checklist:t.checklist.map(c=>({...c,id:uid()}))}))]}}

export function loadGuestJournal(storage:Pick<Storage,'getItem'|'setItem'>=localStorage){const record=readGuestJournal(storage);if(!record)return null;const last=record.lastCleanupAt?Date.parse(record.lastCleanupAt):NaN;if(!Number.isFinite(last)){record.lastCleanupAt=new Date().toISOString();storage.setItem(GUEST_KEY,JSON.stringify(record));return record}if(Date.now()-last>=90*86400000){record.data={...record.data,tasks:pruneCompleted(record.data.tasks).tasks};record.lastCleanupAt=new Date().toISOString();storage.setItem(GUEST_KEY,JSON.stringify(record))}return record}
