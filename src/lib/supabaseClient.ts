// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://gwayluehplflurcnbscu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXlsdWVocGxmbHVyY25ic2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTg4NzMsImV4cCI6MjA2NDU5NDg3M30.0pxEnefV100UdqRhEV00-9f6iN1m_GHwkJGdfFaebYo'
);
