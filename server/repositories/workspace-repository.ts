import {and,eq} from 'drizzle-orm';
import {getDb} from '../../db';
import {workspaces} from '../../db/schema';
import type {Journal} from '../../lib/journal';
/** Every query is scoped to the authenticated owner. Never accept owner from request JSON. */
export async function findWorkspace(owner:string){const rows=await getDb().select().from(workspaces).where(eq(workspaces.owner,owner));return rows[0]||null}
export async function saveWorkspace(owner:string,data:Journal,version:number){const db=getDb();const result=version===0?await db.insert(workspaces).values({owner,data:JSON.stringify(data),version:1}).onConflictDoNothing().returning():await db.update(workspaces).set({data:JSON.stringify(data),version:version+1}).where(and(eq(workspaces.owner,owner),eq(workspaces.version,version))).returning();return result.length>0}
