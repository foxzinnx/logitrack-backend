# API de Logística e Rastreamento

API RESTful para gerenciamento de entregas e rastreamento de encomendas, desenvolvida com Node.js, TypeScript, Fastify e Prisma, seguindo os princípios de Clean Architecture e Domain-Driven Design (DDD).

## Tecnologias

- **Node.js** 
- **TypeScript**
- **Fastify** 
- **Prisma** 
- **PostgreSQL**
- **JWT** 
- **Vitest**
- **Swagger**

## Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
src/
├── domain/               # Camada de Domínio
│   ├── entities/        # Entidades de negócio
│   ├── value-objects/   # Objetos de valor
│   ├── repositories/    # Interfaces dos repositórios
│   └── errors/          # Erros de domínio
├── application/         # Camada de Aplicação
│   ├── use-cases/       # Casos de uso
│   ├── dtos/            # Data Transfer Objects
│   └── providers/       # Interfaces de providers
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/        # Implementação do Prisma
│   └── providers/       # Implementação de providers
└── presentation/        # Camada de Apresentação
    ├── http/            # Controllers e rotas
    ├── middlewares/     # Middlewares HTTP
    └── factories/       # Fábricas de dependências
```

### Diagrama da Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│            (Controllers, Routes, Middlewares)        │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                 Application Layer                    │
│              (Use Cases, DTOs, Interfaces)           │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   Domain Layer                       │
│        (Entities, Value Objects, Business Rules)     │
└──────────────────────────────────────────────────────┘
                     ▲
┌────────────────────┴─────────────────────────────────┐
│               Infrastructure Layer                   │
│          (Prisma, Database, External Services)       │
└──────────────────────────────────────────────────────┘
```

## Funcionalidades

### Administradores (admins)
- ✅ Cadastro e autenticação de administradores
- ✅ Criação de encomendas
- ✅ Cadastro de entregadores
- ✅ Atribuição manual de entregas
- ✅ Visualização de todas as entregas

### Entregadores (deliverers)
- ✅ Autenticação com CPF e senha
- ✅ Mudança de status (Online/Offline/Ocupado)
- ✅ Aceitar entregas disponíveis
- ✅ Marcar entregas como concluídas (com foto obrigatória)
- ✅ Visualizar minhas entregas

### Encomendas (packages)
- ✅ Criação de encomendas
- ✅ Rastreamento de status
- ✅ Histórico de entregas
- ✅ Comprovação fotográfica de entrega
- ✅ Sistema de atribuição de entregadores

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Existem dois tipos de usuários:

- **Admin**: Gerencia o sistema, cria encomendas e entregadores
- **Deliverer**: Realiza as entregas

## Documentação da API

A documentação interativa está disponível via **Swagger UI**:

```
http://localhost:3333/docs
```

### Principais Endpoints

#### Admin
- `POST /api/v1/admins` - Criar administrador
- `POST /api/v1/admins/login` - Login de administrador

#### Deliverer
- `POST /api/v1/deliverers` - Criar entregador (requer auth admin)
- `POST /api/v1/deliverers/login` - Login de entregador
- `GET /api/v1/deliverers/active` - Listar entregadores ativos (requer auth admin)
- `PATCH /api/v1/deliverers/:id/status` - Atualizar status (requer auth deliverer)

#### Package
- `POST /api/v1/packages` - Criar encomenda (requer auth admin)
- `GET /api/v1/packages/:id` - Obter detalhes da encomenda (requer auth)
- `PATCH /api/v1/packages/:id/assign` - Atribuir entregador (requer auth admin)
- `PATCH /api/v1/packages/:id/accept` - Aceitar encomenda (requer auth deliverer)
- `PATCH /api/v1/packages/:id/deliver` - Marcar como entregue (requer auth deliverer)
- `GET /api/v1/packages/me` - Minhas entregas (requer auth deliverer)
- `GET /api/v1/packages/deliverer/:delivererId` - Entregas de um entregador (requer auth)

## Como Executar

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/foxzinnx/logitrack-backend.git
cd api-logistica
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://user:password@localhost:5432/logistica?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura"
```

4. Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
```
5. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

## Testes

Execute os testes unitários:

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Gerar coverage
npm run test:coverage
```

## Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm run build        # Compila o projeto para produção
npm start            # Inicia o servidor em modo produção
npm test             # Executa os testes
npm run test:watch   # Executa os testes em modo watch
npm run test:coverage # Gera relatório de cobertura de testes
```

## Fluxo de Uso

### 1. Criar um Admin
```http
POST /api/v1/admins
{
  "name": "Admin Principal",
  "email": "admin@logistica.com",
  "password": "admin123456"
}
```

### 2. Login do Admin
```http
POST /api/v1/admins/login
{
  "email": "admin@logistica.com",
  "password": "admin123456"
}
```

### 3. Criar um Entregador
```http
POST /api/v1/deliverers
Authorization: Bearer {admin_token}
{
  "name": "João Silva",
  "cpf": "123.456.789-09",
  "phone": "(11) 99999-9999",
  "password": "entregador123"
}
```

### 4. Login do Entregador
```http
POST /api/v1/deliverers/login
{
  "cpf": "123.456.789-09",
  "password": "entregador123"
}
```

### 5. Criar uma Encomenda
```http
POST /api/v1/packages
Authorization: Bearer {admin_token}
{
  "recipientName": "Maria Santos",
  "recipientPhone": "(47) 98888-8888",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 501",
  "neighborhood": "Centro",
  "city": "Itajaí",
  "state": "SC",
  "zipCode": "88301-000"
}
```
### 6. Marcar como Entregue
```http
PATCH /api/v1/packages/{packageId}/deliver
Authorization: Bearer {deliverer_token}
{
  "photoUrl": "https://exemplo.com/foto-entrega.jpg"
}
```

## Status de Encomendas

- `PENDING` - Aguardando atribuição
- `AWAITING_PICKUP` - Aguardando coleta
- `PICKED_UP` - Coletada pelo entregador
- `IN_TRANSIT` - Em trânsito
- `DELIVERED` - Entregue
- `RETURNED` - Devolvida

## 👤 Status de Entregadores

- `OFFLINE` - Desconectado
- `ONLINE` - Disponível para aceitar entregas
- `BUSY` - Realizando uma entrega

## 🎯 Regras de Negócio

1. ✅ Apenas **admins** podem criar encomendas e entregadores
2. ✅ Entregador precisa estar **ONLINE** para aceitar entregas
3. ✅ **Foto é obrigatória** para marcar entrega como concluída
4. ✅ Uma encomenda só pode ter **um entregador** por vez
5. ✅ Entregador só pode ver **suas próprias entregas**
6. ✅ Admin pode ver **todas as entregas**

## Segurança

- ✅ Senhas são hasheadas com **bcrypt**
- ✅ Autenticação via **JWT**
- ✅ Validação de CPF
- ✅ Validação de Email
- ✅ Middlewares de autorização (Admin/Deliverer)
- ✅ Tratamento de erros customizados

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Autor

**Bryan Gomes**
- GitHub: [@foxzinnx](https://github.com/foxzinnx)
- LinkedIn: [Bryan Gomes](https://linkedin.com/in/bryangomes)
- Email: bryangomes16624@gmail.com

⭐ Se este projeto te ajudou, deixe uma estrela!