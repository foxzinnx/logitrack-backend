import type { AuthenticateAdminUseCase } from "@/application/use-cases/admin/AuthenticateAdminUseCase.js";
import type { CreateAdminUseCase } from "@/application/use-cases/admin/CreateAdminUseCase.js";
import jwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from "fastify";

export interface CreateAdminBody{
    name: string;
    email: string;
    password: string;
}

export interface AuthenticateBody{
    email: string;
    password: string;
}

export class AdminController{
    constructor(
        private createAdminUseCase: CreateAdminUseCase,
        private authenticateAdminUseCase: AuthenticateAdminUseCase
    ){}

    async create(request: FastifyRequest<{ Body: CreateAdminBody }>, reply: FastifyReply){
        const result = await this.createAdminUseCase.execute(request.body);
        return reply.status(201).send(result);
    }

    async authenticate(request: FastifyRequest<{ Body: AuthenticateBody }>, reply: FastifyReply){
        const result = await this.authenticateAdminUseCase.execute(request.body);
        return reply.status(200).send(result);
    }
}