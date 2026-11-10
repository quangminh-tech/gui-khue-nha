import {database,getWorkspace,saveWorkspace} from './store.mjs';
import {pruneCompleted} from '../../../lib/retention.ts';
/** Called by an external authenticated scheduler; never by ordinary app reads/saves. */
export async function cleanup(now=new Date()){
 const d=database(),key='completed-10-days-every-90',lease=await d.collection('maintenance').findOneAndUpdate({_id:key,$or:[{leaseUntil:{$lt:now}},{leaseUntil:{$exists:false}}]},{$set:{leaseUntil:new Date(now.getTime()+600000)}},{upsert:true,returnDocument:'after'}).catch(e=>{if(e.code===11000)return null;throw e});
 if(!lease)return {status:'busy'};try{if(lease.lastRunAt&&now-new Date(lease.lastRunAt)<90*86400000)return {status:'not_due',nextRunAt:new Date(new Date(lease.lastRunAt).getTime()+90*86400000)};
 let deletedCount=0;for await(const meta of d.collection('workspaces').find({})){const current=await getWorkspace(meta._id);if(!current.data)continue;const pruned=pruneCompleted(current.data.tasks,now);if(pruned.deletedCount){await saveWorkspace(meta._id,{...current.data,tasks:pruned.tasks},current.version);deletedCount+=pruned.deletedCount}}
 await d.collection('maintenance').updateOne({_id:key},{$set:{lastRunAt:now,lastDeletedCount:deletedCount},$inc:{deletedTotal:deletedCount}});return {status:'success',deletedCount,nextRunAt:new Date(now.getTime()+90*86400000)};
 }finally{await d.collection('maintenance').updateOne({_id:key},{$set:{leaseUntil:new Date(0)}})}
}
