# 🛍️ WbraStore - E-Commerce Completo

> E-commerce moderno e completo construído com Next.js 14, TypeScript, Prisma e Cielo Payments

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0+-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre](#sobre)
- [Features](#features)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API](#api)
- [Deploy](#deploy)

## 🎯 Sobre

WbraStore é um e-commerce full-stack completo com:
- ✅ Sistema de autenticação e autorização
- ✅ Painel administrativo completo
- ✅ Gestão de produtos, categorias e pedidos
- ✅ Carrinho de compras com persistência
- ✅ Checkout completo com pagamento via Cielo
- ✅ Upload de imagens com Uploadthing
- ✅ Design inspirado na Apple (clean e minimalista)

## ✨ Features

### 🛒 Loja Virtual
- [x] Catálogo de produtos com paginação
- [x] Categorias com fotos
- [x] Busca e filtros
- [x] Página de detalhes do produto
- [x] Carrinho de compras (Zustand + localStorage)
- [x] Checkout em 3 etapas
- [x] Integração com Cielo para pagamentos

### 👨‍💼 Painel Admin
- [x] Dashboard com métricas em tempo real
- [x] CRUD completo de produtos
- [x] Upload de múltiplas imagens
- [x] Gestão de categorias
- [x] Gestão de pedidos com atualização de status
- [x] Gestão de usuários e roles
- [x] Proteção por autenticação (apenas admin)

### 💳 Pagamentos
- [x] Integração com Cielo E-Commerce 3.0
- [x] Autorização e captura de pagamentos
- [x] Cancelamento e estorno
- [x] Webhooks para notificações
- [x] Suporte a parcelamento (até 12x)

### 🔐 Autenticação
- [x] Login/Registro com email e senha
- [x] NextAuth.js (Auth.js v5)
- [x] Roles: ADMIN, SELLER, BUYER
- [x] Proteção de rotas por middleware
- [x] Sessões JWT

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** shadcn/ui + Radix UI
- **State Management:** Zustand
- **Validação:** Zod + React Hook Form
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **ORM:** Prisma 6
- **Database:** PostgreSQL (Neon)
- **Autenticação:** NextAuth.js v5
- **Pagamentos:** Cielo E-Commerce 3.0 SDK
- **Upload:** Uploadthing

### DevOps
- **Deploy:** Vercel
- **Database:** Neon (PostgreSQL Serverless)
- **Storage:** Uploadthing CDN
- **Testing:** Vitest + React Testing Library

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture:

- **Domain Layer:** Entidades e interfaces (regras de negócio)
- **Application Layer:** Services e DTOs (casos de uso)
- **Infrastructure Layer:** Repositories e implementações
- **Presentation Layer:** Components e Pages (UI)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL (ou conta no Neon)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/RafhaelPaulino/WbraStore.git
cd WbraStore
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"

# Cielo
CIELO_MERCHANT_ID="seu-merchant-id"
CIELO_MERCHANT_KEY="sua-merchant-key"
CIELO_SANDBOX="true"

# Uploadthing
UPLOADTHING_SECRET="seu-secret"
UPLOADTHING_APP_ID="seu-app-id"
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuração

### Banco de Dados (Neon)

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string para `DATABASE_URL` e `DIRECT_URL`

### Pagamentos (Cielo)

1. Crie uma conta em [Cielo](https://www.cielo.com.br)
2. Acesse o painel de desenvolvedor
3. Obtenha o Merchant ID e Merchant Key
4. Configure em `.env`

### Upload de Imagens (Uploadthing)

1. Crie uma conta em [uploadthing.com](https://uploadthing.com)
2. Crie uma nova app
3. Copie o Secret e App ID para `.env`

## 🚀 Uso

### Usuários de Teste (após seed)

```
Admin:
Email: admin@wbrastore.com
Senha: Admin123!

Comprador:
Email: buyer@wbrastore.com
Senha: Buyer123!
```

### Fluxo de Compra

1. Navegue pelos produtos na home
2. Adicione produtos ao carrinho
3. Clique em "Finalizar Compra"
4. Preencha endereço de entrega
5. Insira dados do cartão
6. Revise e confirme o pedido

### Painel Admin

1. Faça login com uma conta admin
2. Acesse `/admin`
3. Gerencie produtos, pedidos e usuários

## 📡 API

### Endpoints Principais

#### Produtos
```
GET    /api/products              # Listar produtos
POST   /api/products              # Criar produto (admin/seller)
GET    /api/products/[id]         # Buscar produto
PUT    /api/products/[id]         # Atualizar produto
DELETE /api/products/[id]         # Deletar produto
GET    /api/products/slug/[slug]  # Buscar por slug
```

#### Pedidos
```
GET    /api/orders                # Listar pedidos
POST   /api/orders                # Criar pedido
GET    /api/orders/[id]           # Buscar pedido
PUT    /api/orders/[id]           # Atualizar status
DELETE /api/orders/[id]           # Cancelar pedido
```

#### Pagamentos
```
POST   /api/payment/authorize     # Autorizar pagamento
POST   /api/payment/capture       # Capturar pagamento (admin)
POST   /api/payment/cancel        # Cancelar/estornar
```

#### Upload
```
POST   /api/uploadthing           # Upload de imagens
```

## 🌐 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório do GitHub

2. **Configure as variáveis de ambiente**
   - Adicione todas as variáveis do `.env.example`

3. **Deploy**
   - Vercel fará deploy automaticamente
   - A cada push na main, novo deploy é criado

### Variáveis de Ambiente (Produção)

Certifique-se de configurar:
- `DATABASE_URL` e `DIRECT_URL` (Neon)
- `NEXTAUTH_URL` (URL do seu site)
- `NEXTAUTH_SECRET` (openssl rand -base64 32)
- `CIELO_MERCHANT_ID` e `CIELO_MERCHANT_KEY`
- `CIELO_SANDBOX` (false para produção)
- `UPLOADTHING_SECRET` e `UPLOADTHING_APP_ID`

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

- **Rafhael Paulino** - [GitHub](https://github.com/RafhaelPaulino)

---

Desenvolvido com ❤️ por [Claude Code](https://claude.com/claude-code)
