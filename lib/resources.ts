export const RESOURCE_KINDS={sheet:'Google Sheets',doc:'Google Docs',slides:'Google Slides',powerpoint:'PowerPoint / PPTX',pdf:'PDF',website:'Website'} as const;
export type ResourceKind=keyof typeof RESOURCE_KINDS;
export type Resource={id:string;title:string;url:string;kind:ResourceKind;note:string;createdAt:string};
export function normalizeResourceUrl(value:string):string{const u=new URL(value.trim());if(!['https:','http:'].includes(u.protocol)||u.username||u.password)throw new Error('Dùng link http:// hoặc https://, không chứa tài khoản/mật khẩu.');return u.href}
export function inferResourceKind(value:string):ResourceKind{try{const u=new URL(value),host=u.hostname.toLowerCase(),path=u.pathname.toLowerCase();if(host==='docs.google.com'){if(path.startsWith('/spreadsheets/'))return 'sheet';if(path.startsWith('/document/'))return 'doc';if(path.startsWith('/presentation/'))return 'slides'}if(/\.pptx?$/.test(path)||host==='1drv.ms'&&path.startsWith('/p/'))return 'powerpoint';if(/\.pdf$/.test(path))return 'pdf'}catch{}return 'website'}
export function resourceHost(value:string){try{return new URL(value).hostname.replace(/^www\./,'')}catch{return 'Link không hợp lệ'}}
