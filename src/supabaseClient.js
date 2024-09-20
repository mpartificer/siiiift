import { createClient } from '@supabase/supabase-js'

export const supabase = createClient("https://iivozawppltyhsrkixlk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdm96YXdwcGx0eWhzcmtpeGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODA3NDQsImV4cCI6MjA0MTY1Njc0NH0.aXIL8StA101tfblFh9yViIlXzwMHNjeoFfeiGu8fXGE');