import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isDemo = !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here'

export const DEMO_MODE = isDemo

export const supabase = isDemo
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)
