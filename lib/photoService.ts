import { supabase, Photo, PhotoInsert } from './supabase'

export class PhotoService {
  // Upload da imagem para o Supabase Storage
  static async uploadImage(file: File): Promise<{ url: string; downloadUrl: string }> {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `photos/${fileName}`

      // Upload do arquivo
      const { error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`)
      }

      // Gerar URL pública para download
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      return {
        url: urlData.publicUrl,
        downloadUrl: urlData.publicUrl
      }
    } catch (error) {
      console.error('Erro no upload da imagem:', error)
      throw error
    }
  }

  // Salvar dados da foto no banco
  static async savePhoto(photoData: PhotoInsert): Promise<Photo> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .insert(photoData)
        .select()
        .single()

      if (error) {
        throw new Error(`Erro ao salvar foto: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      throw error
    }
  }

  // Buscar foto por ID
  static async getPhotoById(id: string): Promise<Photo | null> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Foto não encontrada
        }
        throw new Error(`Erro ao buscar foto: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar foto por ID:', error)
      return null
    }
  }

  // Buscar fotos recentes (últimas 10)
  static async getRecentPhotos(limit: number = 10): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Erro ao buscar fotos:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar fotos recentes:', error)
      return []
    }
  }

  // Converter blob para File
  static blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type })
  }

  // Gerar nome único para o arquivo
  static generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop() || 'png'
    return `photo-${timestamp}-${randomId}.${extension}`
  }
} 