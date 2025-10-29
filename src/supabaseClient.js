import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// Example format:
// const SUPABASE_URL = 'https://your-project-id.supabase.co';
// const SUPABASE_ANON_KEY = 'your-actual-anon-key-here';

const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);