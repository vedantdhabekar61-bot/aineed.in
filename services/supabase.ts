import { createClient } from '@supabase/supabase-js';

// Project credentials from user request
const SUPABASE_URL = 'https://bxqtlsawpyjpqbsbspgm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JwblDkgproER5Il3u9pcCQ_MEZbWDNS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);