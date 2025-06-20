# Photo Opp - Teste Técnico Nex Lab

Um sistema moderno de captura de fotos com interface intuitiva e painel administrativo, construído com Next.js, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Captura de Fotos**: Interface de câmera com contador regressivo
- **Preview de Fotos**: Visualização e filtros antes da finalização
- **QR Code**: Geração automática de QR codes para cada foto
- **Painel Administrativo**: Dashboard completo com estatísticas e gerenciamento
- **Exportação de Dados**: Exportação em CSV das fotos capturadas
- **Responsivo**: Interface adaptável para diferentes dispositivos

## 📋 Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm
- Conta no Supabase (gratuita)

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Jacksons357/photo-opp.git
cd photo-opp
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 🗄️ Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto

### 2. Configurar Storage

1. No painel do Supabase, vá para **Storage**
2. Crie um novo bucket chamado `photos`
3. Configure as políticas de acesso:

```sql
-- Política para inserção de fotos
CREATE POLICY "Permitir upload de fotos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos');

-- Política para visualização pública
CREATE POLICY "Permitir visualização pública" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');
```

### 3. Criar Tabela de Fotos

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  download_url TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhor performance nas consultas
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

### Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
# ou
pnpm build
pnpm start
```

## 📱 Como Usar

### 1. Página Inicial (`/`)

- Tela de boas-vindas com logo e botão "Iniciar"
- Clique em "Iniciar" para começar a captura de fotos

### 2. Captura de Fotos (`/picture`)

- **Permissão de Câmera**: O navegador solicitará acesso à câmera
- **Contador Regressivo**: Após clicar no botão de captura, um contador de 3 segundos será iniciado
- **Preview**: Após a captura, você pode visualizar a foto
- **Filtros**: Aplique filtros na foto antes de finalizar
- **Finalização**: Confirme a foto para gerar o QR code

### 3. Painel Administrativo (`/admin`)

Acesse `http://localhost:3000/admin` para:

#### Dashboard Principal

- **Estatísticas**: Total de fotos, fotos do dia, semana e mês
- **Gráfico Diário**: Visualização das capturas por dia
- **Lista de Fotos**: Todas as fotos capturadas com detalhes

#### Funcionalidades do Admin

- **Filtros**: Filtre por data, nome do arquivo ou ID
- **Exportação**: Baixe todos os dados em formato CSV
- **Atualização**: Atualize os dados em tempo real
- **Visualização**: Veja detalhes de cada foto incluindo tamanho e tipo

#### Botões de Ação

- **Exportar CSV**: Baixa relatório completo das fotos
- **Atualizar**: Recarrega os dados do banco
- **Filtros**: Aplica filtros personalizados na lista

## 🏗️ Estrutura do Projeto

```
nex-lab-front/
├── app/                    # App Router do Next.js
│   ├── admin/             # Painel administrativo
│   ├── api/               # APIs do projeto
│   ├── components/        # Componentes React
│   ├── picture/           # Página de captura
│   └── page.tsx           # Página inicial
├── hooks/                 # Custom hooks
├── lib/                   # Serviços e configurações
├── public/                # Arquivos estáticos
└── scripts/               # Scripts utilitários
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executa build de produção
npm run lint         # Executa linter
npm run test:production # Testa build de produção
```

## 📊 APIs Disponíveis

### `/api/admin/export`

- **Método**: GET
- **Função**: Exporta todas as fotos em formato CSV
- **Acesso**: Público (idealmente deveria ter autenticação)

### `/api/download-photo/[id]`

- **Método**: GET
- **Função**: Download de foto específica por ID
- **Parâmetros**: `id` - ID da foto

## 🎨 Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Storage)
- **Câmera**: react-camera-pro
- **QR Code**: qrcode
- **Deploy**: Vercel (configurado)

## 🔒 Segurança

- Variáveis de ambiente para configurações sensíveis
- Políticas de acesso configuradas no Supabase
- Validação de tipos com TypeScript

## 🚀 Deploy

### Vercel (Recomendado)

- https://photo-opp-one.vercel.app/

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se o Supabase está configurado corretamente
3. Verifique os logs do console para erros
4. Abra uma issue no repositório

## 🔄 Atualizações

Para manter o projeto atualizado:

```bash
npm update
# ou
yarn upgrade
# ou
pnpm update
```

---

**Desenvolvido com ❤️ para o teste técnico da NexLab, usando Next.js e Supabase**
