import { getDb } from '../../../../db';
import { workspaces } from '../../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { dataSchema } from '../../../../lib/journal-schema';
import { pruneCompleted, retentionCutoff } from '../../../../lib/retention';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
// Shared maintenance writer for this confirmed OWNER-PRIVATE personal Site.
// Platform dispatch authenticates every caller, including cloud service access.
// The linked task MUST recheck owner-private access before every invocation.
// Do not expose this endpoint on a public/shared deployment without adding service auth.
export async function GET(){
  const rows=await getDb().select().from(workspaces).limit(101);
  if(rows.length>100)return reply({error:'Unexpected maintenance scope.'},409);
  let remainingEligible=0;
  for(const row of rows){const result=dataSchema.safeParse(JSON.parse(row.data));if(!result.success)return reply({error:'Stored data failed validation. No cleanup attempted.'},409);remainingEligible+=pruneCompleted(result.data.tasks).deletedCount;}
  return reply({policy:'completed-older-than-10-days',cutoff:retentionCutoff(),workspaces:rows.length,remainingEligible,lastCheckedAt:rows.map(r=>r.retentionCheckedAt).filter(Boolean).sort().at(-1)||null,deletedTotal:rows.reduce((sum,r)=>sum+r.retentionDeletedTotal,0)});
}
export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return reply({error:'Invalid origin.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required.'},415);
  const body=await request.json().catch(()=>null) as {action?:string}|null;
  if(body?.action!=='purge-completed-10-days')return reply({error:'Explicit cleanup action required.'},400);
  const db=getDb(), rows=await db.select().from(workspaces).limit(101);
  if(rows.length>100)return reply({error:'Unexpected maintenance scope.'},409);
  // Validate every row before any mutation; never try to repair malformed user data.
  const validated=rows.map(row=>({row,parsed:dataSchema.safeParse(JSON.parse(row.data))}));
  if(validated.some(r=>!r.parsed.success))return reply({error:'Stored data failed validation. No cleanup attempted.'},409);
  const now=new Date(),checkedAt=now.toISOString();let deletedCount=0,conflicts=0;
  for(const {row,parsed} of validated){
    if(!parsed.success)continue;
    const result=pruneCompleted(parsed.data.tasks,now);
    const update=await db.update(workspaces).set({
      ...(result.deletedCount?{data:JSON.stringify({...parsed.data,tasks:result.tasks}),version:row.version+1}:{}),
      retentionCheckedAt:checkedAt,retentionDeletedCount:result.deletedCount,retentionDeletedTotal:row.retentionDeletedTotal+result.deletedCount,
    }).where(and(eq(workspaces.owner,row.owner),eq(workspaces.version,row.version))).returning({owner:workspaces.owner});
    if(!update.length){conflicts++;continue;}deletedCount+=result.deletedCount;
  }
  return reply({status:conflicts?'retry_required':'success',checkedAt,cutoff:retentionCutoff(now),deletedCount,checkedWorkspaces:rows.length-conflicts,conflicts},conflicts?409:200);
}
