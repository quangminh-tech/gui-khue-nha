export function generateGemini(input:{key:string;model:string;message:string;context?:unknown[];history?:{role:string;text:string}[];fetchImpl?:typeof fetch}):Promise<string>;
export function safeAiContext(tasks:unknown):unknown[];
