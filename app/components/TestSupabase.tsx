'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PhotoService } from '@/lib/photoService'

export default function TestSupabase() {
  const [testResult, setTestResult] = useState<string>('')
  const [isTesting, setIsTesting] = useState(false)

  const testConnection = async () => {
    setIsTesting(true)
    setTestResult('Testando conexão...')

    try {
      // Teste 1: Conexão básica
      const { error } = await supabase.from('photos').select('count').limit(1)
      
      if (error) {
        throw new Error(`Erro na conexão: ${error.message}`)
      }

      setTestResult('✅ Conexão com Supabase funcionando!')
    } catch (error) {
      setTestResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsTesting(false)
    }
  }

  const testStorage = async () => {
    setIsTesting(true)
    setTestResult('Testando storage...')

    try {
      // Teste 2: Verificar se o bucket existe
      const { data: buckets, error } = await supabase.storage.listBuckets()
      
      if (error) {
        throw new Error(`Erro ao listar buckets: ${error.message}`)
      }

      const photosBucket = buckets.find(bucket => bucket.name === 'photos')
      
      if (!photosBucket) {
        throw new Error('Bucket "photos" não encontrado')
      }

      setTestResult('✅ Storage configurado corretamente!')
    } catch (error) {
      setTestResult(`❌ Erro no storage: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsTesting(false)
    }
  }

  const testRecentPhotos = async () => {
    setIsTesting(true)
    setTestResult('Buscando fotos recentes...')

    try {
      const photos = await PhotoService.getRecentPhotos(5)
      setTestResult(`✅ Encontradas ${photos.length} fotos recentes`)
    } catch (error) {
      setTestResult(`❌ Erro ao buscar fotos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste do Supabase</h2>
      
      <div className="space-y-3">
        <button
          onClick={testConnection}
          disabled={isTesting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Testar Conexão
        </button>

        <button
          onClick={testStorage}
          disabled={isTesting}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Testar Storage
        </button>

        <button
          onClick={testRecentPhotos}
          disabled={isTesting}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Buscar Fotos Recentes
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
    </div>
  )
} 