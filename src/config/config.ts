import { createClient } from "@supabase/supabase-js";

// Create a Supabase client instance
const supabaseUrl = Bun.env["SUPABASE_URL"] as string;
const supabaseKey = Bun.env["SUPABASE_KEY"] as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };


