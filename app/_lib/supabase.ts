import {createClient, SupabaseClient} from "@supabase/supabase-js";


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing environment variables for Supabase configuration');
}

export const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);