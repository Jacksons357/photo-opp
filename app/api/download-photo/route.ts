import { NextRequest, NextResponse } from 'next/server'
import { PhotoService } from '@/lib/photoService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('id')
    const directUrl = searchParams.get('url')

    // Se tem URL direta, redirecionar para download
    if (directUrl) {
      return NextResponse.redirect(directUrl)
    }

    // Se tem ID, buscar a foto no banco
    if (photoId) {
      const photo = await PhotoService.getPhotoById(photoId)
      
      if (!photo) {
        return NextResponse.json(
          { error: 'Foto não encontrada' },
          { status: 404 }
        )
      }

      // Redirecionar para a URL de download
      return NextResponse.redirect(photo.download_url)
    }

    // Se não tem nem ID nem URL, erro
    return NextResponse.json(
      { error: 'ID da foto ou URL é obrigatório' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro no download:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 