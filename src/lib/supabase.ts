import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este es el objeto que usarás para hacer consultas, similar a un EntityManager
export const supabase = createClient(supabaseUrl, supabaseAnonKey)