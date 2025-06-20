import { useState } from 'react'
import { PhotoService } from '@/lib/photoService'
import { Photo } from '@/lib/supabase'

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadPhoto = async (photoBlob: Blob, qrCodeUrl: string): Promise<Photo | null> => {
    setIsUploading(true)
    setError(null)

    try {
      // Converter blob para File
      const fileName = PhotoService.generateFileName('photo.png')
      const file = PhotoService.blobToFile(photoBlob, fileName)

      // Upload da imagem para o Supabase Storage
      const { url, downloadUrl } = await PhotoService.uploadImage(file)

      // Salvar dados no banco
      const photoData = {
        image_url: url,
        download_url: downloadUrl,
        qr_code_url: qrCodeUrl,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type
      }

      const savedPhoto = await PhotoService.savePhoto(photoData)
      
      return savedPhoto
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro no upload:', err)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    uploadPhoto,
    isUploading,
    error,
    clearError
  }
} 