import { createClient } from '@supabase/supabase-js';

// Use Environment variables for production, fallback to provided keys for dev convenience
// Fix: Cast import.meta to any to avoid TS error "Property 'env' does not exist on type 'ImportMeta'"
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://bxqtlsawpyjpqbsbspgm.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JwblDkgproER5Il3u9pcCQ_MEZbWDNS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);