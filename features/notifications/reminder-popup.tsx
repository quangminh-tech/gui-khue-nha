'use client';
import {X,Clock3,ArrowUpRight,Bell,Volume2,Check,ChevronDown} from 'lucide-react';
import type {Task} from '../../lib/journal';
import type {AppSettings} from '../../lib/app-model';
import {shortDate} from '../../lib/journal';
import {ElementSymbol,REGIONS} from '../app/regions';
export default function ReminderPopup({task,settings,onClose,onOpen,onSnooze,onComplete}:{task:Task;settings:AppSettings;onClose:()=>void;onOpen:()=>void;onSnooze:()=>void;onComplete:()=>void}){const region=REGIONS[settings.character];return <aside className="kn-reminder-popup" role="status" aria-live="polite" aria-label="Nhắc công việc"><header><span><ElementSymbol name={settings.character} size={19}/>{region.region} · Nhắc việc</span><button aria-label="Đóng popup nhắc việc" onClick={onClose}><X size={16}/></button></header><div className="kn-reminder-popup-body"><img src="/paimon-small.webp" alt="Paimon nhắc việc"/><div><small>ĐẾN GIỜ DÀNH CHO ĐIỀU QUAN TRỌNG</small><strong>{task.title}</strong><p><Clock3 size={12}/>{shortDate(task.due)} · {task.time}<span>{task.priority}</span></p></div></div><footer><button onClick={onSnooze}><Clock3 size={13}/>5 phút nữa</button><button onClick={onOpen}>Mở việc<ArrowUpRight size={13}/></button><button onClick={onComplete} aria-label="Hoàn thành việc được nhắc"><Check size={15}/></button></footer></aside>}
