#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Configuração
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.log('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProduction() {
  console.log('🧪 Testando configuração de produção...\n')

  try {
    // Teste 1: Conexão com banco
    console.log('1. Testando conexão com banco...')
    const { error: dbError } = await supabase.from('photos').select('count').limit(1)
    if (dbError) throw new Error(`Banco: ${dbError.message}`)
    console.log('✅ Conexão com banco OK')

    // Teste 2: Storage
    console.log('2. Testando storage...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    if (storageError) throw new Error(`Storage: ${storageError.message}`)
    
    const photosBucket = buckets.find(b => b.name === 'photos')
    if (!photosBucket) throw new Error('Bucket "photos" não encontrado')
    console.log('✅ Storage OK')

    // Teste 3: Políticas RLS
    console.log('3. Testando políticas RLS...')
    const { error: policyError } = await supabase.storage.from('photos').list('', { limit: 1 })
    if (policyError) throw new Error(`Políticas: ${policyError.message}`)
    console.log('✅ Políticas RLS OK')

    console.log('\n🎉 Tudo configurado corretamente para produção!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Configure CORS no Supabase Dashboard')
    console.log('2. Faça deploy no Vercel')
    console.log('3. Configure variáveis de ambiente no Vercel')
    console.log('4. Teste o QR code em produção')

  } catch (error) {
    console.error(`❌ Erro: ${error.message}`)
    console.log('\n🔧 Soluções:')
    console.log('- Verifique as variáveis de ambiente')
    console.log('- Execute as queries SQL no Supabase')
    console.log('- Configure as políticas RLS')
    process.exit(1)
  }
}

testProduction() 