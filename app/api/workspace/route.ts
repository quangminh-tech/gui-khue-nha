import {getChatGPTUser} from '../../chatgpt-auth';
import {z} from 'zod';
import {dataSchema} from '../../../lib/journal-schema';
import {retentionCutoff} from '../../../lib/retention';
import {findWorkspace,saveWorkspace} from '../../../server/repositories/workspace-repository';
import {workspaceRelationshipError} from '../../../server/services/workspace-validation';
export const dynamic='force-dynamic';
function response(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}})}
export async function GET(){const user=await getChatGPTUser();if(!user)return response({error:'Vui lòng đăng nhập để lưu công việc.'},401);const workspace=await findWorkspace(user.userId);return response({data:workspace?JSON.parse(workspace.data):null,version:workspace?.version||0,retention:{days:10,cutoff:retentionCutoff(),lastCheckedAt:workspace?.retentionCheckedAt||null,lastDeletedCount:workspace?.retentionDeletedCount||0,deletedTotal:workspace?.retentionDeletedTotal||0}})}
export async function POST(req:Request){const user=await getChatGPTUser();if(!user)return response({error:'Vui lòng đăng nhập để lưu công việc.'},401);if(req.headers.get('origin')!==new URL(req.url).origin)return response({error:'Yêu cầu không hợp lệ.'},403);try{const input=z.object({data:dataSchema,version:z.number().int().min(0)}).parse(await req.json());const error=workspaceRelationshipError(input.data);if(error)return response({error},400);if(!await saveWorkspace(user.userId,input.data,input.version))return response({error:'Dữ liệu đã thay đổi ở thiết bị khác. Hãy tải lại trang.'},409);return response({version:input.version+1,data:input.data})}catch{return response({error:'Không thể lưu. Kiểm tra thông tin và thử lại.'},400)}}
