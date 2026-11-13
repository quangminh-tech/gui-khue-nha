import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {readFileSync} from 'node:fs';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.document={body:{style:{overflow:''}},addEventListener(){},removeEventListener(){}};globalThis.window={addEventListener(){},removeEventListener(){}};globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.sessionStorage={getItem:()=>null,setItem(){}};
const vite=await createServer({configFile:'apps/web/vite.config.ts',server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Editor}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/features/app/task-editor.tsx');const {default:Pomodoro}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/components/pomodoro-timer.tsx');
 const {blank}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/lib/journal.ts');const {CHARACTERS}=await vite.ssrLoadModule('/@fs/'+process.cwd()+'/features/app/character.tsx');
 for(const c of CHARACTERS){const html=renderToStaticMarkup(React.createElement(Pomodoro,{character:c.id,task:null,tasks:[],onTaskChange(){},onNotice(){}}));assert(html.includes(c.color));assert(html.includes(c.id==='rhinedottir'?'rhinedottir-heterochromia.webp':c.name+' chibi'));}
 const task={...blank(),title:'Checklist task',checklist:[{id:'s',text:'Click anywhere on this row',done:false}]};let saved=[],resolveSave;let renderer;const props={initial:task,tasks:[task],busy:false,googleReady:false,calendarReady:false,onClose(){},onSave:async t=>{saved.push(t);return new Promise(r=>resolveSave=r)},onDelete(){},onChild(){},onOpen(){},onDrive:async()=>[],onCalendar(){}};
 await act(async()=>renderer=create(React.createElement(Editor,props)));const row=()=>renderer.root.findByProps({role:'checkbox'});assert.equal(row().type,'button');assert.equal(row().props['aria-checked'],false);
 let first;await act(async()=>{first=row().props.onClick();row().props.onClick()});assert.equal(saved.length,1);assert(row().props.disabled);assert(saved[0].checklist[0].done);await act(async()=>{resolveSave(true);await first});assert.equal(row().props['aria-checked'],true);
 let second;await act(async()=>{second=row().props.onClick()});await act(async()=>{resolveSave(false);await second});assert.equal(row().props['aria-checked'],true);assert(renderer.root.findByProps({role:'alert'}));await act(async()=>renderer.unmount());
 // A non-preset lead time is retained and editable, rather than a blank select.
 await act(async()=>renderer=create(React.createElement(Editor,{...props,initial:{...task,id:'new',reminder:37},tasks:[]})));const custom=renderer.root.findByProps({'aria-label':'Nhắc trước — số lượng'});assert.equal(custom.props.value,'37');await act(async()=>renderer.unmount());
 const css=readFileSync('features/app/app.css','utf8');assert(css.includes('.kn-check-row')&&css.includes('min-height:48px'));
 console.log('PASS all ten Pomodoro companions; Rhinedottir heterochromia asset reference; full-row checkbox one save under rapid clicks; disabled during save; failed save retains prior check; custom 37 minute reminder. React/SSR, not a phone.');
}finally{await vite.close()}
