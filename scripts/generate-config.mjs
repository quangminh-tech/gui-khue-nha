// Run locally. Do not commit the generated output or send it in chat.
import {randomBytes} from 'node:crypto';
console.log('APP_ENCRYPTION_KEY='+randomBytes(32).toString('base64'));
console.log('MAINTENANCE_TOKEN='+randomBytes(36).toString('base64url'));
