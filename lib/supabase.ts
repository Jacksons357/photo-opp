import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas')
  console.warn('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Tipos para as fotos
export interface Photo {
  id: string
  image_url: string
  download_url: string
  qr_code_url: string
  created_at: string
  file_name: string
  file_size: number
  mime_type: string
}

// Tipos para inserção (sem id e created_at)
export interface PhotoInsert {
  image_url: string
  download_url: string
  qr_code_url: string
  file_name: string
  file_size: number
  mime_type: string
} 