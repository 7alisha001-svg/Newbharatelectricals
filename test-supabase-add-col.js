import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

// Check if we can add a column using an rpc or if it's open
// We likely can't from the JS client using anon key.
