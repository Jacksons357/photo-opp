'use client'
import { useState, useEffect } from 'react'
import { Photo } from '@/lib/supabase'

interface DailyChartProps {
  photos: Photo[]
}

interface DailyData {
  date: string
  count: number
}

export default function DailyChart({ photos }: DailyChartProps) {
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    if (photos.length === 0) return

    // Agrupar fotos por dia
    const dailyMap = new Map<string, number>()
    
    photos.forEach(photo => {
      const date = new Date(photo.created_at).toLocaleDateString('pt-BR')
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
    })

    // Converter para array e ordenar por data
    const sortedData = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Últimos 7 dias

    setDailyData(sortedData)
    setMaxCount(Math.max(...sortedData.map(d => d.count), 1))
  }, [photos])

  if (dailyData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Participações por Dia</h3>
        <div className="text-center py-8 text-gray-500">
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Participações por Dia (Últimos 7 dias)</h3>
      
      <div className="space-y-3">
        {dailyData.map((day) => (
          <div key={day.date} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">
              {day.date}
            </div>
            <div className="flex-1 ml-4">
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full transition-all duration-300"
                    style={{
                      width: `${(day.count / maxCount) * 100}%`
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {day.count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Total: {dailyData.reduce((sum, day) => sum + day.count, 0)} participações
      </div>
    </div>
  )
} 