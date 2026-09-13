// সঠিক Supabase Base URL (শেষে /rest/v1/ থাকবে না)
const SUPABASE_URL = "https://hofpnxgyofjhkhjmjfzn.supabase.co";
const SUPABASE_ANON_KEY = "sb_secret_4cJlxj3M0JR3SBkwoXm7aQ_ensK5ONz";

let supabase = null;
if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client successfully initialized!");
} else {
    console.warn("Supabase CDN library not loaded yet.");
}
