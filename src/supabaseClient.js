import { createClient } from '@supabase/supabase-js';

// Your Supabase project configuration
const SUPABASE_URL = 'https://zpaocnpvwogirmgqclnw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYW9jbnB2d29naXJtZ3FjbG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Njc2MTYsImV4cCI6MjA3NzI0MzYxNn0.2YQ4yNeRXtifNoIcdJTTDOuUxOVDibO0djX3Jk4YeKA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);