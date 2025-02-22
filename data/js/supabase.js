/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase Config
const supabaseUrl = "";
const supabaseKey = "";
try{
supabase = createClient(supabaseUrl, supabaseKey)
}catch(e){
    if(searchParams.get("page") == "blog")
        ShowToast(e);
}