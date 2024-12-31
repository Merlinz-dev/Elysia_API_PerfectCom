// import { createClient } from "@supabase/supabase-js";

// // Create a Supabase client instance
// const supabaseUrl = Bun.env["SUPABASE_URL"] as string;
// const supabaseKey = Bun.env["SUPABASE_KEY"] as string;

// const supabase = createClient(supabaseUrl, supabaseKey);

// export { supabase };
import knex from "knex";

const supabase = knex({
    client: "pg",
    connection: {
        host: Bun.env["SUPABASE_HOST"],
        user: Bun.env["SUPABASE_USERNAME"],
        password: Bun.env["SUPABASE_PASSWORD"],
        database: Bun.env["SUPABASE_DATABASE"],
    },
});

export { supabase };