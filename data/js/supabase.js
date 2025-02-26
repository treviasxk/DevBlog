/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

try{
    supabase = createClient(SupabaseUrl, SupabaseKey)
}catch(e){
    supabase = null;
}