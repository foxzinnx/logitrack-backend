import type { FastifyInstance } from "fastify";
import type { AuthDelivererBody, CreateDelivererBody, DelivererController, UpdateStatusBody, UpdateStatusParams } from "../controllers/DelivererController.js";
import { adminOnly, delivererOnly } from "@/presentation/middlewares/AuthMiddleware.js";

const createDelivererSchema = {
  tags: ['Deliverer'],
  summary: 'Criar um novo entregador',
  description: 'Endpoint para admins criarem entregadores no sistema',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['name', 'cpf', 'phone', 'password'],
    properties: {
      name: { 
        type: 'string', 
        minLength: 3,
        description: 'Nome completo do entregador',
        example: 'João Silva' 
      },
      cpf: { 
        type: 'string',
        pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
        description: 'CPF do entregador (formato: XXX.XXX.XXX-XX)',
        example: '123.456.789-09' 
      },
      phone: { 
        type: 'string',
        description: 'Telefone do entregador',
        example: '(11) 99999-9999' 
      },
      password: { 
        type: 'string', 
        minLength: 6,
        description: 'Senha do entregador',
        example: 'entregador123' 
      }
    }
  },
  response: {
    201: {
      description: 'Entregador criado com sucesso',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        cpf: { type: 'string' },
        phone: { type: 'string' },
        status: { 
          type: 'string', 
          enum: ['OFFLINE', 'ONLINE', 'BUSY'],
          description: 'Status atual do entregador'
        },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    401: {
      description: 'Não autorizado - Token inválido ou ausente',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    403: {
      description: 'Proibido - Apenas admins podem criar entregadores',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    409: {
      description: 'CPF já cadastrado',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

const loginDelivererSchema = {
  tags: ['Deliverer'],
  summary: 'Login de entregador',
  description: 'Autentica um entregador e retorna um token JWT. O entregador fica automaticamente ONLINE.',
  body: {
    type: 'object',
    required: ['cpf', 'password'],
    properties: {
      cpf: { 
        type: 'string',
        description: 'CPF do entregador',
        example: '123.456.789-09' 
      },
      password: { 
        type: 'string',
        description: 'Senha do entregador',
        example: 'entregador123' 
      }
    }
  },
  response: {
    200: {
      description: 'Login realizado com sucesso',
      type: 'object',
      properties: {
        deliverer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            cpf: { type: 'string' },
            phone: { type: 'string' },
            status: { type: 'string', enum: ['OFFLINE', 'ONLINE', 'BUSY'] }
          }
        },
        token: { 
          type: 'string',
          description: 'Token JWT para autenticação' 
        }
      }
    },
    401: {
      description: 'Credenciais inválidas',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

const listActiveDeliverersSchema = {
  tags: ['Deliverer'],
  summary: 'Listar entregadores ativos',
  description: 'Lista todos os entregadores ativos no sistema',
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: 'Lista de entregadores ativos',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          cpf: { type: 'string' },
          phone: { type: 'string' },
          status: { type: 'string', enum: ['OFFLINE', 'ONLINE', 'BUSY'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    },
    401: {
      description: 'Não autorizado',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

const updateStatusSchema = {
  tags: ['Deliverer'],
  summary: 'Atualizar status do entregador',
  description: 'Permite ao entregador mudar seu status (ONLINE, OFFLINE ou BUSY)',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID do entregador'
      }
    }
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { 
        type: 'string', 
        enum: ['ONLINE', 'OFFLINE', 'BUSY'],
        description: 'Novo status do entregador',
        example: 'ONLINE'
      }
    }
  },
  response: {
    204: {
      description: 'Status atualizado com sucesso',
      type: 'null'
    },
    401: {
      description: 'Não autorizado',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    404: {
      description: 'Entregador não encontrado',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

export async function delivererRoutes(
    fastify: FastifyInstance, 
    delivererController: DelivererController
) {

    fastify.post<{ Body: AuthDelivererBody }>(
        '/deliverers/login',
        { schema: loginDelivererSchema },
        delivererController.authenticate.bind(delivererController)
    )

    fastify.post<{ Body: CreateDelivererBody }>(
        '/deliverers',
        { 
            preHandler: [adminOnly],
            schema: createDelivererSchema
        },
        delivererController.create.bind(delivererController)
    );

    fastify.get(
        '/deliverers/active',
        { 
            preHandler: [adminOnly],
            schema: listActiveDeliverersSchema
        },
        delivererController.listActive.bind(delivererController)
    );

    fastify.patch<{ Params: UpdateStatusParams, Body: UpdateStatusBody }>(
        '/deliverers/:id/status',
        { 
            preHandler: [delivererOnly],
            schema: updateStatusSchema
        },
        delivererController.updateStatus.bind(delivererController)
    )
}