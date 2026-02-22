// presentation/middlewares/AuthMiddleware.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import { InvalidCredentialsError } from '../../domain/errors/AdminErrors.js';

export interface AuthenticatedRequest extends FastifyRequest {
  userId: string;
  userRole: 'admin' | 'deliverer';
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function adminOnly(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const payload = request.user as any;
    
    if (payload.role !== 'admin') {
      return reply.status(403).send({ error: 'Forbidden: Admin access only' });
    }
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function delivererOnly(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const payload = request.user as any;
    
    if (payload.role !== 'deliverer') {
      return reply.status(403).send({ error: 'Forbidden: Deliverer access only' });
    }
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}