import type { FastifyInstance } from "fastify";
import type { AdminController, AuthenticateAdminBody, CreateAdminBody } from "../controllers/AdminController.js";

const createAdminSchema = {
  tags: ['Admin'],
  summary: 'Criar um novo administrador',
  description: 'Endpoint público para criar um administrador no sistema',
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { 
        type: 'string', 
        minLength: 3,
        description: 'Nome completo do administrador',
        example: 'Admin Principal' 
      },
      email: { 
        type: 'string', 
        format: 'email',
        description: 'Email do administrador',
        example: 'admin@logistica.com' 
      },
      password: { 
        type: 'string', 
        minLength: 6,
        description: 'Senha do administrador (mínimo 6 caracteres)',
        example: 'admin123456' 
      }
    }
  },
  response: {
    201: {
      description: 'Administrador criado com sucesso',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        email: { type: 'string' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    409: {
      description: 'Email já cadastrado',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

const loginAdminSchema = {
  tags: ['Admin'],
  summary: 'Login de administrador',
  description: 'Autentica um administrador e retorna um token JWT',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { 
        type: 'string', 
        format: 'email',
        description: 'Email do administrador',
        example: 'admin@logistica.com' 
      },
      password: { 
        type: 'string',
        description: 'Senha do administrador',
        example: 'admin123456' 
      }
    }
  },
  response: {
    200: {
      description: 'Login realizado com sucesso',
      type: 'object',
      properties: {
        admin: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            isActive: { type: 'boolean' }
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

export async function adminRoutes(
    fastify: FastifyInstance,
    adminController: AdminController
){
    fastify.post<{ Body: CreateAdminBody }>(
        '/admins', 
        { schema: createAdminSchema }, 
        adminController.create.bind(adminController)
    );
    fastify.post<{ Body: AuthenticateAdminBody }>(
        '/admins/login',
        { schema: loginAdminSchema }, 
        adminController.authenticate.bind(adminController)
    );
}