import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente Supabase para uso no navegador
 * Permite autenticação com Google e consultas ao banco PostgreSQL
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retorna null ou mock quando não configurado, evitando crash do app
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
