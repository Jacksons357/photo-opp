import Link from 'next/link'

export default function SupabaseError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configuração Necessária
        </h1>
        
        <p className="text-gray-600 mb-6">
          O Supabase não está configurado corretamente. Para usar o painel administrativo, você precisa configurar as variáveis de ambiente.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Configure no arquivo .env.local:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase`}
          </pre>
        </div>
        
        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Voltar para o Início
          </Link>
          
          <Link
            href="/test"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Testar Configuração
          </Link>
        </div>
      </div>
    </div>
  )
} 