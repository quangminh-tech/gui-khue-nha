import {readFile} from 'node:fs/promises';
import {dataSchema} from '../lib/journal-schema.ts';
import {workspaceRelationshipError} from '../server/services/workspace-validation.ts';
import {connectMongo,database,getWorkspace,saveWorkspace,closeMongo} from '../apps/api/src/store.mjs';
const [file,owner,flag]=process.argv.slice(2);
if(!file||!owner){console.error('Usage: node --env-file=.env scripts/import-mongo.mjs backup.json GOOGLE_SUB [--apply]');process.exit(1)}
try{const raw=JSON.parse(await readFile(file,'utf8')),data=dataSchema.parse(raw);const error=workspaceRelationshipError(data);if(error)throw Error(error);if(flag!=='--apply'){console.log(`DRY RUN: valid backup with ${data.tasks.length} tasks. No database connection or write.`);process.exit(0)}await connectMongo();if(!await database().collection('users').findOne({_id:owner}))throw Error('Owner must first sign in through Google. Use the id from /api/me.');const current=await getWorkspace(owner);if(current.data)throw Error('Workspace is not empty. Import refuses to overwrite existing online data. Export and review migration separately.');const version=await saveWorkspace(owner,data,0);console.log(`Imported ${data.tasks.length} tasks, version ${version}. Original Google files are untouched.`)}catch(e){console.error(e.message);process.exitCode=1}finally{await closeMongo()}
