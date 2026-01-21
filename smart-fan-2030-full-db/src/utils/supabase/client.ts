import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Ne pas casser le build: l'UI affichera un message d'erreur.
  console.warn("Supabase env missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY")
}

// Client Supabase (même si vide, l'app ne crashe pas)
export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
)
