import { createClient } from "@supabase/supabase-js";

// Usamos las variables públicas para el cliente, o las variables de servicio en el backend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Cliente principal (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con permisos bypass RLS, útil en el backend si el RLS estuviera activado
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;
