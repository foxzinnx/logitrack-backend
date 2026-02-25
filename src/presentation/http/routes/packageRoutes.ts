import type { FastifyInstance } from "fastify";
import { PackageController, type AssignPackageBody, type CreatePackageBody, type MarkAsDeliveredBody, type PackageIdParams } from "../controllers/PackageController.js";
import { adminOnly, authMiddleware, delivererOnly } from "@/presentation/middlewares/AuthMiddleware.js";

const createPackageSchema = {
  tags: ['Package'],
  summary: 'Criar uma nova encomenda',
  description: 'Endpoint para admins criarem encomendas no sistema',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['recipientName', 'recipientPhone', 'street', 'number', 'neighborhood', 'city', 'state', 'zipCode'],
    properties: {
      recipientName: { 
        type: 'string',
        description: 'Nome do destinatário',
        example: 'Maria Santos' 
      },
      recipientPhone: { 
        type: 'string',
        description: 'Telefone do destinatário',
        example: '(47) 98888-8888' 
      },
      street: { 
        type: 'string',
        description: 'Nome da rua',
        example: 'Rua das Flores' 
      },
      number: { 
        type: 'string',
        description: 'Número do endereço',
        example: '123' 
      },
      complement: { 
        type: 'string',
        description: 'Complemento (opcional)',
        example: 'Apto 501' 
      },
      neighborhood: { 
        type: 'string',
        description: 'Bairro',
        example: 'Centro' 
      },
      city: { 
        type: 'string',
        description: 'Cidade',
        example: 'Itajaí' 
      },
      state: { 
        type: 'string', 
        minLength: 2, 
        maxLength: 2,
        description: 'Estado (UF)',
        example: 'SC' 
      },
      zipCode: { 
        type: 'string',
        pattern: '^\\d{5}-\\d{3}$',
        description: 'CEP (formato: XXXXX-XXX)',
        example: '88301-000' 
      }
    }
  },
  response: {
    201: {
      description: 'Encomenda criada com sucesso',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        recipientName: { type: 'string' },
        recipientPhone: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            number: { type: 'string' },
            complement: { type: 'string', nullable: true },
            neighborhood: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' }
          }
        },
        status: { 
          type: 'string', 
          enum: ['PENDING', 'AWAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'] 
        },
        delivererId: { type: 'string', format: 'uuid', nullable: true },
        deliveryPhotoUrl: { type: 'string', nullable: true },
        deliveredAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    401: {
      description: 'Não autorizado',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    403: {
      description: 'Proibido - Apenas admins podem criar encomendas',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
};

const assignPackageSchema = {
  tags: ['Package'],
  summary: 'Atribuir encomenda a um entregador (Admin)',
  description: 'Permite ao admin atribuir manualmente uma encomenda a um entregador específico',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID da encomenda'
      }
    }
  },
  body: {
    type: 'object',
    required: ['delivererId'],
    properties: {
      delivererId: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID do entregador',
        example: '550e8400-e29b-41d4-a716-446655440000'
      }
    }
  },
  response: {
    200: {
      description: 'Encomenda atribuída com sucesso',
      type: 'object'
    },
    404: {
      description: 'Encomenda ou entregador não encontrado',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

const markAsDeliveredSchema = {
  tags: ['Package'],
  summary: 'Marcar encomenda como entregue',
  description: 'Permite ao entregador marcar uma encomenda como entregue. Foto de comprovação é obrigatória.',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID da encomenda'
      }
    }
  },
  body: {
    type: 'object',
    required: ['photoUrl'],
    properties: {
      photoUrl: { 
        type: 'string', 
        format: 'uri',
        description: 'URL da foto de comprovação da entrega',
        example: 'https://exemplo.com/foto-entrega.jpg'
      }
    }
  },
  response: {
    200: {
      description: 'Encomenda marcada como entregue',
      type: 'object'
    },
    400: {
      description: 'Foto obrigatória ou status inválido',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

const listMyPackagesSchema = {
  tags: ['Package'],
  summary: 'Listar minhas encomendas',
  description: 'Retorna todas as encomendas do entregador autenticado',
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: 'Lista de encomendas do entregador',
      type: 'array',
      items: { type: 'object' }
    }
  }
};

const listByDelivererSchema = {
  tags: ['Package'],
  summary: 'Listar encomendas de um entregador',
  description: 'Retorna todas as encomendas de um entregador específico',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['delivererId'],
    properties: {
      delivererId: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID do entregador'
      }
    }
  },
  response: {
    200: {
      description: 'Lista de encomendas',
      type: 'array',
      items: { type: 'object' }
    }
  }
};

const getPackageDetailsSchema = {
  tags: ['Package'],
  summary: 'Obter detalhes de uma encomenda',
  description: 'Retorna informações detalhadas de uma encomenda específica',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID da encomenda'
      }
    }
  },
  response: {
    200: {
      description: 'Detalhes da encomenda',
      type: 'object'
    },
    404: {
      description: 'Encomenda não encontrada',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

export async function packageRoutes(
    fastify: FastifyInstance,
    packageController: PackageController
){
    fastify.post<{ Body: CreatePackageBody }>(
        '/packages',
        { 
            preHandler: [adminOnly],
            schema: createPackageSchema
        },
        packageController.create.bind(packageController)
    );

    fastify.patch<{ Params: PackageIdParams, Body: AssignPackageBody }>(
        '/packages/:id/assign',
        { 
            preHandler: [adminOnly],
            schema: assignPackageSchema
        },
        packageController.assignToDeliverer.bind(packageController)
    );

    fastify.patch<{ Params: PackageIdParams, Body: MarkAsDeliveredBody}>(
        '/packages/:id/deliver',
        { 
            preHandler: [delivererOnly],
            schema: markAsDeliveredSchema
        },
        packageController.markAsDelivered.bind(packageController)
    );

    fastify.get(
        '/packages/me',
        { 
            preHandler: [delivererOnly],
            schema: listMyPackagesSchema
        },
        packageController.listMyPackages.bind(packageController)
    );

    fastify.get<{ Params: { delivererId: string } }>(
        '/packages/deliverer/:delivererId',
        { 
            preHandler: [adminOnly],
            schema: listByDelivererSchema
        },
        packageController.listByDeliverer.bind(packageController)
    );

    fastify.get<{ Params: PackageIdParams }>(
        '/packages/:id',
        { 
            preHandler: [adminOnly],
            schema: getPackageDetailsSchema
        },
        packageController.getDetails.bind(packageController)
    );
}