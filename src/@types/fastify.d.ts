// @types/fastify.d.ts
import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user: {
      sub: string;
      role: 'admin' | 'deliverer';
      email?: string;
    };
  }

  interface FastifyReply {
    sign(payload: object, options?: object): string;
  }

  interface FastifyInstance {
    jwt: {
      sign(payload: object, options?: object): string;
      verify(token: string): any;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: 'admin' | 'deliverer';
      email?: string;
    };
    user: {
      sub: string;
      role: 'admin' | 'deliverer';
      email?: string;
    };
  }
}