# VLab Desafio — Sistema de Eventos e Check-in

Este projeto é a implementação do desafio **VLab**, um sistema web para **gestão de eventos, participantes e regras de check-in**, construído com as melhores práticas de **Front-end** e **Back-end**.

## 🧰 Tecnologias Utilizadas

- **Front-end**: Next.js 16 (App Router), React, Tailwind CSS, shadcn/ui  
- **Back-end**: Next.js (Route Handlers), Prisma ORM, SQLite  
- **Validação**: Zod, React Hook Form  
- **Autenticação**: JWT (Jose), com token salvo via LocalStorage + Context API  

***

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- npm

### 1. Clonar e Instalar

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_super_segura"
```

### 3. Banco de Dados e Seed

Gere o client do Prisma e aplique as migrations iniciais (banco SQLite local):

```bash
npx prisma generate
npx prisma migrate dev
```

Execute o script de seed para popular os dados iniciais de administrador e do primeiro evento:

```bash
npx tsx prisma/seed.ts
```

Isso criará um usuário administrador padrão:

- **E-mail:** admin@vlab.com  
- **Senha:** 123

### 4. Rodar o Servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

***

## 🧩 Arquitetura (Components vs Modules)

O projeto utiliza uma **arquitetura modular por contexto** para manter alta coesão e baixo acoplamento:

- `src/app`: Responsável **apenas pelo roteamento** (App Router) e pela integração entre UI e API.  
- `src/components`: Componentes globais e reutilizáveis (botões, modais, layout base).  
- `src/modules`: Cada funcionalidade possui sua própria pasta (ex: `auth`, `eventos`, `participantes`, `regras-checkin`).  
  - Dentro de cada módulo:  
    - `components`: componentes específicos da feature  
    - `schemas`: validações com Zod  
    - `server`: regras de negócio e repositórios (Prisma)  
    - `types`: tipagens TypeScript  
    - `services`: consumo de APIs no cliente  
- `src/lib`: Funções e utilitários globais (helpers de autenticação, erro, singleton do Prisma, axios/fetch client)

***

## ⚙️ Regras de Conflito de Check-in

A regra de conflito de check-in é implementada em `regras-checkin-schema.ts` usando **Zod** e **hooks puros**.

**Definição da regra:**

Entre as regras **ativas** de um evento, **não é permitido** que os tipos **DOCUMENTO** e **PAGAMENTO** estejam ativados simultaneamente, para evitar atrito duplo na recepção.

- O **front-end** valida preventivamente com estado controlado.  
- O **back-end** bloqueia requisições inválidas, retornando `400 Bad Request` caso o cliente tente burlar a validação manualmente (por exemplo, alterando o JSON da API).