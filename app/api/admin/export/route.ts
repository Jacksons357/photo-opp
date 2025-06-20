import { NextResponse } from 'next/server'
import { PhotoService } from '@/lib/photoService'

export async function GET() {
  try {
    // Buscar todas as fotos
    const photos = await PhotoService.getRecentPhotos(10000) // Buscar muitas fotos

    // Criar CSV
    const csvHeader = 'ID,Data,Criado em,Nome do Arquivo,Tamanho (bytes),Tipo MIME,URL da Imagem,URL de Download,URL do QR Code\n'
    
    const csvRows = photos.map(photo => {
      const date = new Date(photo.created_at).toLocaleDateString('pt-BR')
      const time = new Date(photo.created_at).toLocaleTimeString('pt-BR')
      
      return [
        photo.id,
        date,
        `${date} ${time}`,
        photo.file_name,
        photo.file_size,
        photo.mime_type,
        photo.image_url,
        photo.download_url,
        photo.qr_code_url
      ].map(field => `"${field}"`).join(',')
    }).join('\n')

    const csvContent = csvHeader + csvRows

    // Retornar arquivo CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fotos-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 