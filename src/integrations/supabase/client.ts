
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mcpoanmkjmjorsdjwkze.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcG9hbm1ram1qb3JzZGp3a3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTc3MzQsImV4cCI6MjA1NzA5MzczNH0.u9pdJPV3VQyUC8YO_hbFulhTDzDcz5yWYdARzUj6cUc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
