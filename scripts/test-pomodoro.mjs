import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/pomodoro.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {DEFAULT_POMODORO:s,normalizePomodoro,initialPomodoro,advancePomodoro,secondsRemaining,restorePomodoro}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const now=1000000;let state=initialPomodoro(s);
assert.equal(state.remaining,1500);
for(let i=1;i<=4;i++){state=advancePomodoro(state,s,now);assert.equal(state.completedFocus,i);assert.equal(state.phase,i===4?'long':'short');assert.equal(state.remaining,i===4?900:300);assert.equal(state.running,false);state=advancePomodoro(state,s,now);assert.equal(state.phase,'focus');assert.equal(state.completedFocus,i)}
const skipped=advancePomodoro(initialPomodoro(s),s,now,false);assert.equal(skipped.completedFocus,0);assert.equal(skipped.phase,'short');
const auto=advancePomodoro(initialPomodoro(s),{...s,autoBreak:true},now);assert.equal(auto.deadline,now+300000);assert.equal(auto.running,true);
assert.equal(advancePomodoro(auto,{...s,autoFocus:true},now).deadline,now+1500000);
const clock={...initialPomodoro(s),running:true,deadline:now+1500000};assert.equal(secondsRemaining(clock,now+65400),1435);assert.equal(secondsRemaining(clock,now+1600000),0);
assert.equal(restorePomodoro(clock,s,now+65400).remaining,1435);assert.equal(restorePomodoro({bad:true},s,now).running,false);
assert.equal(restorePomodoro({...clock,deadline:Infinity},s,now).running,false);
const normalized=normalizePomodoro({focusMinutes:999,shortMinutes:-4,longEvery:100,volume:NaN});assert.equal(normalized.focusMinutes,120);assert.equal(normalized.shortMinutes,1);assert.equal(normalized.longEvery,8);assert.equal(normalized.volume,50);
console.log('Pomodoro: cycle, long break, skip, autostart, clock drift, restoration and bounds passed.');
