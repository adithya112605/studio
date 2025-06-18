
import { config } from 'dotenv';
config();
console.log('[DEBUG] src/ai/dev.ts starting execution...');
import '@/ai/flows/ticket-resolution-suggestions.ts';
